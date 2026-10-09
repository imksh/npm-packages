/**
 * composeTemplate.js
 *
 * Core engine for the composable template system.
 *
 * Architecture:
 *   templates/
 *   ├── layers/       # Reusable building blocks (react, node, next, react-native, prisma)
 *   └── presets/      # Preset definitions (preset.json) + optional overrides/
 *
 * Each preset.json defines an ordered list of layers to merge.
 * File precedence: layer[0] < layer[1] < ... < layer[N] < preset overrides/
 * Later layers win — always explicit, never accidental.
 *
 * Supported preset.json schema:
 * {
 *   "layers": [
 *     "react/base",                         // simple: layer path relative to templates/layers/
 *     { "layer": "node/javascript", "dest": "server" }  // monorepo: place into a subdir
 *   ],
 *   "overrides": "overrides/"               // optional: dir relative to preset dir
 * }
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_ROOT = path.resolve(__dirname, "../../templates");

/**
 * Main entry point — compose a preset into targetDir.
 *
 * @param {string} presetName  - Name of the preset (e.g. 'react', 'mern-ts')
 * @param {string} targetDir   - Absolute path to the project destination directory
 * @param {string} projectName - Name to inject into package.json
 */
export async function composeTemplate(presetName, targetDir, projectName) {
  const presetDir = path.join(TEMPLATES_ROOT, "presets", presetName);
  const presetJsonPath = path.join(presetDir, "preset.json");

  if (!fs.existsSync(presetJsonPath)) {
    throw new Error(
      `Preset not found: ${presetName} (expected ${presetJsonPath})`,
    );
  }

  const preset = await fs.readJson(presetJsonPath);
  const layersRoot = path.join(TEMPLATES_ROOT, "layers");

  await fs.ensureDir(targetDir);

  // --- Step 1: Merge layers in order (low → high priority) ---
  for (const entry of preset.layers) {
    const { layer, dest } = normalizeLayerEntry(entry);
    const layerDir = path.join(layersRoot, layer);

    if (!fs.existsSync(layerDir)) {
      throw new Error(
        `Layer directory not found: ${layer} (expected ${layerDir})`,
      );
    }

    const destDir = dest ? path.join(targetDir, dest) : targetDir;
    await fs.ensureDir(destDir);

    await fs.copy(layerDir, destDir, {
      overwrite: true, // later layers intentionally overwrite earlier ones
      filter: (src) => {
        const basename = path.basename(src);
        return basename !== ".DS_Store";
      },
    });
  }

  // --- Step 2: Apply preset-level overrides (highest priority) ---
  if (preset.overrides) {
    const overridesDir = path.join(presetDir, preset.overrides);
    if (fs.existsSync(overridesDir)) {
      await fs.copy(overridesDir, targetDir, {
        overwrite: true,
        filter: (src) => path.basename(src) !== ".DS_Store",
      });
    }
  }

  // --- Step 3: Post-processing ---
  await postProcess(targetDir, projectName);
}

/**
 * Normalize a layer entry to { layer, dest } shape.
 * Accepts both string shorthand and object form.
 */
function normalizeLayerEntry(entry) {
  if (typeof entry === "string") {
    return { layer: entry, dest: null };
  }
  return { layer: entry.layer, dest: entry.dest || null };
}

/**
 * Post-process the generated project:
 * 1. Rename _gitignore → .gitignore (npm strips .gitignore from packages)
 * 2. Copy .env.example → .env if it exists
 * 3. Patch all package.json files with the project name
 */
async function postProcess(targetDir, projectName) {
  // Rename _gitignore → .gitignore (recursively handle monorepo subdirs)
  await renameGitignores(targetDir);

  // Copy .env.example → .env (top-level only for single packages;
  // for monorepos the server subdir has it)
  await copyEnvExamples(targetDir);

  // Patch all package.json files found in the generated project
  await patchPackageNames(targetDir, projectName);
}

async function renameGitignores(dir) {
  // Only rename top-level _gitignore → .gitignore.
  // Sub-package _gitignore files (client/_gitignore, server/_gitignore)
  // are intentionally kept as _gitignore so npm doesn't strip them,
  // matching the original template behavior.
  const gitignoreSrc = path.join(dir, "_gitignore");
  if (fs.existsSync(gitignoreSrc)) {
    await fs.rename(gitignoreSrc, path.join(dir, ".gitignore"));
  }
}

async function copyEnvExamples(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await copyEnvExamples(full);
    } else if (entry.name === ".env.example") {
      const envDest = path.join(dir, ".env");
      if (!fs.existsSync(envDest)) {
        await fs.copy(full, envDest);
      }
    }
  }
}

async function patchPackageNames(dir, projectName) {
  // Only patch the root-level package.json with the project name.
  // Sub-package package.json files (client/, server/, mobile/) retain
  // their template names, matching the original copyTemplate behavior.
  const pkgPath = path.join(dir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }
}

#!/usr/bin/env node
/**
 * derive-js.js
 * Automatically derives JavaScript template layers from TypeScript template layers.
 * Run: npm run sync:templates
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import * as babel from "@babel/core";
import * as prettier from "prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");
const LAYERS_DIR = path.join(ROOT, "templates", "layers");

// The paired layers to synchronize
const PAIRED_LAYERS = [
  { name: "react", tsDir: "react/typescript", jsDir: "react/javascript", type: "react" },
  { name: "next", tsDir: "next/typescript", jsDir: "next/javascript", type: "next" },
  { name: "node", tsDir: "node/typescript", jsDir: "node/javascript", type: "node" },
  { name: "node-prisma", tsDir: "node-prisma/typescript", jsDir: "node-prisma/javascript", type: "node-prisma" },
  { name: "electron", tsDir: "electron/typescript", jsDir: "electron/javascript", type: "electron" },
  { name: "prisma", tsDir: "prisma/typescript", jsDir: "prisma/javascript", type: "prisma" },
];

const TS_DEV_DEPENDENCY_PATTERNS = [
  /^@types\//,
  /^@typescript-eslint\//,
  /^typescript$/,
  /^ts-node$/,
  /^tsx$/,
  /^ts-prune$/,
];

function shouldOmitFile(filename) {
  if (filename.endsWith(".d.ts")) return true;
  if (filename === "tsconfig.json" || filename.startsWith("tsconfig.") && filename.endsWith(".json")) return true;
  if (filename === ".eslintrc.cjs" || filename === ".eslintrc.json" || filename === ".eslintrc.js") return true;
  return false;
}

function getDestFileName(relPath, frameworkType) {
  const ext = path.extname(relPath);
  const baseWithoutExt = relPath.slice(0, -ext.length);

  if (frameworkType === "next" && relPath.startsWith(`src${path.sep}app${path.sep}`)) {
    if (ext === ".tsx" || ext === ".ts") {
      return `${baseWithoutExt}.js`;
    }
  }

  if (ext === ".tsx") return `${baseWithoutExt}.jsx`;
  if (ext === ".ts") return `${baseWithoutExt}.js`;

  return relPath;
}

async function transformCode(code, filename, destPath) {
  const removeUnusedImportsPlugin = {
    visitor: {
      Program: {
        exit(progPath) {
          progPath.traverse({
            ImportDeclaration(declPath) {
              // Keep side-effect imports like import 'dotenv/config'
              if (declPath.node.specifiers.length === 0) return;

              declPath.get("specifiers").forEach((specPath) => {
                if (specPath.isImportSpecifier()) {
                  const localName = specPath.node.local.name;
                  const binding = specPath.scope.getBinding(localName);
                  if (binding && !binding.referenced) {
                    specPath.remove();
                  }
                }
              });

              if (declPath.node.specifiers.length === 0) {
                declPath.remove();
              }
            },
          });
        },
      },
    },
  };

  const transform = babel.transformSync || babel.default?.transformSync;
  const result = transform(code, {
    filename,
    presets: ["@babel/preset-typescript"],
    plugins: ["@babel/plugin-syntax-jsx", removeUnusedImportsPlugin],
    generatorOpts: {
      retainLines: false,
      compact: false,
    },
  });

  const isJsx = destPath.endsWith(".jsx");
  try {
    return await prettier.format(result.code, {
      filepath: destPath,
      parser: "babel",
      semi: true,
      singleQuote: false,
    });
  } catch {
    return result.code;
  }
}

function transformPackageJson(tsPkg, frameworkType) {
  const jsPkg = JSON.parse(JSON.stringify(tsPkg));

  // 1. Update name and description
  if (jsPkg.name) {
    jsPkg.name = jsPkg.name.replace(/-ts(?=-template|$)/g, "");
  }
  if (jsPkg.description) {
    jsPkg.description = jsPkg.description.replace(/ \(TypeScript\)/g, "");
  }

  // 2. Update main entry if pointing to .ts
  if (jsPkg.main && jsPkg.main.endsWith(".ts")) {
    jsPkg.main = jsPkg.main.replace(/\.ts$/, ".js");
  }

  // 3. Update scripts
  if (jsPkg.scripts) {
    const scripts = {};
    for (const [key, val] of Object.entries(jsPkg.scripts)) {
      if (key.startsWith("ts-") || key.startsWith("ts:")) continue;

      if (key === "build" && val.trim() === "tsc") {
        continue; // Pure Node apps don't need a build step in JS
      }

      let scriptVal = val
        .replace(/tsc && /g, "")
        .replace(/\bts,tsx\b/g, "js,jsx")
        .replace(/\bsrc\/\*\*\/\*\.ts\b/g, "src/**/*.js")
        .replace(/\bts\b/g, "js");

      if (key === "start" && scriptVal.includes("tsx src/index.ts")) {
        scriptVal = "node src/index.js";
      }
      if (key === "dev" && scriptVal.includes("tsx watch src/index.ts")) {
        scriptVal = "nodemon src/index.js";
      }

      scripts[key] = scriptVal;
    }
    jsPkg.scripts = scripts;
  }

  // 4. Clean devDependencies
  if (jsPkg.devDependencies) {
    const devDeps = {};
    for (const [dep, version] of Object.entries(jsPkg.devDependencies)) {
      const isTsOnly = TS_DEV_DEPENDENCY_PATTERNS.some((pattern) => pattern.test(dep));
      if (!isTsOnly) {
        devDeps[dep] = version;
      }
    }

    // Node layers use nodemon in JS instead of tsx watch
    if ((frameworkType === "node" || frameworkType === "node-prisma") && !devDeps.nodemon) {
      devDeps.nodemon = "^3.0.1";
    }

    jsPkg.devDependencies = devDeps;
  }

  return jsPkg;
}

async function getAllFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllFiles(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function syncLayer({ name, tsDir, jsDir, type }) {
  const tsFullPath = path.join(LAYERS_DIR, tsDir);
  const jsFullPath = path.join(LAYERS_DIR, jsDir);

  if (!fs.existsSync(tsFullPath)) {
    console.warn(`  [SKIP] TypeScript layer not found: ${tsDir}`);
    return;
  }

  console.log(`Syncing ${name}: ${tsDir} -> ${jsDir}`);

  // Clean the target JS layer directory
  await fs.ensureDir(jsFullPath);
  await fs.emptyDir(jsFullPath);

  const files = await getAllFiles(tsFullPath);
  let convertedCount = 0;
  let copiedCount = 0;

  for (const file of files) {
    const relPath = path.relative(tsFullPath, file);
    const fileName = path.basename(file);

    if (shouldOmitFile(fileName)) {
      continue;
    }

    const destRelPath = getDestFileName(relPath, type);
    const destFullPath = path.join(jsFullPath, destRelPath);
    await fs.ensureDir(path.dirname(destFullPath));

    if (fileName === "package.json") {
      const tsPkg = await fs.readJson(file);
      const jsPkg = transformPackageJson(tsPkg, type);
      await fs.writeJson(destFullPath, jsPkg, { spaces: 2 });
      copiedCount++;
      continue;
    }

    const ext = path.extname(file);
    if (ext === ".ts" || ext === ".tsx") {
      const code = await fs.readFile(file, "utf8");
      const jsCode = await transformCode(code, file, destFullPath);
      await fs.writeFile(destFullPath, jsCode, "utf8");
      convertedCount++;
    } else {
      await fs.copy(file, destFullPath);
      copiedCount++;
    }
  }

  console.log(`  ✓ ${name}: ${convertedCount} files transpiled, ${copiedCount} files copied.`);
}

async function main() {
  console.log("==========================================");
  console.log(" Deriving JavaScript Layers from TypeScript ");
  console.log("==========================================\n");

  for (const layer of PAIRED_LAYERS) {
    await syncLayer(layer);
  }

  console.log("\n✓ All JavaScript template layers are now in sync with TypeScript!");
}

main().catch((err) => {
  console.error("Error deriving JS templates:", err);
  process.exit(1);
});

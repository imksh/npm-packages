#!/usr/bin/env node
/**
 * snapshot-presets.js
 * Generates baseline snapshots of all 13 presets from the current flat template dirs.
 * Run: node scripts/snapshot-presets.js
 * Output: scripts/snapshots/<preset-name>/
 */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const SNAPSHOTS_DIR = path.join(__dirname, 'snapshots');

const PRESETS = [
  'react','react-ts','node','node-ts','node-prisma','node-prisma-ts',
  'mern','mern-ts','mern-react-native','next','next-ts','react-native','production-fullstack',
];

const EXCLUDE_DIRS = new Set(['node_modules','.git','.expo','dist','build']);

async function getAllFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await getAllFiles(full)));
    else files.push(full);
  }
  return files;
}

async function snapshotPreset(name) {
  const templateDir = path.join(TEMPLATES_DIR, name);
  const snapshotDir = path.join(SNAPSHOTS_DIR, name);
  if (!fs.existsSync(templateDir)) { console.warn(`  [WARN] Not found: ${name}`); return 0; }
  await fs.ensureDir(snapshotDir);
  await fs.emptyDir(snapshotDir);
  await fs.copy(templateDir, snapshotDir, {
    filter: (src) => {
      const rel = path.relative(templateDir, src);
      const parts = rel.split(path.sep);
      return !parts.some(p => EXCLUDE_DIRS.has(p)) && path.basename(src) !== '.DS_Store';
    },
  });
  // Rename _gitignore -> .gitignore to simulate what copyTemplate does
  const gitignoreSrc = path.join(snapshotDir, '_gitignore');
  if (fs.existsSync(gitignoreSrc)) await fs.rename(gitignoreSrc, path.join(snapshotDir, '.gitignore'));
  // Patch package.json name
  const pkgPath = path.join(snapshotDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = name;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }
  const files = await getAllFiles(snapshotDir);
  console.log(`  ✓ ${name} (${files.length} files)`);
  return files.length;
}

async function main() {
  console.log('Snapshotting current flat templates...\n');
  await fs.ensureDir(SNAPSHOTS_DIR);
  let total = 0;
  for (const preset of PRESETS) total += await snapshotPreset(preset);
  console.log(`\nDone. ${total} total files across ${PRESETS.length} presets.`);
  console.log(`Snapshots: ${SNAPSHOTS_DIR}`);
}

main().catch(err => { console.error(err); process.exit(1); });

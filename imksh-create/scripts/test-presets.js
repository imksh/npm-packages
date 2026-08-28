#!/usr/bin/env node
/**
 * test-presets.js
 * Runs all 13 presets through the new composer engine and compares
 * the output byte-for-byte against the snapshots captured earlier.
 *
 * Run: node scripts/test-presets.js
 * Exit code 0 = all pass, 1 = failures found
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { composeTemplate } from '../src/utils/composeTemplate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const SNAPSHOTS_DIR = path.join(__dirname, 'snapshots');
const WORK_DIR = path.join(__dirname, 'test-output');

const PRESETS = [
  'react', 'react-ts', 'node', 'node-ts', 'node-prisma', 'node-prisma-ts',
  'mern', 'mern-ts', 'mern-react-native', 'next', 'next-ts',
  'react-native', 'production-fullstack', 'fullstack-prisma',
  'electron', 'electron-ts',
];

function hashFile(p) {
  return crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex');
}

async function getAllFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await getAllFiles(full)));
    else files.push(full);
  }
  return files;
}

async function testPreset(name) {
  const outDir = path.join(WORK_DIR, name);
  const snapshotDir = path.join(SNAPSHOTS_DIR, name);

  await fs.ensureDir(outDir);
  await fs.emptyDir(outDir);

  // Run the composer
  await composeTemplate(name, outDir, name);

  // Collect files from both
  const outFiles = (await getAllFiles(outDir))
    .map(f => path.relative(outDir, f))
    .sort();

  const snapFiles = (await getAllFiles(snapshotDir))
    .map(f => path.relative(snapshotDir, f))
    .filter(f => f !== '.env') // .env is generated from .env.example, skip in snapshot comparison
    .sort();

  const issues = [];

  // Check for missing files (in snapshot but not in output)
  const outSet = new Set(outFiles);
  const snapSet = new Set(snapFiles);

  // Filter out .env from outFiles too for comparison
  const outSetFiltered = new Set(outFiles.filter(f => !f.endsWith('/.env') && f !== '.env'));

  for (const f of snapSet) {
    if (!outSetFiltered.has(f)) {
      issues.push(`  MISSING: ${f}`);
    }
  }

  // Check for extra files (in output but not in snapshot)
  for (const f of outSetFiltered) {
    if (!snapSet.has(f)) {
      issues.push(`  EXTRA:   ${f}`);
    }
  }

  // Check for content differences
  for (const f of snapFiles) {
    if (outSetFiltered.has(f)) {
      const snapHash = hashFile(path.join(snapshotDir, f));
      const outHash = hashFile(path.join(outDir, f));
      if (snapHash !== outHash) {
        issues.push(`  CHANGED: ${f}`);
      }
    }
  }

  return issues;
}

async function main() {
  console.log('Running regression tests...\n');
  await fs.ensureDir(WORK_DIR);

  let totalIssues = 0;
  const results = [];

  for (const preset of PRESETS) {
    process.stdout.write(`  Testing ${preset}...`);
    try {
      const issues = await testPreset(preset);
      if (issues.length === 0) {
        console.log(' ✓ PASS');
        results.push({ preset, pass: true, issues: [] });
      } else {
        console.log(` ✗ FAIL (${issues.length} issues)`);
        issues.forEach(i => console.log(i));
        results.push({ preset, pass: false, issues });
        totalIssues += issues.length;
      }
    } catch (err) {
      console.log(` ✗ ERROR: ${err.message}`);
      results.push({ preset, pass: false, issues: [`ERROR: ${err.message}`] });
      totalIssues += 1;
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  const passed = results.filter(r => r.pass).length;
  const failed = results.length - passed;
  console.log(`Results: ${passed}/${PRESETS.length} passed, ${failed} failed`);

  if (totalIssues > 0) {
    console.log(`\nTotal issues: ${totalIssues}`);
    process.exit(1);
  } else {
    console.log('\nAll presets match baseline snapshots! ✓');
  }
}

main().catch(err => { console.error(err); process.exit(1); });

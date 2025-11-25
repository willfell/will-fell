#!/usr/bin/env node
/**
 * Image Validation CLI for Will Fellhoelter Portfolio
 *
 * Validates that all image references in data files exist on disk,
 * and reports any broken references or orphaned images.
 *
 * Usage: yarn images:validate
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const ROOT_DIR = path.resolve(__dirname, '../..');
const IMAGES_DIR = path.join(ROOT_DIR, 'public/images');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'src/components');

// ANSI colors
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

async function getImageFiles() {
  const pattern = path.join(IMAGES_DIR, '**/*.{jpg,jpeg,png,gif,webp,avif,svg,JPG,JPEG,PNG}');
  const files = await glob(pattern, { nodir: true });
  return new Set(files.map((f) => `/images/${path.relative(IMAGES_DIR, f)}`));
}

function getImageReferences() {
  const references = [];

  // Data files to scan
  const dataFiles = ['data.tsx'];

  for (const file of dataFiles) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Match getImageUrl("/images/...") or "/images/..." patterns
      const matches = line.matchAll(/['"]\/images\/[^'"]+['"]/g);
      for (const match of matches) {
        const imagePath = match[0].slice(1, -1);
        references.push({
          path: imagePath,
          file,
          line: index + 1,
        });
      }
    });
  }

  // Also scan key component files
  const componentFiles = ['MePage.tsx', 'InfoPage.tsx', 'Sections/Hero.tsx'];

  for (const file of componentFiles) {
    const filePath = path.join(COMPONENTS_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const matches = line.matchAll(/['"]\/images\/[^'"]+['"]/g);
      for (const match of matches) {
        const imagePath = match[0].slice(1, -1);
        references.push({
          path: imagePath,
          file: `components/${file}`,
          line: index + 1,
        });
      }
    });
  }

  return references;
}

async function main() {
  console.log(colors.bold('\n=== Will Fellhoelter Image Validator ===\n'));

  const existingImages = await getImageFiles();
  const references = getImageReferences();

  // Find broken references
  const brokenRefs = [];
  const validRefs = new Set();

  for (const ref of references) {
    if (existingImages.has(ref.path)) {
      validRefs.add(ref.path);
    } else {
      brokenRefs.push(ref);
    }
  }

  // Find orphaned images (exist but not referenced)
  const orphanedImages = [...existingImages].filter((img) => !validRefs.has(img));

  // Report results
  let hasErrors = false;

  if (brokenRefs.length > 0) {
    hasErrors = true;
    console.log(colors.red('Broken References:'));
    for (const ref of brokenRefs) {
      console.log(`  ${colors.red('*')} ${ref.path}`);
      console.log(`    ${colors.cyan(`${ref.file}:${ref.line}`)}`);
    }
    console.log('');
  }

  if (orphanedImages.length > 0) {
    console.log(colors.yellow('Orphaned Images (not referenced):'));
    for (const img of orphanedImages.sort()) {
      console.log(`  ${colors.yellow('?')} ${img}`);
    }
    console.log('');
  }

  // Summary
  console.log(colors.bold('=== Summary ==='));
  console.log(`Total images on disk: ${existingImages.size}`);
  console.log(`Total references in data files: ${references.length}`);
  console.log(`${colors.green('Valid references')}: ${validRefs.size}`);
  console.log(`${colors.red('Broken references')}: ${brokenRefs.length}`);
  console.log(`${colors.yellow('Orphaned images')}: ${orphanedImages.length}`);

  if (hasErrors) {
    console.log(colors.red('\nValidation FAILED - fix broken references before deploying'));
    process.exit(1);
  } else if (orphanedImages.length > 0) {
    console.log(colors.yellow('\nValidation PASSED with warnings - consider removing orphaned images'));
    process.exit(0);
  } else {
    console.log(colors.green('\nValidation PASSED'));
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(colors.red('Error:'), err.message);
  process.exit(1);
});

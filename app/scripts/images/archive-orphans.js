#!/usr/bin/env node
/**
 * Archive Orphaned Images CLI
 *
 * Moves orphaned images (not referenced in data files) to _archive/ folder.
 * The _archive/ folder is git-ignored and won't be deployed.
 *
 * Usage: yarn images:archive
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const ROOT_DIR = path.resolve(__dirname, '../..');
const IMAGES_DIR = path.join(ROOT_DIR, 'public/images');
const ARCHIVE_DIR = path.join(IMAGES_DIR, '_archive');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

// ANSI colors
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

async function getImageFiles() {
  const pattern = path.join(IMAGES_DIR, '**/*.{jpg,jpeg,png,gif,webp,avif,JPG,JPEG,PNG}');
  const files = await glob(pattern, {
    nodir: true,
    ignore: ['**/_archive/**'],
  });
  return new Set(files.map((f) => `/images/${path.relative(IMAGES_DIR, f)}`));
}

function getImageReferences() {
  const references = new Set();
  const dataFiles = ['data.tsx'];

  for (const file of dataFiles) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line) => {
      const matches = line.matchAll(/['"]\/images\/[^'"]+['"]/g);
      for (const match of matches) {
        const imagePath = match[0].slice(1, -1);
        references.add(imagePath);
      }
    });
  }

  return references;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function main() {
  console.log(colors.bold('\n=== Archive Orphaned Images ===\n'));

  const existingImages = await getImageFiles();
  const references = getImageReferences();

  // Find orphaned images (exist but not referenced)
  const orphanedImages = [...existingImages].filter((img) => !references.has(img));

  if (orphanedImages.length === 0) {
    console.log(colors.green('No orphaned images found. Nothing to archive.'));
    process.exit(0);
  }

  console.log(`Found ${colors.yellow(orphanedImages.length)} orphaned images to archive.\n`);

  // Create archive directory
  ensureDir(ARCHIVE_DIR);

  let movedCount = 0;
  let errorCount = 0;

  for (const imgPath of orphanedImages.sort()) {
    // imgPath is like /images/gallery/photo.jpg
    // We need to move from public/images/gallery/photo.jpg to public/images/_archive/gallery/photo.jpg
    const relativePath = imgPath.replace('/images/', '');
    const sourcePath = path.join(IMAGES_DIR, relativePath);
    const destPath = path.join(ARCHIVE_DIR, relativePath);

    try {
      // Ensure destination subdirectory exists
      ensureDir(path.dirname(destPath));

      // Move the file
      fs.renameSync(sourcePath, destPath);
      console.log(`  ${colors.cyan('→')} ${relativePath}`);
      movedCount++;
    } catch (err) {
      console.log(`  ${colors.red('✗')} ${relativePath}: ${err.message}`);
      errorCount++;
    }
  }

  // Summary
  console.log(colors.bold('\n=== Summary ==='));
  console.log(`${colors.green('Moved')}: ${movedCount} images`);
  if (errorCount > 0) {
    console.log(`${colors.red('Errors')}: ${errorCount} images`);
  }
  console.log(`\nArchived images are in: ${colors.cyan('public/images/_archive/')}`);
  console.log('This folder is git-ignored and will not be deployed.');
  console.log('\nTo restore an image, move it back to its original location.');
}

main().catch((err) => {
  console.error(colors.red('Error:'), err.message);
  process.exit(1);
});

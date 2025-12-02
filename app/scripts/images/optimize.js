#!/usr/bin/env node
/**
 * Image Optimization CLI for Will Fellhoelter Portfolio
 *
 * Generates optimized WebP and AVIF versions of all images.
 * Original files are preserved.
 *
 * Usage: yarn images:optimize
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const ROOT_DIR = path.resolve(__dirname, '../..');
const IMAGES_DIR = path.join(ROOT_DIR, 'public/images');
const MANIFEST_PATH = path.join(IMAGES_DIR, '.image-manifest.json');

// ANSI colors
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  dim: (text) => `\x1b[2m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

// Quality settings for optimization
const WEBP_QUALITY = 82;
const AVIF_QUALITY = 65;

async function getSourceImages() {
  const pattern = path.join(IMAGES_DIR, '**/*.{jpg,jpeg,png,JPG,JPEG,PNG}');
  const files = await glob(pattern, { nodir: true });
  // Exclude already-optimized files
  return files.filter((f) => !f.endsWith('.webp') && !f.endsWith('.avif'));
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function loadManifest() {
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    }
  } catch (error) {
    console.log(colors.yellow(`Warning: Could not load manifest: ${error.message}`));
  }
  return {};
}

function saveManifest(manifest) {
  try {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  } catch (error) {
    console.log(colors.yellow(`Warning: Could not save manifest: ${error.message}`));
  }
}

async function optimizeImage(sharp, inputPath, manifest) {
  const results = [];
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const basename = path.basename(inputPath, ext);
  const manifestKey = path.relative(IMAGES_DIR, inputPath);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const originalSize = fs.statSync(inputPath).size;

    // Check if source file size matches manifest (detect replaced images)
    const manifestSize = manifest[manifestKey];
    const sizeChanged = manifestSize !== originalSize;

    // Generate WebP version
    const webpPath = path.join(dir, `${basename}.webp`);
    const webpExists = fs.existsSync(webpPath);
    if (!webpExists || sizeChanged) {
      await sharp(inputPath).webp({ quality: WEBP_QUALITY }).toFile(webpPath);

      const webpSize = fs.statSync(webpPath).size;
      const savings = ((1 - webpSize / originalSize) * 100).toFixed(0);
      results.push({
        output: webpPath,
        format: 'WebP',
        size: webpSize,
        savings: `${savings}%`,
        reason: sizeChanged && webpExists ? 'source changed' : 'new',
      });
    }

    // Generate AVIF version
    const avifPath = path.join(dir, `${basename}.avif`);
    const avifExists = fs.existsSync(avifPath);
    if (!avifExists || sizeChanged) {
      await sharp(inputPath).avif({ quality: AVIF_QUALITY }).toFile(avifPath);

      const avifSize = fs.statSync(avifPath).size;
      const savings = ((1 - avifSize / originalSize) * 100).toFixed(0);
      results.push({
        output: avifPath,
        format: 'AVIF',
        size: avifSize,
        savings: `${savings}%`,
        reason: sizeChanged && avifExists ? 'source changed' : 'new',
      });
    }

    return {
      input: inputPath,
      manifestKey,
      originalSize,
      width: metadata.width,
      height: metadata.height,
      outputs: results,
    };
  } catch (error) {
    return {
      input: inputPath,
      error: error.message,
    };
  }
}

async function main() {
  console.log(colors.bold('\n=== Will Fellhoelter Image Optimizer ===\n'));

  // Check if sharp is available
  let sharp;
  try {
    sharp = require('sharp');
  } catch (error) {
    console.log(colors.yellow('Sharp is not installed. Installing...'));
    console.log(colors.dim('Run: yarn install'));
    console.log('');
    process.exit(1);
  }

  const sourceImages = await getSourceImages();
  console.log(`Found ${sourceImages.length} source images to optimize\n`);

  // Load manifest for tracking source file sizes
  const manifest = loadManifest();
  const manifestEntries = Object.keys(manifest).length;
  if (manifestEntries > 0) {
    console.log(`Loaded manifest with ${manifestEntries} entries\n`);
  }

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let newFilesCreated = 0;
  let errors = 0;

  for (const imagePath of sourceImages) {
    const relativePath = path.relative(ROOT_DIR, imagePath);
    process.stdout.write(`Processing ${colors.cyan(relativePath)}... `);

    const result = await optimizeImage(sharp, imagePath, manifest);

    if (result.error) {
      console.log(colors.red(`Error: ${result.error}`));
      errors++;
      continue;
    }

    totalOriginalSize += result.originalSize;

    // Update manifest with current file size
    manifest[result.manifestKey] = result.originalSize;

    if (result.outputs.length === 0) {
      console.log(colors.dim('(already optimized)'));
    } else {
      const outputInfo = result.outputs
        .map((o) => {
          const reasonTag = o.reason === 'source changed' ? colors.yellow(' [source changed]') : '';
          return `${o.format}: ${colors.green(o.savings)} smaller${reasonTag}`;
        })
        .join(', ');
      console.log(outputInfo);
      newFilesCreated += result.outputs.length;

      for (const output of result.outputs) {
        totalOptimizedSize += output.size;
      }
    }
  }

  // Save updated manifest
  saveManifest(manifest);

  // Summary
  console.log(colors.bold('\n=== Summary ==='));
  console.log(`Source images: ${sourceImages.length}`);
  console.log(`New files created: ${newFilesCreated}`);
  console.log(`Total original size: ${formatFileSize(totalOriginalSize)}`);

  if (totalOptimizedSize > 0) {
    const totalSavings = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(0);
    console.log(`Average savings: ${colors.green(totalSavings + '%')}`);
  }

  if (errors > 0) {
    console.log(colors.red(`Errors: ${errors}`));
  }

  console.log(colors.green('\nOptimization complete!'));
}

main().catch((err) => {
  console.error(colors.red('Error:'), err.message);
  process.exit(1);
});

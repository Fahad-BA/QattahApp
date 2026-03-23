#!/usr/bin/env node
/**
 * Script to generate PWA icons from a source SVG.
 * Requires sharp: npm install --save-dev sharp
 */

const fs = require('fs');
const path = require('path');

const sourceSvg = path.join(__dirname, '../public/favicon.svg');
const sizes = [192, 512];

async function generateIcons() {
  try {
    // Dynamically import sharp
    const sharp = await import('sharp');
    
    for (const size of sizes) {
      const outputPath = path.join(__dirname, `../public/pwa-${size}x${size}.png`);
      await sharp.default(sourceSvg)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`Generated ${outputPath}`);
    }
    
    console.log('All icons generated successfully.');
  } catch (error) {
    console.error('Error generating icons:', error.message);
    console.log('Make sure sharp is installed: npm install --save-dev sharp');
    process.exit(1);
  }
}

// Check if sharp is available
if (require.resolve('sharp')) {
  generateIcons();
} else {
  console.log('Sharp not installed. Run: npm install --save-dev sharp');
}
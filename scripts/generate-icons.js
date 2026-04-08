#!/usr/bin/env node
/**
 * Generate all required iOS app icon sizes from the SVG source.
 * Outputs to ios/App/App/Assets.xcassets/AppIcon.appiconset/
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const SVG_PATH = path.join(__dirname, 'app-icon-1024.svg')
const OUTPUT_DIR = path.join(__dirname, '..', 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset')

// All required iOS icon sizes
const SIZES = [
  { size: 1024, name: 'AppIcon-1024.png' },   // App Store
  { size: 180, name: 'AppIcon-180.png' },      // iPhone @3x
  { size: 120, name: 'AppIcon-120.png' },      // iPhone @2x
  { size: 167, name: 'AppIcon-167.png' },      // iPad Pro @2x
  { size: 152, name: 'AppIcon-152.png' },      // iPad @2x
  { size: 76, name: 'AppIcon-76.png' },        // iPad @1x
  { size: 40, name: 'AppIcon-40.png' },        // Spotlight @1x
  { size: 80, name: 'AppIcon-80.png' },        // Spotlight @2x
  { size: 60, name: 'AppIcon-60.png' },        // iPhone @1x
  { size: 58, name: 'AppIcon-58.png' },        // Settings @2x
  { size: 29, name: 'AppIcon-29.png' },        // Settings @1x
  { size: 87, name: 'AppIcon-87.png' },        // Settings @3x
  { size: 20, name: 'AppIcon-20.png' },        // Notification @1x
]

const contentsJson = {
  images: [
    { filename: 'AppIcon-1024.png', idiom: 'universal', platform: 'ios', size: '1024x1024' },
  ],
  info: { author: 'xcode', version: 1 },
}

async function main() {
  const svgBuffer = fs.readFileSync(SVG_PATH)
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  for (const { size, name } of SIZES) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(OUTPUT_DIR, name))
    console.log(`  generated: ${name} (${size}x${size})`)
  }

  // Write Contents.json for Xcode
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'Contents.json'),
    JSON.stringify(contentsJson, null, 2)
  )
  console.log('  wrote: Contents.json')
  console.log('\nAll icons generated successfully!')
}

main().catch((err) => {
  console.error('Icon generation failed:', err)
  process.exit(1)
})

#!/usr/bin/env node
/**
 * Mobile build script for HIVE.
 *
 * Temporarily moves server-only directories (admin, api, legacy routes,
 * middleware) out of the build tree, runs a static export with
 * BUILD_MODE=mobile, then restores everything — even if the build fails.
 */

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const root = path.resolve(__dirname, '..')

// Directories/files to exclude from the mobile build
const EXCLUDE = [
  'app/admin',
  'app/api',
  'app/creator',
  'app/restaurant',
  'app/restaurant-admin',
  'middleware.ts',
]

const TEMP_SUFFIX = '__mobile_excluded'

function move(src, dst) {
  if (fs.existsSync(src)) {
    fs.renameSync(src, dst)
    console.log(`  moved: ${path.relative(root, src)} → ${path.relative(root, dst)}`)
  }
}

function stashExcludes() {
  console.log('\n[build:mobile] Stashing server-only paths...')
  for (const rel of EXCLUDE) {
    move(path.join(root, rel), path.join(root, rel + TEMP_SUFFIX))
  }
}

function restoreExcludes() {
  console.log('\n[build:mobile] Restoring stashed paths...')
  for (const rel of EXCLUDE) {
    move(path.join(root, rel + TEMP_SUFFIX), path.join(root, rel))
  }
}

stashExcludes()

let exitCode = 0
try {
  console.log('\n[build:mobile] Running next build (static export)...\n')
  execSync('cross-env BUILD_MODE=mobile NEXT_PUBLIC_BUILD_MODE=mobile next build', {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, BUILD_MODE: 'mobile', NEXT_PUBLIC_BUILD_MODE: 'mobile' },
  })
  console.log('\n[build:mobile] Build succeeded. Output → out/')
} catch (err) {
  console.error('\n[build:mobile] Build failed.')
  exitCode = 1
} finally {
  restoreExcludes()
}

process.exit(exitCode)

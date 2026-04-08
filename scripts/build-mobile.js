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

// Load .env.local so validation picks up the same vars that next build will use
const envLocalPath = path.join(root, '.env.local')
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}

// Directories/files to exclude from the mobile build
const EXCLUDE = [
  'app/admin',
  'app/api',
  'app/creator',
  'app/restaurant',
  'app/restaurant-admin',
  'app/_landing',
  // Dynamic route pages now use generateStaticParams for static export
  'middleware.ts',
  'sentry.server.config.ts',
]

// Stash directory is OUTSIDE the app/ tree so Next.js doesn't pick it up
const STASH_DIR = path.join(root, '_mobile_stash')

// The mobile root page replaces app/page.tsx during the build
const MOBILE_ROOT_SRC = path.join(root, 'app/_mobile-root/page.tsx')
const LANDING_PAGE = path.join(root, 'app/page.tsx')
const LANDING_PAGE_BACKUP = path.join(STASH_DIR, '__landing_backup.bak')

function move(src, dst) {
  if (!fs.existsSync(src)) return
  try {
    fs.renameSync(src, dst)
  } catch {
    // renameSync fails on Windows/OneDrive for directories — fall back to copy+delete
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
      fs.cpSync(src, dst, { recursive: true })
      fs.rmSync(src, { recursive: true, force: true })
    } else {
      fs.copyFileSync(src, dst)
      fs.unlinkSync(src)
    }
  }
  console.log(`  moved: ${path.relative(root, src)} → ${path.relative(root, dst)}`)
}

function stashExcludes() {
  console.log('\n[build:mobile] Stashing server-only paths...')
  fs.mkdirSync(STASH_DIR, { recursive: true })
  for (const rel of EXCLUDE) {
    const name = rel.replace(/\//g, '__')
    move(path.join(root, rel), path.join(STASH_DIR, name))
  }
}

function restoreExcludes() {
  console.log('\n[build:mobile] Restoring stashed paths...')
  for (const rel of EXCLUDE) {
    const name = rel.replace(/\//g, '__')
    move(path.join(STASH_DIR, name), path.join(root, rel))
  }
  // Clean up stash dir if empty
  try {
    if (fs.readdirSync(STASH_DIR).length === 0) fs.rmdirSync(STASH_DIR)
  } catch { /* ignore */ }
}

function swapInMobileRoot() {
  console.log('\n[build:mobile] Swapping in mobile root page...')
  fs.mkdirSync(STASH_DIR, { recursive: true })
  if (fs.existsSync(LANDING_PAGE)) {
    move(LANDING_PAGE, LANDING_PAGE_BACKUP)
    console.log('  backed up app/page.tsx')
  }
  fs.copyFileSync(MOBILE_ROOT_SRC, LANDING_PAGE)
  console.log('  copied app/_mobile-root/page.tsx → app/page.tsx')
}

function restoreLandingPage() {
  console.log('\n[build:mobile] Restoring landing page...')
  if (fs.existsSync(LANDING_PAGE_BACKUP)) {
    if (fs.existsSync(LANDING_PAGE)) fs.unlinkSync(LANDING_PAGE)
    move(LANDING_PAGE_BACKUP, LANDING_PAGE)
    console.log('  restored app/page.tsx')
  }
}

// Validate required env vars to prevent shipping demo-mode builds
const requiredEnv = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
const missing = requiredEnv.filter((k) => !process.env[k])
if (missing.length > 0) {
  console.error(`\n[build:mobile] ERROR: Missing required environment variables:\n  ${missing.join('\n  ')}`)
  console.error('Set these in .env.local or your CI/CD environment to avoid shipping a demo-mode build.\n')
  process.exit(1)
}

stashExcludes()
swapInMobileRoot()

// Clear .next cache — avoids stale route types from the web build causing TS errors
const nextCache = path.join(root, '.next')
if (fs.existsSync(nextCache)) {
  console.log('\n[build:mobile] Clearing .next cache...')
  try {
    // On Windows/OneDrive, fs.rmSync fails with ENOTEMPTY — use shell delete instead
    execSync(
      process.platform === 'win32' ? 'rd /s /q ".next"' : 'rm -rf .next',
      { cwd: root, shell: true, stdio: 'pipe' }
    )
  } catch { /* ignore errors — stale files don't block the build */ }
}

let exitCode = 0
try {
  console.log('\n[build:mobile] Running next build (static export)...\n')
  execSync('next build', {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, BUILD_MODE: 'mobile', NEXT_PUBLIC_BUILD_MODE: 'mobile' },
  })
  console.log('\n[build:mobile] Build succeeded. Output → out/')
} catch (err) {
  console.error('\n[build:mobile] Build failed.')
  exitCode = 1
} finally {
  restoreLandingPage()
  restoreExcludes()
}

process.exit(exitCode)

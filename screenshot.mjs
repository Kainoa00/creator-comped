import puppeteer from 'puppeteer'

const pages = [
  { url: 'http://localhost:3003', name: '01-landing', width: 1440, height: 900 },
  { url: 'http://localhost:3003/creator/discover', name: '02-creator-map', width: 390, height: 844 },
  { url: 'http://localhost:3003/creator/discover/restaurant-001', name: '03-creator-restaurant', width: 390, height: 844 },
  { url: 'http://localhost:3003/creator/cart', name: '04-creator-cart', width: 390, height: 844 },
  { url: 'http://localhost:3003/creator/redeem', name: '05-creator-redeem', width: 390, height: 844 },
  { url: 'http://localhost:3003/creator/profile', name: '06-creator-profile', width: 390, height: 844 },
  { url: 'http://localhost:3003/restaurant', name: '07-restaurant-staff', width: 1024, height: 768 },
  { url: 'http://localhost:3003/restaurant/manager', name: '08-restaurant-manager', width: 1024, height: 768 },
  { url: 'http://localhost:3003/admin', name: '09-admin-dashboard', width: 1440, height: 900 },
  { url: 'http://localhost:3003/admin/proof', name: '10-admin-proof', width: 1440, height: 900 },
]

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-web-security'] })

for (const page of pages) {
  const p = await browser.newPage()
  await p.setViewport({ width: page.width, height: page.height, deviceScaleFactor: 2 })
  await p.goto(page.url, { waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {})
  await new Promise(r => setTimeout(r, 2500))
  await p.screenshot({ path: `screenshots/${page.name}.png`, fullPage: false })
  console.log(`✓ ${page.name}`)
  await p.close()
}

await browser.close()
console.log('Done')

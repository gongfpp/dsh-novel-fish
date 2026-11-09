// Opt-in real GUI check. Replaces this browser's plugin response only; never installs,
// restarts, sends model messages, or changes the server's installed plugin/settings.
import assert from 'node:assert/strict'
import { readFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const gui = process.env.GUI_URL
const installedRoot = process.env.INSTALLED_PLUGIN_ROOT
assert.ok(gui && installedRoot, 'Set GUI_URL and INSTALLED_PLUGIN_ROOT explicitly')
const playwright = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE ?? 'node_modules/playwright-core/index.js')).href)
const { chromium } = playwright.default ?? playwright
const [installed, candidate] = await Promise.all([
  readFile(resolve(installedRoot, 'lib/client.js'), 'utf8'),
  readFile(resolve(root, 'lib/client.js'), 'utf8'),
])
assert.notEqual(installed, candidate, 'Candidate must differ from installed plugin')
const browser = await chromium.launch({ headless: true, args: ['--no-proxy-server'], ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : { channel: 'chrome' }) })
let replacements = 0
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 960 }, locale: 'zh-CN' })
  // Reuse only this GUI's authentication cookies in memory, never library data.
  // The agent browser is neither controlled nor closed by this opt-in cookie read.
  if (process.env.AGENT_CDP_URL) await context.addCookies(await readGuiCookies(process.env.AGENT_CDP_URL, gui))
  await context.route('**/plugins/**', async route => {
    if (!route.request().url().includes('@gongfpp/dsh-novel-fish/client.js')) return route.continue()
    const response = await route.fetch()
    const body = await response.text()
    assert.equal(body.split(installed).length, 2, 'Must find installed bundle exactly once; refuse unsafe replacement')
    replacements++
    await route.fulfill({ response, body: body.replace(installed, () => candidate) })
  })
  const page = await context.newPage()
  const navigation = await page.goto(gui)
  assert.equal(navigation?.status(), 200, 'GUI access denied; set AGENT_CDP_URL for an authenticated agent browser')
  await page.getByRole('button', { name: /^(插件|Plugins)$/ }).click()
  await page.locator('button[aria-label="查看 小说摸鱼"]').click()
  const settings = page.locator('[data-novel-settings]')
  await settings.waitFor()
  await page.locator('[data-novel-jump]').waitFor()
  assert.equal(replacements, 1)
  // Test only plugin-local IndexedDB in this new disposable browser context.
  await page.locator('[data-novel-file-input]').setInputFiles({
    name: '宿主验收.txt', mimeType: 'text/plain',
    buffer: Buffer.from('第一章 验收\n这是公开的本地验收文本。'.repeat(80)),
  })
  await page.locator('[data-novel-switch-imported]').click()
  await page.locator('[data-novel-jump]').click()
  await page.locator('[data-novel-jump-input]').fill('2')
  await page.locator('[data-novel-jump-confirm]').click()
  await page.locator('[data-novel-jump-input]').waitFor({ state: 'detached' })
  await page.waitForFunction(() => document.querySelector('[data-novel-progress]')?.textContent.includes('1 /'))
  const downloadEvent = page.waitForEvent('download')
  await page.locator('[data-novel-export]').click()
  const download = await downloadEvent
  const chunks = []
  for await (const chunk of await download.createReadStream()) chunks.push(chunk)
  const backup = Buffer.concat(chunks)
  assert.equal(JSON.parse(backup).format, 'dsh-novel-fish-backup')
  await page.locator('[data-novel-backup-input]').setInputFiles({ name: '验收备份.json', mimeType: 'application/json', buffer: backup })
  await page.locator('[data-novel-restore-confirm]').click()
  await page.locator('[data-novel-restore-confirm]').waitFor({ state: 'detached' })
  const screenshot = process.env.CAPTURE_HOST
  if (screenshot) {
    await mkdir(dirname(resolve(screenshot)), { recursive: true })
    await settings.screenshot({ path: resolve(screenshot) })
  }
  console.log(JSON.stringify({ ok: true, environment: 'real DSH GUI; candidate bundle substituted only in disposable browser context', gui, browser: browser.version(), replacements, nativeSettings: true, nativeProgressDialog: true, localImportAndSwitch: true, downloadedBackupBytes: backup.length, restoreDialog: true, serverPluginUnchanged: true, screenshot: screenshot ?? null }, null, 2))
} finally { await browser.close() }

async function readGuiCookies(endpoint, url) {
  const targets = await (await fetch(new URL('/json/list', endpoint))).json()
  const target = targets.find(item => item.type === 'page' && item.url.startsWith(new URL(url).origin))
  assert.ok(target?.webSocketDebuggerUrl, 'Open the authenticated GUI in the agent browser first')
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  try {
    await new Promise((resolve, reject) => {
      socket.addEventListener('open', resolve, { once: true })
      socket.addEventListener('error', reject, { once: true })
    })
    const response = new Promise((resolve, reject) => {
      socket.addEventListener('message', event => {
        const message = JSON.parse(event.data)
        if (message.id !== 1) return
        if (message.error) reject(new Error('Cannot reuse GUI authentication'))
        else resolve(message.result.cookies)
      })
    })
    socket.send(JSON.stringify({ id: 1, method: 'Network.getCookies', params: { urls: [url] } }))
    return (await response).map(({ name, value, domain, path, expires, httpOnly, secure, sameSite }) =>
      ({ name, value, domain, path, expires, httpOnly, secure, ...(sameSite ? { sameSite } : {}) }))
  } finally { socket.close() }
}

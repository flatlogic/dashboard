const fs = require('node:fs')
const path = require('node:path')
const { test, expect } = require('@playwright/test')

test('production Bootstrap blocks loading-text and tooltip sanitizer payloads', async ({
  page
}) => {
  const html = fs.readFileSync('dist/index.html', 'utf8')
  const vendor = html.match(/src="(scripts\/vendor-[^"]+\.js)"/)[1]
  await page.setContent('<button id="probe">Ready</button><button id="tip">Tooltip</button>')
  await page.addScriptTag({ path: path.resolve('dist', vendor) })
  const payload =
    '<img src="data:image/x-invalid;base64,AA==" onerror="window.payloadExecuted = true">'
  await page.evaluate((value) => {
    window.payloadExecuted = false
    window.jQuery('#probe').attr('data-loading-text', value).button('loading')
  }, payload)
  await page.waitForFunction(() => document.querySelector('#probe').disabled)
  await expect(page.locator('#probe img')).toHaveCount(0)
  await expect(page.locator('#probe')).toHaveText(payload)
  await page.evaluate(() => {
    Object.defineProperty(document, 'implementation', { configurable: true, value: {} })
    window
      .jQuery('#tip')
      .tooltip({
        html: true,
        animation: false,
        trigger: 'manual',
        title:
          '<b>Safe label</b><img src="data:image/x-invalid;base64,AA==" onerror="window.payloadExecuted = true">'
      })
      .tooltip('show')
  })
  await expect(page.locator('.tooltip b')).toHaveText('Safe label')
  await expect(page.locator('.tooltip [onerror]')).toHaveCount(0)
  expect(await page.evaluate(() => window.payloadExecuted)).toBe(false)
})

test('terminal preserves commands/output and does not execute terminal markup', async ({
  page
}) => {
  await page.goto('/#/login')
  await expect(page.getByPlaceholder('Username')).toBeVisible()
  const result = await page.evaluate(async () => {
    const commands = []
    const node = window.jQuery('<div id="security-terminal"></div>').appendTo(document.body)
    const service = window.angular.element(document.body).injector().get('terminalService')
    const terminal = service.initTerminalById(
      'security-terminal',
      {
        greetings: false,
        outputLimit: 150,
        name: 'security-regression',
        history: false
      },
      (command) => commands.push(command)
    )
    terminal.echo('Connected')
    terminal.echo('[[;#7f7f00;]Warning]')
    terminal.echo('[[;;;x\" onmouseover=\"window.terminalPayloadExecuted=true]Hover]')
    terminal.echo(
      '[[ terminal::echo("<img src=x onerror=window.terminalPayloadExecuted=true>", {raw:true}) ]]'
    )
    await terminal.exec('status')
    const result = {
      commands,
      text: node.text(),
      maliciousNodes: node.find('[onmouseover], img[onerror]').length,
      executed: window.terminalPayloadExecuted === true
    }
    terminal.clear()
    result.cleared = !node.text().includes('Connected')
    terminal.destroy()
    node.remove()
    return result
  })
  expect(result.commands).toEqual(['status'])
  expect(result.text).toContain('Connected')
  expect(result.text).toContain('Warning')
  expect(result.maliciousNodes).toBe(0)
  expect(result.executed).toBe(false)
  expect(result.cleared).toBe(true)
})

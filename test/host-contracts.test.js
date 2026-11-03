import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('../scripts/check-host-contracts.mjs', import.meta.url))
const run = args => spawnSync(process.execPath, [script, ...args], {
  encoding: 'utf8', timeout: 30000, env: { ...process.env, HOST_ROOT: '' },
})

test('host-contract probe rejects relative installation paths with a JSON failure', () => {
  const result = run(['relative/host'])
  assert.equal(result.status, 1)
  const report = JSON.parse(result.stdout)
  assert.equal(report.ok, false)
  assert.match(report.error, /absolute DSH installation path/)
  assert.equal(report.claims, null, 'failed setup must not claim a measured result')
})

test('host-contract probe exercises a real installation when HOST_ROOT is supplied', {
  skip: process.env.HOST_ROOT ? false : 'Set HOST_ROOT to an absolute installed DSH directory to run real-host integration',
}, () => {
  const result = run([process.env.HOST_ROOT])
  assert.equal(result.status, 0, result.stdout + result.stderr)
  const report = JSON.parse(result.stdout)
  assert.equal(report.ok, true)
  assert.equal(report.claims, 0)
  assert.ok(report.checks.some(check => check.name === 'real SlotCore registrations'))
  assert.ok(report.checks.some(check => check.name === 'real ReasoningRow / DisclosureRow / TextShimmer'))
  assert.ok(report.checks.some(check => check.name === 'adapter anchors for title layers and fold state'))
  assert.ok(report.limitations.some(limit => limit.includes('trusted-user-event')))
})

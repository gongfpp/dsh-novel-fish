import test from 'node:test'
import assert from 'node:assert/strict'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { IndexedDbStorage } from '../src/persistence.js'
import { NovelStore, DEFAULT_SETTINGS } from '../src/store.js'
import { validateBackup, MAX_BACKUP_BYTES } from '../src/backup.js'

async function setup(t, count = 20) {
  const factory = new IDBFactory()
  const a = new IndexedDbStorage(factory, IDBKeyRange), b = new IndexedDbStorage(factory, IDBKeyRange)
  await a.addBook({ id: 'book', title: '测试书', format: 'txt', progress: 0, segmentCount: count },
    Array.from({ length: count }, (_, index) => ({ text: `第${index}段`, chapterTitle: '测试章', chapterIndex: 0 })))
  await a.saveSettings({ ...DEFAULT_SETTINGS, currentBookId: 'book' })
  const first = new NovelStore(a), second = new NovelStore(b)
  await Promise.all([first.ready, second.ready])
  t.after(() => { first.dispose(); second.dispose() })
  return { first, second, a, b }
}

function gate(storage, method, after = false) {
  let release, entered
  const started = new Promise(resolve => { entered = resolve })
  const wait = new Promise(resolve => { release = resolve })
  const original = storage[method].bind(storage)
  let once = true
  storage[method] = async (...args) => {
    if (!once) return original(...args)
    once = false
    const result = after ? await original(...args) : undefined
    entered()
    await wait
    return after ? result : original(...args)
  }
  return { started, release }
}

test('stale tab never rewinds 3 -> 1 and field updates preserve other tab settings', async t => {
  const { first, second, a } = await setup(t)
  for (let i = 0; i < 3; i++) assert.equal((await first.claimPassage(`a${i}`)).index, i)
  assert.equal((await second.claimPassage('b')).index, 3)
  assert.equal((await a.load()).books[0].progress, 4)
  await first.setOption('mainTitle', 'A saved title')
  await second.setOption('continueOnReopen', true)
  assert.equal((await a.load()).settings.mainTitle, 'A saved title')
  assert.equal((await a.load()).settings.continueOnReopen, true)
  await first.refresh()
  assert.equal(first.getSettingsSnapshot().continueOnReopen, true)
})

test('concurrent tabs allocate unique segments in IndexedDB transactions', async t => {
  const { first, second, a } = await setup(t)
  const results = await Promise.all(Array.from({ length: 16 }, (_, i) => (i % 2 ? first : second).claimPassage(`step${i}`)))
  assert.deepEqual(results.map(result => result.index).sort((a, b) => a - b), Array.from({ length: 16 }, (_, i) => i))
  assert.equal((await a.load()).books[0].progress, 16)
})

test('canceled late save cannot undo a newer claim in another tab', async t => {
  const { first, second, a } = await setup(t)
  const blocked = gate(a, 'updateBook', true)
  const pending = first.claimPassage('pending')
  await blocked.started
  assert.equal((await second.claimPassage('other')).index, 1)
  const disable = first.setOption('enabled', false)
  blocked.release()
  assert.equal((await pending).kind, 'empty')
  await disable
  assert.equal((await a.load()).books[0].progress, 2)
})

test('external selection/disable cancels stale passage writes', async t => {
  const { first, second, a } = await setup(t)
  const blocked = gate(a, 'getSegment')
  const pending = first.claimPassage('pending')
  await blocked.started
  await second.setOption('enabled', false)
  blocked.release()
  assert.equal((await pending).kind, 'empty')
  assert.equal((await a.load()).books[0].progress, 0)
})

test('external deletion is atomic and cannot resurrect a book or stale selection', async t => {
  const { first, second, a } = await setup(t)
  const blocked = gate(a, 'updateBook')
  const pending = first.claimPassage('pending')
  await blocked.started
  await second.deleteBook('book')
  blocked.release()
  assert.equal((await pending).kind, 'empty')
  assert.deepEqual((await a.load()).books, [])
  assert.equal((await a.load()).settings.currentBookId, null)
  await first.setOption('mainTitle', 'new')
  assert.equal((await a.load()).settings.currentBookId, null)
})

test('seeking from finished book clears both tabs caches and validates before writing', async t => {
  const { first, second, a } = await setup(t, 2)
  await first.claimPassage('cached')
  await second.claimPassage('other')
  assert.equal((await first.claimPassage('end')).kind, 'end')
  await second.setProgress('book', 0)
  assert.equal((await first.claimPassage('cached')).index, 0)
  await first.setProgress('book', 2)
  assert.equal((await first.claimPassage('cached')).kind, 'end')
  for (const value of [-1, 3, 1.5, NaN, '1']) await assert.rejects(first.setProgress('book', value), /位置无效/u)
  assert.equal((await a.load()).books[0].progress, 2)
})

test('backup round-trip preserves text, chapter metadata, progress and settings; restore is idempotent', async t => {
  const { first, second, a } = await setup(t, 3)
  await first.claimPassage('one')
  await first.setOption('mainTitle', '备份标题')
  const json = await first.exportBackup()
  const backup = await first.readBackup(new File([json], 'backup.json'))
  const storage = new IndexedDbStorage(new IDBFactory(), IDBKeyRange)
  const target = new NovelStore(storage)
  t.after(() => target.dispose())
  await target.ready
  assert.deepEqual(await target.restoreBackup(backup), { added: 1, reused: 0 })
  const book = target.getSnapshot().books[0]
  assert.notEqual(book.id, 'book')
  assert.equal(book.progress, 1)
  assert.equal(target.getSettingsSnapshot().mainTitle, '备份标题')
  assert.equal((await target.claimPassage('read')).index, 1)
  assert.deepEqual(await target.restoreBackup(backup), { added: 0, reused: 1 })
  assert.equal(target.getSnapshot().books[0].progress, 2, 'existing progress wins over old backup')
  assert.equal((await storage.getSegment(book.id, 0)).chapterTitle, '测试章')
  await second.setOption('extraTitle', 'other tab')
  assert.equal((await a.load()).settings.extraTitle, 'other tab')
})

test('invalid/oversized backup is rejected without changing library; unknown fields cannot be restored', async t => {
  const { first, a } = await setup(t, 2)
  const before = await a.exportLibrary()
  const original = JSON.parse(await first.exportBackup())
  for (const mutate of [
    value => { value.version = 2 }, value => { value.books[0].book.progress = 3 },
    value => { value.books[0].segments[0].text = '' }, value => { value.books[0].segments[1] = null },
    value => { value.settings.currentBookId = 'missing' }, value => { value.settings.targetTypes = ['evil'] },
    value => { value.books.push(value.books[0]) },
  ]) {
    const value = structuredClone(original)
    mutate(value)
    await assert.rejects(first.restoreBackup(value), /格式无效/u)
  }
  await assert.rejects(first.readBackup({ size: MAX_BACKUP_BYTES + 1 }), /64 MiB/u)
  await assert.rejects(first.readBackup(new File(['not json'], 'bad.json')), /JSON/u)
  original.settings.targets = [{ sessionId: 'private' }]
  original.books[0].book.bundledId = 'fake'
  original.books[0].segments[0].id = 'poison'
  const cleaned = validateBackup(original)
  assert.equal(Object.hasOwn(cleaned.settings, 'targets'), false)
  assert.equal(Object.hasOwn(cleaned.books[0].book, 'bundledId'), false)
  assert.equal(Object.hasOwn(cleaned.books[0].segments[0], 'id'), false)
  assert.deepEqual(await a.exportLibrary(), before)
})

test('restore ID collisions preserve existing books and failed transaction leaves no partial records', async t => {
  const { first, a } = await setup(t, 2)
  const backup = JSON.parse(await first.exportBackup())
  backup.books[0].segments[0].text = 'different text'
  assert.deepEqual(await first.restoreBackup(backup), { added: 1, reused: 0 })
  assert.equal((await a.load()).books.length, 2)
  assert.equal((await a.getSegment('book', 0)).text, '第0段')
  const before = await a.exportLibrary()
  backup.books[0].book.title = 'Force new book'
  backup.books[0].segments[1].bad = () => {}
  await assert.rejects(a.restoreLibrary(backup), /clone/u)
  assert.deepEqual(await a.exportLibrary(), before)
})

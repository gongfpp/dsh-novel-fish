import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_SETTINGS, NovelStore, passageSnapshotKey } from '../src/store.js'
import { MemoryStorage } from './helpers/memory-storage.js'

function makeStore({ delayReads = 0 } = {}) {
  const storage = new MemoryStorage({
    books: [
      { id: 'book-a', title: 'A/B/C', format: 'txt', segmentCount: 3, progress: 0 },
      { id: 'book-b', title: 'Other', format: 'md', segmentCount: 2, progress: 0 },
    ],
    settings: { ...DEFAULT_SETTINGS, currentBookId: 'book-a' },
    passages: {
      'book-a': [{ text: 'A' }, { text: 'B' }, { text: 'C' }],
      'book-b': [{ text: 'X' }, { text: 'Y' }],
    },
    delayReads,
  })
  return { store: new NovelStore(storage), storage }
}

test('initialization and history-like observation do not consume passages', async () => {
  const { store, storage } = makeStore()
  await store.ready
  assert.equal(storage.books.get('book-a').progress, 0)
  assert.equal(store.getPassageStatus('book-a', 'A').kind, 'empty')
  assert.equal(storage.reads, 0)
})

test('injected snapshot sources stay stable and passage subscriptions do not consume text', async () => {
  const { store, storage } = makeStore()
  const source = store.passageSource
  const initialSnapshot = source.getSnapshot()
  let notifications = 0
  const unsubscribe = source.subscribe(() => { notifications += 1 })
  await store.ready

  assert.equal(storage.reads, 0)
  assert.strictEqual(store.passageSource, source)
  assert.strictEqual(source.getSnapshot(), initialSnapshot)
  const result = await store.claimPassage('A')
  const loadedSnapshot = source.getSnapshot()
  assert.equal(result.passage.text, 'A')
  assert.equal(loadedSnapshot[passageSnapshotKey('book-a', 'A')].kind, 'ready')
  assert.notStrictEqual(loadedSnapshot, initialSnapshot)
  assert.ok(notifications >= 2)

  const afterReady = notifications
  await store.claimPassage('A')
  assert.strictEqual(source.getSnapshot(), loadedSnapshot)
  assert.equal(notifications, afterReady)
  assert.equal(storage.books.get('book-a').progress, 1)
  unsubscribe()
  store.dispose()
})

test('A repeats from its page cache; the first expansion of B gets the next passage', async () => {
  const { store, storage } = makeStore()
  await store.ready
  const a1 = await store.claimPassage('A')
  const a2 = await store.claimPassage('A')
  assert.equal(a1.passage.text, 'A')
  assert.equal(a2.passage.text, 'A')
  assert.equal(storage.books.get('book-a').progress, 1)
  assert.equal(storage.reads, 1)

  const b = await store.claimPassage('B')
  assert.equal(b.passage.text, 'B')
  assert.equal(storage.books.get('book-a').progress, 2)
})

test('concurrent repeated clicks on one target share a single passage load', async () => {
  const { store, storage } = makeStore({ delayReads: 20 })
  await store.ready
  const [first, repeated] = await Promise.all([
    store.claimPassage('A'),
    store.claimPassage('A'),
  ])
  assert.equal(first.passage.text, 'A')
  assert.equal(repeated.passage.text, 'A')
  assert.equal(storage.reads, 1)
  assert.equal(storage.books.get('book-a').progress, 1)
})

test('a failed passage read leaves progress unchanged and can be retried', async () => {
  const { store, storage } = makeStore()
  await store.ready
  storage.failNextRead = true
  const failed = await store.claimPassage('A')
  assert.equal(failed.kind, 'error')
  assert.equal(storage.books.get('book-a').progress, 0)
  assert.equal(store.getPassageStatus('book-a', 'A').kind, 'error')

  const retried = await store.claimPassage('A')
  assert.equal(retried.passage.text, 'A')
  assert.equal(storage.books.get('book-a').progress, 1)
})

test('page remount clears step cache but resumes from stored per-book progress', async () => {
  const { store, storage } = makeStore()
  await store.ready
  assert.equal((await store.claimPassage('old-step')).passage.text, 'A')
  store.dispose()

  const remounted = new NovelStore(storage)
  await remounted.ready
  assert.equal(remounted.getPassageStatus('book-a', 'old-step').kind, 'empty')
  const result = await remounted.claimPassage('old-step')
  assert.equal(result.passage.text, 'B')
  assert.equal(result.index, 1)
  assert.equal(storage.books.get('book-a').progress, 2)
})

test('book switching clears temporary passages and keeps each book progress separate', async () => {
  const { store, storage } = makeStore()
  await store.ready
  assert.equal((await store.claimPassage('A')).passage.text, 'A')
  await store.selectBook('book-b')
  assert.equal(store.getPassageStatus('book-b', 'A').kind, 'empty')
  assert.equal((await store.claimPassage('A')).passage.text, 'X')
  assert.equal(storage.books.get('book-a').progress, 1)
  assert.equal(storage.books.get('book-b').progress, 1)

  await store.selectBook('book-a')
  assert.equal((await store.claimPassage('B')).passage.text, 'B')
  assert.equal(storage.books.get('book-a').progress, 2)
})

function gateNextCall(storage, method) {
  let release
  let entered
  const blocked = new Promise(resolve => { release = resolve })
  const started = new Promise(resolve => { entered = resolve })
  const original = storage[method].bind(storage)
  let gated = false
  storage[method] = async (...args) => {
    if (!gated) {
      gated = true
      entered(args)
      await blocked
    }
    return original(...args)
  }
  return { entered: started, release }
}

test('deleting while a progress save is pending cannot resurrect the removed book', async () => {
  const { store, storage } = makeStore()
  await store.ready
  const gate = gateNextCall(storage, 'updateBook')
  const reading = store.claimPassage('A')
  await gate.entered
  const deleting = store.deleteBook('book-a')
  gate.release()
  assert.equal((await reading).kind, 'empty')
  await deleting
  assert.equal(storage.books.has('book-a'), false)
  assert.equal(await storage.getSegment('book-a', 0), null)
  assert.deepEqual(store.getSnapshot().books.map(book => book.id), ['book-b'])
  assert.equal(store.getSettingsSnapshot().currentBookId, 'book-b')
  store.dispose()
})

test('switching during a pending progress save rolls back the undisplayed passage', async () => {
  const { store, storage } = makeStore()
  await store.ready
  const gate = gateNextCall(storage, 'updateBook')
  const reading = store.claimPassage('A')
  await gate.entered
  const switching = store.selectBook('book-b')
  gate.release()
  assert.equal((await reading).kind, 'empty')
  await switching
  assert.equal(storage.books.get('book-a').progress, 0)
  assert.equal(store.getPassageStatus('book-a', 'A').kind, 'empty')
  assert.equal(store.getSettingsSnapshot().currentBookId, 'book-b')
  await store.selectBook('book-a')
  assert.equal((await store.claimPassage('A')).passage.text, 'A')
  store.dispose()
})

test('rapid type and title settings merge with the latest queued settings', async () => {
  const { store, storage } = makeStore()
  await store.ready
  const gate = gateNextCall(storage, 'saveSettings')
  const first = store.setOption('mainTitle', '思考')
  await gate.entered
  const second = store.setOption('targetType', 'reasoning')
  const third = store.setOption('extraTitle', 'Checking project structure')
  gate.release()
  await Promise.all([first, second, third])
  assert.equal(store.getSettingsSnapshot().mainTitle, '思考')
  assert.equal(store.getSettingsSnapshot().targetType, 'reasoning')
  assert.equal(store.getSettingsSnapshot().extraTitle, 'Checking project structure')
  assert.deepEqual(storage.settings, store.getSettingsSnapshot())
  store.dispose()
})

test('rapid book B then A selection honors the final queued choice', async () => {
  const { store, storage } = makeStore()
  await store.ready
  const gate = gateNextCall(storage, 'saveSettings')
  const first = store.selectBook('book-b')
  await gate.entered
  const second = store.selectBook('book-a')
  gate.release()
  await Promise.all([first, second])
  assert.equal(store.getSettingsSnapshot().currentBookId, 'book-a')
  assert.equal(storage.settings.currentBookId, 'book-a')
  store.dispose()
})

test('concurrent book deletions use serialized current state without restoring removed rows', async () => {
  const { store, storage } = makeStore()
  await store.ready
  const gate = gateNextCall(storage, 'deleteBook')
  const first = store.deleteBook('book-a')
  await gate.entered
  const second = store.deleteBook('book-b')
  gate.release()
  await Promise.all([first, second])
  assert.deepEqual(store.getSnapshot().books, [])
  assert.equal(store.getSettingsSnapshot().currentBookId, null)
  assert.deepEqual([...storage.books.keys()], [])
  assert.equal(storage.settings.currentBookId, null)
  store.dispose()
})

test('an unchanged selection or deletion of another book preserves the ready page cache', async () => {
  const { store, storage } = makeStore()
  await store.ready
  const first = await store.claimPassage('A')
  await store.selectBook('book-a')
  assert.equal(await store.claimPassage('A'), first)
  await store.deleteBook('book-b')
  assert.equal(await store.claimPassage('A'), first)
  assert.equal(storage.books.get('book-a').progress, 1)
  store.dispose()
})

test('a claim requested after a book-switch intent reads the newly selected book', async () => {
  const { store } = makeStore()
  await store.ready
  const switching = store.selectBook('book-b')
  const reading = store.claimPassage('B')
  await switching
  assert.equal((await reading).passage.text, 'X')
  store.dispose()
})

test('failed selection persistence prevents deletion and leaves the selected book usable', async () => {
  const { store, storage } = makeStore()
  await store.ready
  const first = await store.claimPassage('A')
  storage.saveSettings = async () => { throw new Error('settings quota failure') }
  await assert.rejects(store.deleteBook('book-a'), /settings quota failure/u)
  assert.equal(storage.books.has('book-a'), true)
  assert.equal(store.getSnapshot().books.some(book => book.id === 'book-a'), true)
  assert.equal(store.getSettingsSnapshot().currentBookId, 'book-a')
  assert.equal(storage.settings.currentBookId, 'book-a')
  assert.equal(await store.claimPassage('A'), first)
  assert.equal(storage.books.get('book-a').progress, 1)
  store.dispose()
})

test('failed switching cancels an unfinished read without leaving a stuck loading status', async () => {
  const { store, storage } = makeStore()
  await store.ready
  const gate = gateNextCall(storage, 'updateBook')
  const reading = store.claimPassage('A')
  await gate.entered
  storage.saveSettings = async () => { throw new Error('settings quota failure') }
  const switching = store.selectBook('book-b')
  const rejected = assert.rejects(switching, /settings quota failure/u)
  gate.release()
  assert.equal((await reading).kind, 'empty')
  await rejected
  assert.equal(store.getPassageStatus('book-a', 'A').kind, 'empty')
  assert.equal(storage.books.get('book-a').progress, 0)
  assert.equal((await store.claimPassage('A')).passage.text, 'A')
  store.dispose()
})

test('failed hydration blocks later mutations instead of replacing stored settings with defaults', async () => {
  const { storage } = makeStore()
  let writes = 0
  storage.load = async () => { throw new Error('read unavailable') }
  storage.saveSettings = async () => { writes += 1 }
  const store = new NovelStore(storage)
  await store.ready
  assert.match(store.getSnapshot().error, /read unavailable/u)
  await assert.rejects(store.setOption('icon', '🐟'), /本地书库不可用/u)
  await assert.rejects(store.selectBook('book-b'), /本地书库不可用/u)
  await assert.rejects(store.deleteBook('book-a'), /本地书库不可用/u)
  await assert.rejects(store.importFile({ name: 'new.txt', text: async () => 'Text.' }), /本地书库不可用/u)
  assert.equal((await store.claimPassage('A')).kind, 'error')
  assert.equal(writes, 0)
  assert.equal(storage.settings.currentBookId, 'book-a')
  store.dispose()
})

test('type settings preserve existing books/progress while dropping obsolete location lists', async () => {
  const storage = new MemoryStorage({
    books: [{ id: 'existing', title: '原书库', format: 'txt', segmentCount: 3, progress: 2 }],
    settings: { ...DEFAULT_SETTINGS, currentBookId: 'existing', mainTitle: '原自定义标题', targets: [{ sessionId: 'old-session', nodeKey: 'old-step' }], targetKey: 'old-step' },
    passages: { existing: [{ text: 'A' }, { text: 'B' }, { text: 'C' }] },
  })
  const store = new NovelStore(storage)
  await store.ready
  assert.equal(store.getSettingsSnapshot().targetType, 'reasoning')
  assert.equal(store.getSettingsSnapshot().mainTitle, '原自定义标题')
  assert.equal(Object.hasOwn(store.getSettingsSnapshot(), 'targets'), false)
  assert.equal(Object.hasOwn(store.getSettingsSnapshot(), 'targetKey'), false)
  assert.equal(store.getSnapshot().books[0].progress, 2)
  assert.equal(storage.reads, 0)
  await assert.rejects(store.setOption('targetType', 'tool-call'), /仅支持原生思考类型/u)
  await assert.rejects(store.setOption('targetKey', 'another-step'), /未知设置项/u)
  await store.setOption('targetType', 'reasoning')
  assert.equal(Object.hasOwn(storage.settings, 'targets'), false)
  assert.equal(Object.hasOwn(storage.settings, 'targetKey'), false)
  assert.equal(storage.books.get('existing').progress, 2)
  store.dispose()
})

test('end of book does not wrap and target settings contain no passage binding', async () => {
  const { store, storage } = makeStore()
  await store.ready
  assert.equal((await store.claimPassage('A')).passage.text, 'A')
  assert.equal((await store.claimPassage('B')).passage.text, 'B')
  assert.equal((await store.claimPassage('C')).passage.text, 'C')
  const ended = await store.claimPassage('D')
  assert.equal(ended.kind, 'end')
  assert.equal(storage.books.get('book-a').progress, 3)
  assert.equal(storage.reads, 3)
  assert.equal(store.getSettingsSnapshot().targetType, 'reasoning')
  assert.equal(Object.hasOwn(store.getSettingsSnapshot(), 'targets'), false)
  assert.equal(Object.hasOwn(storage.settings, 'targets'), false)
})

/**
 * Tests
 * - returns all js files in the fixtures directory
 * - returns all immediate subdirs of fixtures directory
 * - handles paths with or without slashes
 * - properly ignores files of other extensions
 * - throws error if directory doesn't exist
 * - throws error if given path is not a directory
 */

import FolderRecursiveSearcher from './FolderRecursiveSearcher'

const searcher = new FolderRecursiveSearcher()

test('returns all js files in the fixtures directory', async () => {
  const results = await searcher.recurseDirSearch('fixtures/test-simple', '.js')
  expect(results.length).toBe(4)
  expect(results).toContain('fixtures/test-simple/main.js')
  expect(results).toContain('fixtures/test-simple/src/module.js')
  expect(results).toContain('fixtures/test-simple/src/nonmodule.js')
  expect(results).toContain('fixtures/test-simple/src/another/another.js')
})

test('returns all immediate subdirs of fixtures directory', async () => {
  const results = await searcher.listSubdirs('fixtures')
  expect(results.length).toBe(3)
  expect(results).toContain('fixtures/test-simple')
  expect(results).toContain('fixtures/test-wrongtype')
  expect(results).toContain('fixtures/test-unparseable')
})

test('handles paths in os agnostic way', async () => {
  const results = await searcher.recurseDirSearch('fixtures/test-simple/', '.js')
  expect(results.length).toBe(4)
  expect(results).toContain('fixtures/test-simple/main.js')
  expect(results).toContain('fixtures/test-simple/src/module.js')
  expect(results).toContain('fixtures/test-simple/src/nonmodule.js')
  expect(results).toContain('fixtures/test-simple/src/another/another.js')
})

test('proper ignores files of other extensions', async () => {
  const results = await searcher.recurseDirSearch('fixtures/test-wrongtype/', '.js')
  expect(results.length).toBe(0)
  expect(results).toStrictEqual([])
})

test('throws error if directory does not exist', async () => {
  const path = 'noexists'
  async function shouldThrow () {
    const result = await searcher.recurseDirSearch(path, '.js')
    return result
  }
  await expect(shouldThrow()).rejects.toThrow()
})

test('throws error if given path is not a directory', async () => {
  const path = 'fixtures/main.js'
  async function shouldThrow () {
    const result = await searcher.recurseDirSearch(path, '.js')
    return result
  }
  await expect(shouldThrow()).rejects.toThrow()
})

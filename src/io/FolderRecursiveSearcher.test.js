/**
 * Tests
 * - returns all js files in the fixtures directory
 * - handles paths with or without slashes
 * - properly ignores files of other extensions
 * - throws error if directory doesn't exist
 * - throws error if given path is not a directory
 */

import FolderRecursiveSearcher from './FolderRecursiveSearcher'

test('returns all js files in the fixtures directory', async () => {
  const searcher = new FolderRecursiveSearcher('fixtures/test-simple', '.js')
  const results = await searcher.recursiveFind()
  expect(results.length).toBe(4)
  expect(results).toContain('fixtures/test-simple/main.js')
  expect(results).toContain('fixtures/test-simple/src/module.js')
  expect(results).toContain('fixtures/test-simple/src/nonmodule.js')
  expect(results).toContain('fixtures/test-simple/src/another/another.js')
})

test('handles paths in os agnostic way', async () => {
  const searcher = new FolderRecursiveSearcher('fixtures/test-simple/', '.js')
  const results = await searcher.recursiveFind()
  expect(results.length).toBe(4)
  expect(results).toContain('fixtures/test-simple/main.js')
  expect(results).toContain('fixtures/test-simple/src/module.js')
  expect(results).toContain('fixtures/test-simple/src/nonmodule.js')
  expect(results).toContain('fixtures/test-simple/src/another/another.js')
})

test('proper ignores files of other extensions', async () => {
  const searcher = new FolderRecursiveSearcher('fixtures/test-wrongtype', '.js')
  const results = await searcher.recursiveFind()
  expect(results.length).toBe(0)
  expect(results).toStrictEqual([])
})

test('throws error if directory does not exist', async () => {
  const path = 'noexists'
  async function shouldThrow () {
    const searcher = new FolderRecursiveSearcher(path, '.js')
    const result = await searcher.recursiveFind()
    return result
  }
  await expect(shouldThrow()).rejects.toThrow()
})

test('throws error if given path is not a directory', async () => {
  const path = 'fixtures/main.js'
  async function shouldThrow () {
    const searcher = new FolderRecursiveSearcher(path, '.js')
    const result = await searcher.recursiveFind()
    return result
  }
  await expect(shouldThrow()).rejects.toThrow()
})

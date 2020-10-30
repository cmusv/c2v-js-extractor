/**
 * Test
 * - given an array can split it into 3 based on ratios
 * - generates correct train test val splits from fixtures
 * - Given fixture repo, can generate test files
 */

import ExtractionOrchestrator from './ExtractionOrchestrator'

test('generates correct train test val splits for large arrays', () => {
  const test = []
  for (let i = 0; i < 100; i++) {
    test.push(i)
  }

  expect(test.length).toBe(100)

  const extractor = new ExtractionOrchestrator('out', 'fixtures')

  const { testData, trainData, valData } = extractor.splitData(test, 0.8)

  expect(trainData.length).toBe(64)
  expect(testData.length).toBe(16)
  expect(valData.length).toBe(20)
})

test('generates correct train test val splits for small arrays', () => {
  const test = []
  for (let i = 0; i < 6; i++) {
    test.push(i)
  }

  expect(test.length).toBe(6)

  const extractor = new ExtractionOrchestrator('out', 'fixtures')

  const { testData, trainData, valData } = extractor.splitData(test, 0.6)

  expect(trainData.length).toBe(2)
  expect(testData.length).toBe(2)
  expect(valData.length).toBe(2)
})

test('generates correct train test val splits for small arrays', async () => {
  const extractor = new ExtractionOrchestrator('out', 'fixtures')
  const jsFiles = await extractor.getAllJSFiles()
  expect(jsFiles.length).toBe(5)
})

test('successfully extracts functions from all .js files in data folder', async () => {
  const extractor = new ExtractionOrchestrator('out', 'fixtures')
  const asts = await extractor.extractAsts()
  const allKeys = Object.keys(asts)
  expect(allKeys.length).toBe(7)

  console.log(asts[allKeys[0]])
})

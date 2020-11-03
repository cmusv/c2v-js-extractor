/**
 * Tests
 * - given a test file, can parse correctly to array of fnASTs
 */

import JS2ASTParser from './JS2ASTParser'

test('given a test file, can parse correctly to array of asts', () => {
  const parser = new JS2ASTParser()
  const graphs1 = parser.parse('fixtures/test-simple/main.js')
  expect(graphs1.length).toBe(3)
})

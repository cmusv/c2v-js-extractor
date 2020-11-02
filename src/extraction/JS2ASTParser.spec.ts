/**
 * Tests
 * - given a test file, can parse correctly to array of fnASTs
 */

import JS2ASTParser from './JS2ASTParser'

test('given a test file, can parse correctly to array of asts', () => {
  const parser = new JS2ASTParser()
  const graphs1 = parser.parse('fixtures/test-simple/main.js')
  console.log(graphs1[0].location)
  console.log(graphs1[1].location)
  console.log(graphs1[2].location)
  expect(graphs1.length).toBe(3)
})

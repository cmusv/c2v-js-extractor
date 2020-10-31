/**
 * Tests
 * - throws error if given not valid ast
 * - can convert esprima FunctionDeclaration node into JSFnContextGraph and return context paths
 * - can convert esprima MethodDeclaration node into JSFnContextGraph and return context paths
 */
import * as esprima from 'esprima'
import { JSFnContextGraph } from './JSContext'

const testFn1 = `
function foo() {
  console.log(foo())
  return 1
}
`

const testFn2 = `

function foo(param1, param2) {
  console.log('running function')
  if (param1 === 3) {
    return param2
  } else {
    return param1
  }
}

`

test('can convert esprima FunctionDeclaration node into JSFnContextGraph and return context paths', () => {
  const program = esprima.parseScript(testFn1)
  const fnAst = program.body[0]
  const graph = new JSFnContextGraph(fnAst)

  console.log(graph)
})

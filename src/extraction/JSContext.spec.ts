/**
 * Tests
 * - throws error if given not valid ast
 * - can convert esprima FunctionDeclaration node into JSFnContextGraph and return context paths
 * - can convert esprima MethodDefinition node into JSFnContextGraph and return context paths
 */
import * as esprima from 'esprima'
import { JSFnContextGraph } from './JSContext'

const testFn1 = `
function foo() {
  console.log('hello world')
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

const classMthd1 = `

class Test {
  doSomething() {
    return 1
  }
}


`

test('can convert esprima FunctionDeclaration node into JSFnContextGraph and return context paths', () => {
  const program = esprima.parseScript(testFn1)
  const fn = program.body[0]
  const graph = new JSFnContextGraph('test', fn)
  expect(graph.root.type).toBe('FunctionDeclaration')
  const contextPaths = graph.getAllContextPaths(3, 200)
  expect(contextPaths.length).toBe(2)
})

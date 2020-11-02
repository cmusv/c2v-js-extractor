import Esprima2NodeFactory from './Esprima2NodeFactory'
import * as esprima from 'esprima'
import { JSFnContextNode } from './JSContext'

function str2Node (code: string): any {
  const ast = esprima.parseScript(code)
  return ast.body[0]
}

function expectNodeToBe (node: JSFnContextNode, id: string, type: string, value: string, isTerminal: boolean) {
  expect(node.id).toBe(id)
  expect(node.type).toBe(type)
  expect(node.value).toBe(value)
  expect(node.isTerminal).toBe(isTerminal)
}

test('getChildren does not throw for all valid types', () => {
  for (const type in esprima.Syntax) {
    const fakeNode = {
      type
    }
    const children = Esprima2NodeFactory.getChildren(fakeNode)
    expect(children.length).toBe(0)
  }
})

test('getChildren does not throw for all valid types', () => {
  expect(() => {
    const fakeNode = {
      type: 'Someunsupportedtype'
    }
    Esprima2NodeFactory.getChildren(fakeNode)
  }).toThrow()
})

test('properly serializes simple hello world', () => {
  const fn = `
  function foo() {
    console.log('hello world')
  }
  `

  const ast = esprima.parseScript(fn).body[0]
  const children = Esprima2NodeFactory.getChildren(ast)
  expect(children.length).toBe(2)
  const idNode = children[0]
  const n1 = Esprima2NodeFactory.convertToNode(idNode)
  expect(n1.value).toBe('foo')
})

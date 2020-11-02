
import { JSFnContextNode } from './JSContext'
import { Syntax } from 'esprima'

export default class Esprima2NodeFactory {
  static convertToNode (rawAst: any): JSFnContextNode {
    const type = this.getType(rawAst)
    const id = this.getId()
    const value = this.getValue(rawAst)
    const isTerminal = this.isTerminal(rawAst)

    return new JSFnContextNode(id, type, value, isTerminal)
  }

  static getChildren (rawAst: any): any[] {
    let children: any[]
    switch (rawAst.type) {
      case Syntax.ArrayPattern:
        children = rawAst.elements
        break
      case Syntax.RestElement:
        children = [rawAst.argument]
        break
      case Syntax.AssignmentPattern:
        children = [rawAst.left, rawAst.right]
        break
      case Syntax.ObjectPattern:
        children = rawAst.properties
        break
      case Syntax.ThisExpression:
        children = []
        break
      case Syntax.Identifier:
        children = []
        break
      case Syntax.Literal:
        children = []
        break
      case Syntax.ArrayExpression:
        children = rawAst.elements
        break
      case Syntax.ObjectExpression:
        children = rawAst.properties
        break
      case Syntax.Property:
        children = [rawAst.key, rawAst.value]
        break
      case Syntax.FunctionExpression:
        children = [].concat(rawAst.params)
        children = children.concat([rawAst.body])
        break
      case Syntax.ArrowFunctionExpression:
        children = [].concat(rawAst.params)
        children = children.concat([rawAst.body])
        break
      case Syntax.ClassExpression:
        children = [rawAst.body]
        break
      case Syntax.ClassBody:
        children = rawAst.body
        break
      case Syntax.MethodDefinition:
        children = [rawAst.value]
        break
      case Syntax.TaggedTemplateExpression:
        children = [rawAst.tag, rawAst.quasi]
        break
      case Syntax.TemplateElement:
        children = []
        break
      case Syntax.TemplateLiteral:
        children = [].concat(rawAst.quasis)
        children = children.concat(rawAst.expressions)
        break
      case Syntax.MemberExpression:
        children = [rawAst.object, rawAst.property]
        break
      case Syntax.Super:
        children = []
        break
      case Syntax.MetaProperty:
        children = [rawAst.meta, rawAst.property]
        break
      case Syntax.CallExpression:
        children = [rawAst.callee].concat(rawAst.arguments)
        break
      case Syntax.NewExpression:
        children = [rawAst.callee].concat(rawAst.arguments)
        break
      case Syntax.SpreadElement:
        children = [rawAst.argument]
        break
      case Syntax.UpdateExpression:
        children = [rawAst.argument]
        break
      case Syntax.AwaitExpression:
        children = [rawAst.argument]
        break
      case Syntax.UnaryExpression:
        children = [rawAst.argument]
        break
      case Syntax.BinaryExpression:
        children = [rawAst.left, rawAst.right]
        break
      case Syntax.LogicalExpression:
        children = [rawAst.left, rawAst.right]
        break
      case Syntax.ConditionalExpression:
        children = [rawAst.test, rawAst.consequent, rawAst.alternate]
        break
      case Syntax.YieldExpression:
        if (rawAst.argument) {
          children = [rawAst.argument]
        } else {
          children = []
        }
        break
      case Syntax.AssignmentExpression:
        children = [rawAst.left, rawAst.right]
        break
      case Syntax.SequenceExpression:
        children = rawAst.expressions
        break
      case Syntax.BlockStatement:
        children = rawAst.body
        break
      case Syntax.BreakStatement:
        children = []
        if (rawAst.label) children.push(rawAst.label)
        break
      case Syntax.ClassDeclaration:
        children = [rawAst.superClass, rawAst.body]
        break
      case Syntax.ContinueStatement:
        children = []
        if (rawAst.label) children.push(rawAst.label)
        break
      case Syntax.DebuggerStatement:
        children = []
        break
      case Syntax.DoWhileStatement:
        children = [rawAst.body, rawAst.test]
        break
      case Syntax.EmptyStatement:
        children = []
        break
      case Syntax.ExpressionStatement:
        children = [rawAst.expression]
        break
      case Syntax.ForStatement:
        children = [rawAst.body]
        if (rawAst.init) children.push(rawAst.init)
        if (rawAst.test) children.push(rawAst.test)
        if (rawAst.update) children.push(rawAst.update)
        break
      case Syntax.ForInStatement:
        children = [rawAst.left, rawAst.right, rawAst.body]
        break
      case Syntax.ForOfStatement:
        children = [rawAst.left, rawAst.right, rawAst.body]
        break
      case Syntax.FunctionDeclaration:
        children = [rawAst.id].concat(rawAst.params)
        children = children.concat([rawAst.body])
        break
      case Syntax.IfStatement:
        children = [rawAst.test, rawAst.consequent]
        if (rawAst.alternate) children.push(rawAst.alternate)
        break
      case Syntax.LabeledStatement:
        children = [rawAst.label, rawAst.body]
        break
      case Syntax.ReturnStatement:
        children = []
        if (rawAst.argument) children.push(rawAst.argument)
        break
      case Syntax.SwitchStatement:
        children = [rawAst.discriminant].concat(rawAst.cases)
        break
      case Syntax.SwitchCase:
        children = rawAst.consequent ? rawAst.consequent : []
        if (!rawAst.test) children.push(rawAst.test)
        break
      case Syntax.ThrowStatement:
        children = [rawAst.argument]
        break
      case Syntax.TryStatement:
        children = [rawAst.block]
        if (rawAst.handler) children.push(rawAst.handler)
        if (rawAst.finalizer) children.push(rawAst.finalizer)
        break
      case Syntax.CatchClause:
        children = [rawAst.param, rawAst.body]
        break
      case Syntax.VariableDeclaration:
        children = rawAst.declarations
        break
      case Syntax.VariableDeclarator:
        children = []
        if (rawAst.init) children.push(rawAst.init)
        break
      case Syntax.WhileStatement:
        children = [rawAst.test, rawAst.body]
        break
      case Syntax.WithStatement:
        children = [rawAst.object, rawAst.body]
        break
      case Syntax.Program:
        children = rawAst.body
        break
      case Syntax.ImportDeclaration:
        children = [].concat(rawAst.specifiers)
        children = children.concat(rawAst.source)
        break
      case Syntax.ImportSpecifier:
        children = [rawAst.local]
        if (rawAst.imported) children.push(rawAst.imported)
        break
      case Syntax.ImportNamespaceSpecifier:
        children = [rawAst.local]
        if (rawAst.imported) children.push(rawAst.imported)
        break
      case Syntax.ImportDefaultSpecifier:
        children = [rawAst.local]
        if (rawAst.imported) children.push(rawAst.imported)
        break
      case Syntax.ExportAllDeclaration:
        children = [rawAst.source]
        break
      case Syntax.ExportDefaultDeclaration:
        children = [rawAst.declaration]
        break
      case Syntax.ExportNamedDeclaration:
        children = [rawAst.declaration, rawAst.source].concat(rawAst.specifiers)
        break
      case Syntax.ExportSpecifier:
        children = [rawAst.exported, rawAst.local]
        break
      default:
        throw new Error(`unsupported type=${rawAst.type}`)
    }
    if (!children) children = []
    children = children.filter(e => e !== undefined && e !== null)
    return children
  }

  private static getType (rawAst: any): string {
    return rawAst.type
  }

  private static getId (): string {
    return Math.random().toString().slice(2, 12)
  }

  private static getValue (rawAst: any): string {
    if (!this.isTerminal(rawAst)) {
      return this.getType(rawAst)
    }
    // For nodes that could be terminal, let's return specific tokens when applicable
    // otherwise just return the type
    let value = ''
    switch (rawAst.type) {
      case Syntax.Identifier:
        value = rawAst.name
        break
      case Syntax.Literal:
        value = rawAst.raw
        break
      default:
        if (rawAst.type) {
          value = rawAst.type
        } else {
          throw new Error(`unsupported type=${rawAst.type}`)
        }
    }

    return value
  }

  private static isTerminal (rawAst: any): boolean {
    const children = this.getChildren(rawAst)
    return children.length === 0
  }
}

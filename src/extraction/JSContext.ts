import { ContextPathDirection, IContextPath, IContextGraph, IContextGraphEdge, IContextNode } from './types'

export class JSFnContextEdge implements IContextGraphEdge {
  sourceNodeId: string
  targetNodeId: string
  direction: ContextPathDirection

  constructor (sourceId: string,
    targetId: string,
    direction: ContextPathDirection) {
    this.sourceNodeId = sourceId
    this.targetNodeId = targetId
    this.direction = direction
  }
}

export class JSFnContextNode implements IContextNode {
  id: string
  type: string
  value: string
  isTerminal: boolean
  neighbors: Map<string, JSFnContextEdge>

  constructor (id: string, type: string, value: string, isTerminal: boolean) {
    this.id = id
    this.type = type
    this.value = value
    this.isTerminal = isTerminal
    this.neighbors = new Map<string, IContextGraphEdge>()
  }
}

export class JSContextPath implements IContextPath {
  source: JSFnContextNode
  target: JSFnContextNode
  path: JSFnContextEdge[]
  constructor (source: JSFnContextNode, target: JSFnContextNode, path: JSFnContextEdge[]) {
    this.source = source
    this.target = target
    this.path = path
  }
}

export class JSFnContextGraph implements IContextGraph {
  rawAST: any
  root: JSFnContextNode

  constructor (rawAST: any) {
    this.rawAST = rawAST
    this.root = this.build(this.rawAST)
  }

  private isValidFn (rawAST: any): boolean {
    const { type } = rawAST
    if (type && (type === 'FunctionDeclaration' || type === 'MethodDeclaration')) return true
    return false
  }

  private build (rawAST: any): JSFnContextNode {
    if (!this.isValidFn(rawAST)) {
      throw new Error('Trying to build context graph with invalid rawAST')
    }

    // create a graph node from raw node -> factory?
    // different esprima nodes will have different structures
    // our factory needs to be able to properly populate all the fields
    // determine if it's terminal etc.
    // Or maybe just build a recursive method in this graph
    const { type, id } = rawAST
    const { name } = id
    const rootNode = new JSFnContextNode(name, type, 'METHOD_NAME', false)

    // recursively build the rest of the graph and attach to root before returning

    return rootNode
  }

  getAllContextPaths (maxLength: number): JSContextPath[] {
    return []
  }
}

import { ContextPathDirection, IContextPath, IContextGraph, IContextGraphEdge, IContextNode, IContextLocation } from './types'
import Esprima2NodeFactory from './Esprima2NodeFactory'

export class JSFnContextEdge implements IContextGraphEdge {
  sourceNodeId: string
  sourceNode: JSFnContextNode
  targetNodeId: string
  targetNode: JSFnContextNode
  direction: ContextPathDirection

  constructor (sourceNode: JSFnContextNode,
    targetNode: JSFnContextNode,
    direction: ContextPathDirection) {
    this.sourceNodeId = sourceNode.id
    this.sourceNode = sourceNode
    this.targetNodeId = targetNode.id
    this.targetNode = targetNode
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

  addNeighbor (nodeId: string, neighbor: IContextGraphEdge): void {
    this.neighbors.set(nodeId, neighbor)
  }

  hasNeighbor (nodeId: string): boolean {
    return this.neighbors.has(nodeId)
  }

  getNeighbor (nodeId: string): IContextGraphEdge|undefined {
    return this.neighbors.get(nodeId)
  }
}

export class JSContextPath implements IContextPath {
  source: JSFnContextNode
  target: JSFnContextNode
  path: JSFnContextEdge[]
  printable: string
  constructor (source: JSFnContextNode, target: JSFnContextNode, path: JSFnContextEdge[]) {
    this.source = source
    this.target = target
    this.path = path
    this.printable = this.pathToString()
  }

  private pathToString (): string {
    let result = ''
    for (let i = 0; i < this.path.length; i++) {
      const edge = this.path[i]
      const { direction, targetNode } = edge
      if (i === this.path.length - 1) {
        result += `,${targetNode.value}`
      } else {
        result += `${direction}${targetNode.value}`
      }
    }
    result = result.substring(1, result.length)
    result = `${this.source.value},${result}`

    const tokens = result.split(',')
    if (tokens.length !== 3) {
      console.log(tokens)
      throw new Error('wrong number of tokens in context path')
    }

    return result
  }

  public toString (): string {
    return this.printable
  }
}

export class JSFnContextGraph implements IContextGraph {
  rawAST: any
  root: JSFnContextNode
  location: IContextLocation
  leaves: Map<string, JSFnContextNode>

  constructor (filePath:string, rawAST: any) {
    this.rawAST = rawAST
    this.location = {
      filePath: filePath,
      location: rawAST.loc
    }
    this.leaves = new Map<string, JSFnContextNode>()
    this.root = this.recursiveBuild(this.rawAST)
  }

  recursiveBuild (rawAst: any): JSFnContextNode {
    const currNode = Esprima2NodeFactory.convertToNode(rawAst)
    const children = Esprima2NodeFactory.getChildren(rawAst)
    for (const c of children) {
      const childNode = this.recursiveBuild(c)
      const edgeDown = new JSFnContextEdge(currNode, childNode, ContextPathDirection.DOWN)
      const edgeUp = new JSFnContextEdge(childNode, currNode, ContextPathDirection.UP)
      currNode.addNeighbor(childNode.id, edgeDown)
      childNode.addNeighbor(currNode.id, edgeUp)
    }
    if (currNode.isTerminal) this.leaves.set(currNode.id, currNode)
    return currNode
  }

  convertArrayToContextPath (edges: JSFnContextEdge[]): JSContextPath {
    if (edges.length === 0) throw new Error('cannot have empty edges array')
    const { sourceNode } = edges[0]
    const { targetNode } = edges[edges.length - 1]
    return new JSContextPath(sourceNode, targetNode, edges)
  }

  findShortestPath (
    source: JSFnContextNode,
    target: JSFnContextNode,
    maxDistance: number): JSFnContextEdge[] | null {
    const queue: JSFnContextNode[] = [source]
    const visited = new Map<string, boolean>()
    const pathTo = new Map<string, JSFnContextEdge>()
    const dist = new Map<string, number>()

    visited.set(source.id, true)
    dist.set(source.id, 0)

    for (let i = 0; i < queue.length; i++) {
      const currNode = queue[i]

      // If we found the node, return the path
      // as an array of edges
      if (currNode.id === target.id) {
        let currEdge = pathTo.get(target.id)
        const paths = []
        while (currEdge !== undefined) {
          paths.unshift(currEdge)
          const { sourceNodeId } = currEdge
          currEdge = pathTo.get(sourceNodeId)
        }
        return paths
      }

      // if we haven't found the target, check the current distance
      // if we are at max, then we should just exit with null
      let currDist = dist.get(currNode.id)
      if (!currDist) currDist = 0

      if (currDist === maxDistance) {
        return null
      }
      for (const edge of currNode.neighbors.values()) {
        const { targetNode, targetNodeId } = edge
        if (!visited.has(targetNodeId)) {
          queue.push(targetNode)
          visited.set(targetNodeId, true)
          pathTo.set(targetNodeId, edge)
          dist.set(targetNodeId, currDist + 1)
        }
      }
    }

    return null
  }

  nodeContainsIllegalCharacters (node: IContextNode) {
    return node.value.includes(',') || node.value.includes("'") || node.value.includes('"') || node.value.includes(';') || node.value.includes('*')
  }

  generateSourceTargetPairs () {
    const pairs = []
    for (const source of this.leaves.values()) {
      if (source.value.includes(',') || source.value.includes("'") || source.value.includes('"')) continue
      for (const target of this.leaves.values()) {
        if (target.value.includes(',') || target.value.includes("'") || target.value.includes('"')) continue
        if (source !== target) {
          pairs.push({
            source,
            target
          })
        }
      }
    }
    return pairs
  }

  getAllContextPaths (maxLength:number): JSContextPath[] {
    const result: JSContextPath[] = []
    const allPairs = this.generateSourceTargetPairs()
    // for each pair of source, target nodes
    // find the shortest context path within maxLength
    // if no path exists, just
    // if path is found, add the the results
    for (const pair of allPairs) {
      const { source, target } = pair
      const pathSegments = this.findShortestPath(source, target, maxLength)
      if (pathSegments !== null) {
        const path = this.convertArrayToContextPath(pathSegments)
        result.push(path)
      }
    }

    return result
  }
}

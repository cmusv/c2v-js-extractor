import Edge from './Edge.js'

class BiDiNode {
  constructor (id, node, parent = null) {
    this.id = id
    this.node = node
    this.parent = parent
    this.neighbors = {}
  }

  addNeighbor (node, direction) {
    const newEdge = new Edge(node, direction)
    this.neighbors[node.id] = newEdge
  }

  isRoot () {
    return this.parent === null
  }

  hasNeighbor (neighborId) {
    return neighborId in this.neighbors
  }

  removeNeighbor (neighborId) {
    delete this.neighbors[neighborId]
  }
}

export default BiDiNode

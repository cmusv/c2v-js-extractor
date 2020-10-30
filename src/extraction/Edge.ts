class Edge {
  constructor (node, direction) {
    this.UP = 'UP'
    this.DOWN = 'DOWN'
    if (direction !== this.UP || direction !== this.DOWN) throw new Error(`unsupported direction ${direction}`)
    if (!node) throw new Error('node cannot be empty')

    this.direction = direction
    this.node = node
  }
}

export default Edge

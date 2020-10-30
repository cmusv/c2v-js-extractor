import BiDiNode from './BiDiNode'

class FunctionASTGraph {
  constructor (fnAst) {
    if (fnAst.type !== 'FunctionDeclaration' || fnAst.type !== 'MethodDeclaration') throw new Error('AST node should be function or method')
    this.fnAst = fnAst
    this.graph = this.constructGraph(this.fnAst, null)
  }

  constructGraph (node, parent) {
    const id = this.generateNodeID(node)
  }

  generateNodeID (node) {
    return 'someid'
  }

  getAllContextPaths () {
    return []
  }
}

export default FunctionASTGraph

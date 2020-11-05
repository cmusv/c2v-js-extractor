import { EROFS } from 'constants'
import JS2ASTParser from './JS2ASTParser'
import { ISource2ASTParser } from './types'

export default class FileExtractionOrchestrator {
  inputFile: string
  maxPathLength: number
  sourceParser: ISource2ASTParser

  constructor (inputFile: string, maxPathLength?: number) {
    this.inputFile = inputFile
    this.sourceParser = new JS2ASTParser()

    // TODO: fix this
    if (maxPathLength) {
      this.maxPathLength = maxPathLength
    } else {
      this.maxPathLength = 8
    }
  }

  async extract () {
    // parse the given file to extract function ast
    // verify that there is only 1 function
    // convert to context graph
    // extract all context paths
    // print context paths to std
    const graphs = this.sourceParser.parse(this.inputFile)
    if (graphs.length !== 1) throw new Error(`error: inputFile=${this.inputFile} should only have 1 function declaration`)
    const graph = graphs[0]
    const contextPaths = graph.getAllContextPaths(this.maxPathLength)
    const pathStrs = contextPaths.map(e => e.printable)
    const output = pathStrs.join(' ')
    console.log(output)
  }
}

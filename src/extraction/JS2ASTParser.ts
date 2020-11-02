import { ISource2ASTParser } from './types'

import fs from 'fs'
import * as esprima from 'esprima'
import { JSFnContextGraph } from './JSContext'

export default class JS2ASTParser implements ISource2ASTParser {
  parse (filePath: string): JSFnContextGraph[] {
    const contents = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const properties = {
      loc: true
    }
    const fnAsts:any[] = []
    const extractor = (node: any) => {
      switch (node.type) {
        case 'MethodDefinition':
        case 'FunctionDeclaration':
          fnAsts.push(node)
          break
        default:
      }
    }
    if (this.isModule(contents)) {
      esprima.parseModule(contents, properties, extractor)
    } else {
      esprima.parseScript(contents, properties, extractor)
    }
    const results: JSFnContextGraph[] = []
    for (const ast of fnAsts) {
      const graph = new JSFnContextGraph(filePath, ast)
      results.push(graph)
    }
    return results
  }

  isModule (rawCode: string) {
    return rawCode.includes('export ') ||
    rawCode.includes('import ') ||
    rawCode.includes('from ')
  }
}

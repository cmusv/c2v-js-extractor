/**
 * JSFileASTParser is responsible for loading a JS file and returning an AST.
 * The class also includes helper methods to query the underlying AST like returning a collection of functions
*/

import fs from 'fs'
import * as esprima from 'esprima'

class JSFileASTParser {
  constructor (filePath, parser = esprima) {
    this.filePath = filePath
    this.parser = parser
    this.loaded = false
    this.functions = {}
  }

  parse () {
    const contents = fs.readFileSync(this.filePath, 'UTF-8')
    this.raw = contents
    const properties = {
      loc: true
    }

    this.extractFunctions = this.extractFunctions.bind(this)

    if (this.isModule(this.raw)) {
      this.ast = this.parser.parseModule(this.raw, properties, this.extractFunctions)
    } else {
      this.ast = this.parser.parseScript(this.raw, properties, this.extractFunctions)
    }
    this.loaded = true
    return this.ast
  }

  isModule (rawCode) {
    return rawCode.includes('export ') ||
    rawCode.includes('import ') ||
    rawCode.includes('from ')
  }

  getFns () {
    if (!this.loaded) this.parse()
    return this.functions
  }

  locationId (loc) {
    const { start, end } = loc
    return `${this.filePath}:L${start.line}C${start.column}:L${end.line}C${end.column}`
  }

  extractFunctions (node) {
    let fnName, key
    switch (node.type) {
      case 'FunctionDeclaration':
        fnName = node.id.name
        key = `${this.locationId(node.loc)}:${fnName}`
        this.functions[key] = node
        break
      case 'MethodDefinition':
        fnName = node.key.name
        key = `${this.locationId(node.loc)}:${fnName}`
        this.functions[key] = node
        break
    }
  }
}

export default JSFileASTParser

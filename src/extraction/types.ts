
export interface ICodePosition {
  line: number
  column: number
}

export interface ICodeLocation {
  start: ICodePosition
  end: ICodePosition
}

export interface IContextLocation {
  filePath: string
  location: ICodeLocation
}

export enum ContextPathDirection {
  UP = '^',
  DOWN = '|'
}

export interface IContextGraphEdge {
  sourceNodeId: string
  sourceNode: IContextNode
  targetNodeId: string
  targetNode: IContextNode
  direction: ContextPathDirection
}

export interface IContextNode {
  id: string
  type: string
  value: string
  isTerminal: boolean
  neighbors: Map<string, IContextGraphEdge>
  addNeighbor(nodeId: string, neighbor: IContextGraphEdge): void
  hasNeighbor(nodeId: string): boolean
  getNeighbor(nodeId: string): IContextGraphEdge|undefined
}

export interface IContextPath {
  source: IContextNode
  target: IContextNode
  path: IContextGraphEdge[]
  printable: string
}

export interface IContextGraph {
  rawAST: any
  location: IContextLocation
  root: IContextNode
  getAllContextPaths(maxLength: number): IContextPath[]
}

export interface ISource2ASTParser {
  parse(filePath: string): IContextGraph[]
}

export interface IDataSetEntry {
  label: string
  features: string[]
}

export interface IDataSetCollection {
  train: IDataSetEntry[],
  test: IDataSetEntry[],
  validation: IDataSetEntry[]
}

export interface IDataSetWriter {
  fieldDelimiter: string
  writeTo(datasetFilePath: string, dictFilePath: string): void
}

export interface ISourceFileFinder {
  recursiveFind(targetDirPath: string, targetExtension: string): Promise<string[]>
}

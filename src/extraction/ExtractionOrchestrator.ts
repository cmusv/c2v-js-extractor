/**
 * ExtractionOrchestrator is responsible for coordinating lower-level classes together
 * to find, parse, and extract the AST context paths. Then the results will be written
 * out into a corresponding data set format.
 */

import { IContextGraph, IDataSetEntry, IDataSetWriter, ISource2ASTParser, ISourceFileFinder, IDataSetCollection } from './types'

export interface IOrchestratorOptions {
  sourceCodeDir: string
  datasetOutputDir: string
  trainSplitRatio: number
  sourceParser: ISource2ASTParser
  datasetWriter: IDataSetWriter
  sourceFileFinder: ISourceFileFinder
  targetExtension: string
}

class ExtractionOrchestrator {
  sourceCodeDir: string
  datasetOutputDir: string
  trainSplitRatio: number
  sourceParser: ISource2ASTParser
  datasetWriter: IDataSetWriter
  sourceFileFinder: ISourceFileFinder
  targetExtension: string

  constructor ({
    sourceCodeDir = 'raw_data',
    datasetOutputDir = 'data',
    trainSplitRatio = 0.8,
    targetExtension = '.js',
    sourceParser,
    datasetWriter,
    sourceFileFinder
  }: IOrchestratorOptions) {
    this.sourceCodeDir = sourceCodeDir
    this.datasetOutputDir = datasetOutputDir
    this.trainSplitRatio = trainSplitRatio
    this.targetExtension = targetExtension
    this.sourceParser = sourceParser
    this.datasetWriter = datasetWriter
    this.sourceFileFinder = sourceFileFinder
  }

  trainTestValSplitSamples (dataArray: IDataSetEntry[]): IDataSetCollection {
    if (dataArray.length < 3) throw new Error('data set size cannot be smaller than 3')
    if (this.trainSplitRatio <= 0 || this.trainSplitRatio > 0.8) throw new Error('train, test, val ratio should be greater than 0 and less than 0.9')

    const valNum = Math.max(1, Math.round(dataArray.length * (1.0 - this.trainSplitRatio)))
    const left = dataArray.length - valNum
    const trainNum = Math.round(left * this.trainSplitRatio)
    const testNum = left - trainNum

    return {
      train: dataArray.slice(0, trainNum),
      test: dataArray.slice(trainNum, trainNum + testNum),
      validation: dataArray.slice(trainNum + testNum, dataArray.length)
    }
  }

  async listSourceProjectDirs (): Promise<string[]> {
    return []
  }

  async findAllSourceFiles (): Promise<string[]> {
    const subdirs = await this.listSourceProjectDirs()
    let allFilePaths: string[] = []
    for (const dir of subdirs) {
      const files = await this.sourceFileFinder.recursiveFind(dir, this.targetExtension)
      allFilePaths = allFilePaths.concat(files)
    }
    return allFilePaths
  }

  processAllSamplesToDataEntries (samples: IContextGraph[]): IDataSetEntry[] {
    return []
  }

  processSampleToDataEntry (sample: IContextGraph): IDataSetEntry {
    return {
      label: 'noop',
      features: ['']
    }
  }

  async extractAllSamples (): Promise<IContextGraph[]> {
    return []
  }

  async writeCollectionToFiles (collection: IDataSetCollection): Promise<void> {

  }

  async extract () {
    // get all the samples into context graphs
    const contextGraphs = await this.extractAllSamples()
    // process all context graphs into data set rows
    const dataRows = this.processAllSamplesToDataEntries(contextGraphs)

    // train test split
    const collection = this.trainTestValSplitSamples(dataRows)
    // output each data set to corresponding files
    try {
      await this.writeCollectionToFiles(collection)
    } catch (e) {
      console.error(e)
    }
  }
}

export default ExtractionOrchestrator

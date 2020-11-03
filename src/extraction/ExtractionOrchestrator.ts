/**
 * ExtractionOrchestrator is responsible for coordinating lower-level classes together
 * to find, parse, and extract the AST context paths. Then the results will be written
 * out into a corresponding data set format.
 */

import { IContextGraph, IDataSetEntry, IDataSetWriter, ISource2ASTParser, ISourceFileFinder, IDataSetCollection } from './types'
import LabelDatabase from './LabelDatabase'
import path from 'path'
import JS2ASTParser from './JS2ASTParser'
import C2VWriter from './C2VWriter'
import ExtensionFileFinder from './ExtensionFileFinder'

export interface IOrchestratorOptions {
  sourceCodeDir?: string
  datasetOutputDir?: string
  trainSplitRatio?: number
  sourceParser?: ISource2ASTParser
  datasetWriter?: IDataSetWriter
  sourceFileFinder?: ISourceFileFinder
  targetExtension?: string
  defaultLabel?: string
}

class ExtractionOrchestrator {
  sourceCodeDir: string
  datasetOutputDir: string
  trainSplitRatio: number
  sourceParser: ISource2ASTParser
  datasetWriter: IDataSetWriter
  sourceFileFinder: ISourceFileFinder
  targetExtension: string
  labelDb: LabelDatabase

  constructor (options: IOrchestratorOptions) {
    const defaults = {
      sourceCodeDir: 'raw_data',
      datasetOutputDir: 'data',
      trainSplitRatio: 0.8,
      targetExtension: '.js',
      defaultLabel: 'safe',
      sourceParser: new JS2ASTParser(),
      datasetWriter: new C2VWriter(' '),
      sourceFileFinder: new ExtensionFileFinder()
    }
    const finalOpts = { ...defaults, ...options }
    const {
      sourceCodeDir,
      datasetOutputDir,
      trainSplitRatio,
      targetExtension,
      sourceParser,
      datasetWriter,
      sourceFileFinder,
      defaultLabel
    } = finalOpts

    this.sourceCodeDir = sourceCodeDir
    this.datasetOutputDir = datasetOutputDir
    this.trainSplitRatio = trainSplitRatio
    this.targetExtension = targetExtension
    this.sourceParser = sourceParser
    this.datasetWriter = datasetWriter
    this.sourceFileFinder = sourceFileFinder
    this.labelDb = new LabelDatabase(sourceCodeDir, path.join(sourceCodeDir, 'labels.csv'), defaultLabel)
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
    const files = await this.sourceFileFinder.recursiveFind(this.sourceCodeDir, this.targetExtension)
    return files
  }

  processAllSamplesToDataEntries (samples: IContextGraph[]): IDataSetEntry[] {
    const entries: IDataSetEntry[] = []
    for (const sample of samples) {
      const contextPaths = sample.getAllContextPaths(100)
      const label = this.labelDb.getLabel(sample.location)
      const features = contextPaths.map(e => e.printable)
      const entry = {
        label,
        features
      }
      entries.push(entry)
    }

    return entries
  }

  async extractAllSamples (): Promise<IContextGraph[]> {
    // recursively find all target files in the sourceCodeDir
    // extract fnAsts from each file and combine to one large list
    // return the list
    let samples: IContextGraph[] = []
    const allFilePaths = await this.findAllSourceFiles()
    for (const sampleFile of allFilePaths) {
      try {
        console.log(`processing: ${sampleFile}`)
        const asts = this.sourceParser.parse(sampleFile)
        samples = samples.concat(asts)
      } catch (e) {
        console.error(e)
      }
    }
    return samples
  }

  async writeCollectionToFiles (collection: IDataSetCollection): Promise<void> {
    console.log(collection)
  }

  async extract () {
    // load the labels database
    await this.labelDb.loadLabels()
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

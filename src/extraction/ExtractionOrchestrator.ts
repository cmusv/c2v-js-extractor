/**
 * ExtractionOrchestrator is responsible for coordinating lower-level classes together
 * to find, parse, and extract the AST context paths and output them to a file
 */

import FolderRecursiveSearcher from '../io/FolderRecursiveSearcher.js'
import JSFileASTParser from '../io/JSFileASTParser.js'

class ExtractionOrchestrator {
  constructor (outputDir,
    dataDir,
    trainSplit = 0.8,
    fileSearcher = new FolderRecursiveSearcher(),
    astParser = JSFileASTParser,
    extension = '.js') {
    this.outputDir = outputDir
    this.dataDir = dataDir
    this.fileSearcher = fileSearcher
    this.astParser = astParser
    this.extension = extension
    this.trainSplit = trainSplit
  }

  async extractAsts () {
    // get all js file paths in the target dir
    const jsFiles = await this.getAllJSFiles()
    let allAsts = {}
    for (const file of jsFiles) {
      try {
        const parser = new JSFileASTParser(file)
        const fns = parser.getFns()
        allAsts = { ...allAsts, ...fns }
      } catch (e) {
        console.log(`parsing error for file=${file}`)
      }
    }
    return allAsts
  }

  async getAllJSFiles () {
    const subdirs = await this.fileSearcher.listSubdirs(this.dataDir)
    let allFiles = []
    for (const dir of subdirs) {
      const files = await this.fileSearcher.recurseDirSearch(dir, this.extension)
      allFiles = allFiles.concat(files)
    }
    return allFiles
  }

  splitData (dataArray, trainRatio) {
    if (dataArray.length < 3) throw new Error('data set size cannot be smaller than 3')
    if (trainRatio <= 0 || trainRatio > 0.8) throw new Error('train, test, val ratio should be greater than 0 and less than 0.9')

    const valNum = Math.max(1, Math.round(dataArray.length * (1.0 - trainRatio)))
    const left = dataArray.length - valNum
    const trainNum = Math.round(left * trainRatio)
    const testNum = left - trainNum

    return {
      trainData: dataArray.slice(0, trainNum),
      testData: dataArray.slice(trainNum, trainNum + testNum),
      valData: dataArray.slice(trainNum + testNum, dataArray.length)
    }
  }
}

export default ExtractionOrchestrator

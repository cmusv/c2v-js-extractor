import ExtractionOrchestrator, { IOrchestratorOptions } from './ExtractionOrchestrator'
import { IDataSetEntry, IDataSetWriter, IContextGraph } from './types'

export default class StreamingExtractionOrchestrator extends ExtractionOrchestrator {
  appendSamples (samples: IDataSetEntry[]) {
    this.createOutputDir()

    const { train, test, validation } = this.trainTestValSplitSamples(samples)

    this.datasetWriter.appendTo(train, `${this.datasetOutputDir}/train.raw.txt`)
    this.datasetWriter.appendTo(test, `${this.datasetOutputDir}/test.raw.txt`)
    this.datasetWriter.appendTo(validation, `${this.datasetOutputDir}/validation.raw.txt`)
  }

  splitProcessAllSamplesToDataEntries (samples: IContextGraph[]): [IDataSetEntry[], IDataSetEntry[]] {
    const results = this.processAllSamplesToDataEntries(samples)

    const defaultLabel = []
    const otherLabel = []
    for (const s of results) {
      if (s.label === this.defaultLabel) {
        defaultLabel.push(s)
      } else {
        otherLabel.push(s)
      }
    }

    return [defaultLabel, otherLabel]
  }

  multiplyDataset (ratio: number, dataset: IDataSetEntry[]) {
    let newDataset = [...dataset]
    for (let i = 0; i < ratio - 1; i += 1) {
      newDataset = newDataset.concat(dataset)
    }
    return newDataset
  }

  balanceDataset (biggerDataset: IDataSetEntry[], smallerDataset: IDataSetEntry[]) {
    const ratio = Math.max(Math.floor(biggerDataset.length / smallerDataset.length) * 2 / 3, 1)
    const newDataset = this.multiplyDataset(ratio, smallerDataset)
    return newDataset
  }

  async extract () {
    const bufferSize = 30
    console.log('extracting with stream method, buffer size=', bufferSize)

    await this.labelDb.loadLabels()

    let totalNum = 0

    let buffer: IDataSetEntry[] = []

    for (const entry of this.labelDb.labelMappings.entries()) {
      const [key, labelVal] = entry
      const [filePath, startLocStr, endLocStr] = key.split(':')

      const asts = this.extractSamples(filePath)
      const [defaultLabelEntries, otherLabelEntries] = this.splitProcessAllSamplesToDataEntries(asts)
      console.log(`processed default=${defaultLabelEntries.length}, other=${otherLabelEntries.length} entries `)

      buffer = buffer.concat(defaultLabelEntries)
      buffer = buffer.concat(otherLabelEntries)

      // TODO: remove artificial multiply function
      // this code was used to artificially balance data samples for later processing, but was very primitive
      // should be replaced with something better
      // if (otherLabelEntries.length > 0 && defaultLabelEntries.length > otherLabelEntries.length) {
      //   const balancedDataset = this.balanceDataset(defaultLabelEntries, otherLabelEntries)
      //   console.log(`=> normalized dataset size: ${otherLabelEntries.length} -> ${balancedDataset.length}`)
      //   buffer = buffer.concat(balancedDataset)
      // } else {
      //   const ratio = 10
      //   console.log(`=> adding multplied dataset: ${ratio}`)
      //   const multipliedDataset = this.multiplyDataset(ratio, otherLabelEntries)
      //   buffer = buffer.concat(multipliedDataset)
      // }

      if (buffer.length >= bufferSize) {
        this.appendSamples(buffer)

        totalNum += buffer.length
        buffer = []
      }

      console.log(`current total: ${totalNum}`)
    }

    if (buffer.length > 0) {
      this.appendSamples(buffer)

      totalNum += buffer.length
      buffer = []
    }

    console.log(`Total data points so far : ${totalNum}`)

    // initialize the total data entries
    // load the labels database
    // for each label entry,
    // load the corresponding file with a relevant label
    // parse it into fn asts
    // process all the return fn asts in that file
    // write out the intermediate results to a file
    // determine which file depending on ratio of train/test/val
    // sample from distribution based on ratio for each entry
    // check that the returned context paths length is greater than 0
    // add the number of data points we wrote to the total

    // check the size of the dataset to see if we hit our limit
    // if we hit it exit
    // else, just recursively iterate through the current input folder's js files
    // for each file
    // parse to fn asts
    // process context paths
    // write out to target intermediate file
    //
  }
}

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

    const allFilePaths = await this.findAllSourceFiles()
    for (const filePath of allFilePaths) {
      const asts = this.extractSamples(filePath)
      const [defaultLabelEntries, otherLabelEntries] = this.splitProcessAllSamplesToDataEntries(asts)
      console.log(`processed default=${defaultLabelEntries.length}, other=${otherLabelEntries.length} entries `)

      buffer = buffer.concat(defaultLabelEntries)
      buffer = buffer.concat(otherLabelEntries)

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
  }
}

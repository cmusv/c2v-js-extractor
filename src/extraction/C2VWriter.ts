import { IDataSetEntry, IDataSetWriter } from './types'
import fs from 'fs'
import md5 from 'md5'

export default class C2VWriter implements IDataSetWriter {
  fieldDelimiter: string;
  constructor (delim:string) {
    this.fieldDelimiter = delim
  }

  private entryToString (entry: IDataSetEntry): string {
    let result = ''
    result += entry.label
    for (const feature of entry.features) {
      const tokens = feature.split(',')
      const hashedPath = md5(tokens[1])
      // remove any whitespace within tokens
      const token1 = tokens[0].replace(/\s+/g, '')
      const token2 = tokens[2].replace(/\s+/g, '')
      const newFeature = [token1, hashedPath, token2].join(',')
      result += ` ${newFeature}`
    }

    result += '\n'
    return result
  }

  writeTo (dataset: IDataSetEntry[], datasetFilePath: string): void {
    let result = ''
    for (const entry of dataset) {
      result += this.entryToString(entry)
    }
    fs.writeFileSync(datasetFilePath, result)
  }
}

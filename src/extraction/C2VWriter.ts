import { IDataSetWriter } from './types'

export default class C2VWriter implements IDataSetWriter {
  fieldDelimiter: string;
  constructor (delim:string) {
    this.fieldDelimiter = delim
  }

  writeTo (datasetFilePath: string, dictFilePath: string): void {
    throw new Error('Method not implemented.')
  }
}

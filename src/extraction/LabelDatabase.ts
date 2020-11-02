import { IContextLocation } from './types'
import ExtensionFileFinder from './ExtensionFileFinder'
import path from 'path'
import fs from 'fs'
import parse from 'csv-parse/lib/sync'

export default class LabelDatabase {
  labelMappings: Map<string, string>
  sourceCodeDir: string
  labelFilePath: string
  fileFinder: ExtensionFileFinder
  defaultLabel: string

  constructor (sourceCodeDir: string, labelFilePath: string, defaultLabel: string) {
    this.sourceCodeDir = sourceCodeDir
    this.labelFilePath = labelFilePath
    this.labelMappings = new Map<string, string>()
    this.fileFinder = new ExtensionFileFinder()
    this.defaultLabel = defaultLabel
  }

  getLabel (contextLocation: IContextLocation): string {
    const key = this.locationToKey(contextLocation)
    const label = this.labelMappings.get(key)
    if (!label) return this.defaultLabel
    return label
  }

  locationToKey (contextLocation: IContextLocation): string {
    const { filePath, location } = contextLocation
    const { start, end } = location
    const key = `${filePath}:L${start.line}C${start.column}:L${end.line}C${end.column}`
    return key
  }

  async loadLabels (): Promise<void> {
    const rawCsv = fs.readFileSync(this.labelFilePath)
    const records = parse(rawCsv, { columns: true, skipEmptyLines: true })
    for (const line of records) {
      const { project, fpath, sline, scol, eline, ecol, label } = line
      const fullPath = path.join(this.sourceCodeDir, project, fpath)
      const key = `${fullPath}:L${sline}C${scol}:L${eline}C${ecol}`
      this.labelMappings.set(key, label)
    }
  }
}

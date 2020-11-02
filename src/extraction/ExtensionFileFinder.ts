import { ISourceFileFinder } from './types'

import fs from 'fs'
import util from 'util'
import path from 'path'

const asyncReadDir = util.promisify(fs.readdir)

export default class ExtensionFileFinder implements ISourceFileFinder {
  async recursiveFind (targetDirPath: string, targetExtension: string): Promise<string[]> {
    const regex = new RegExp(`${targetExtension}$`, 'i')
    const dirents = await asyncReadDir(targetDirPath, { withFileTypes: true })
    let files: string[] = []
    for (const file of dirents) {
      const properPath = path.join(targetDirPath, file.name)

      if (file.isDirectory()) {
        const multipleFiles = await this.recursiveFind(properPath, targetExtension)
        files = files.concat(multipleFiles)
      } else if (file.isFile() && regex.test(file.name)) {
        files.push(properPath)
      }
    }
    return files
  }

  async listSubdirs (directory: string): Promise<string[]> {
    const dirents = await asyncReadDir(directory, { withFileTypes: true })
    const result: string[] = []
    for (const ent of dirents) {
      if (ent.isDirectory()) {
        result.push(path.join(directory, ent.name))
      }
    }
    return result
  }
}

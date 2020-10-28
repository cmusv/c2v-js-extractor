/**
 * FolderRecursiveSearcher is responsible for iterating over all
 * JS files in a given directory and applying JSFileASTParser
 */

import fs from 'fs'
import util from 'util'
import path from 'path'

class FolderRecursiveSearcher {
  constructor (workingDirectory, targetExtension) {
    this.workingDirectory = workingDirectory
    this.targetExtension = targetExtension
    this.readdir = util.promisify(fs.readdir)
    this.openDir = util.promisify(fs.open)
  }

  async recursiveFind () {
    return this.recurseDirSearch(this.workingDirectory, this.targetExtension)
  }

  async recurseDirSearch (directory, extension) {
    const regex = new RegExp(`${extension}$`, 'i')
    const dirents = await this.readdir(directory, { withFileTypes: true })
    let files = []
    for (const file of dirents) {
      const properPath = path.join(directory, file.name)

      if (file.isDirectory()) {
        const multipleFiles = await this.recurseDirSearch(properPath, extension)
        files = files.concat(multipleFiles)
      } else if (file.isFile() && regex.test(file.name)) {
        files.push(properPath)
      }
    }
    return files
  }
}

export default FolderRecursiveSearcher

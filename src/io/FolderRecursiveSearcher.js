/**
 * FolderRecursiveSearcher is used to search for JS files and iterate over folders
 */

import fs from 'fs'
import util from 'util'
import path from 'path'

class FolderRecursiveSearcher {
  constructor () {
    this.readdir = util.promisify(fs.readdir)
    this.openDir = util.promisify(fs.open)
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

  async listSubdirs (directory) {
    const dirents = await this.readdir(directory, { withFileTypes: true })
    const result = []
    for (const ent of dirents) {
      if (ent.isDirectory()) {
        result.push(path.join(directory, ent.name))
      }
    }
    return result
  }
}

export default FolderRecursiveSearcher

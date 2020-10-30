import commander from 'commander'

export interface CLIConfig {
  inputDir?: string
  outputDir?: string
  format?: string
  maxPathLength?: number
}

export default class CLI {
  program: commander.Command
  environment: string[]
  loadedConfig: CLIConfig
  supportedFormats: string[]

  constructor (environment = process.argv, instance = new commander.Command()) {
    this.program = instance
    this.environment = environment
    this.loadedConfig = {}

    this.supportedFormats = [
      'c2v',
      'c2s'
    ]
  }

  parse (): CLIConfig {
    // for testability
    this.program.exitOverride((e: Error) => { throw e })

    this.program
      .requiredOption('-i, --input-dir <path>', 'directory with source code projects')
      .requiredOption('-o, --output-dir <path>', 'directory to output files to')
      .option('-f, --format <type>', 'format of output data', 'c2v')
      .option('-l, --max-path-length <length>', 'maximum context path length, should be > 0', (l: string) => parseInt(l), 8)

    this.program.parse(this.environment)
    const { inputDir, outputDir, format, maxPathLength } = this.program

    this.loadedConfig = {
      inputDir,
      outputDir,
      format,
      maxPathLength
    }
    this.validate()
    return this.loadedConfig
  }

  validate (): void {
    const { format, maxPathLength } = this.loadedConfig
    if (format && !this.supportedFormats.includes(format)) throw new Error(`error: unsupported format '--format=${format}'`)
    if (maxPathLength && maxPathLength <= 0) throw new Error('error: max length should be greater than 0')
    if (maxPathLength && isNaN(maxPathLength)) throw new Error('error: max length should be an integer number')
  }
}

import commander from 'commander'

export interface CLIConfig {
  inputFile?: string
  inputDir?: string
  outputDir?: string
  format?: string
  defaultLabel?: string
  maxPathLength?: number
}

export default class CLI {
  program: commander.Command
  environment: string[]
  loadedConfig: CLIConfig

  constructor (environment = process.argv, instance = new commander.Command()) {
    this.program = instance
    this.environment = environment
    this.loadedConfig = {}
  }

  parse (): CLIConfig {
    // for testability
    this.program.exitOverride((e: Error) => { throw e })

    this.program
      .option('-f, --input-file <path>', 'source file to run extraction and print results to stdout')
      .option('-i, --input-dir <path>', 'directory with source code projects')
      .option('-o, --output-dir <path>', 'directory to output files to')
      .option('-d, --default-label <label>', 'default label value when there does not exist label entry', 'none')
      .option('-l, --max-path-length <length>', 'maximum context path length, should be > 0', (l: string) => parseInt(l), 8)

    this.program.parse(this.environment)
    const { inputFile, inputDir, outputDir, maxPathLength, defaultLabel } = this.program

    this.loadedConfig = {
      inputFile,
      inputDir,
      outputDir,
      defaultLabel,
      maxPathLength
    }
    this.validate()
    return this.loadedConfig
  }

  validate (): void {
    const { inputFile, inputDir, outputDir, maxPathLength } = this.loadedConfig
    if ((inputFile && inputDir) || (inputFile && outputDir)) throw new Error('error: input-file and input-dir/output-dir cannot be set together')
    if (!inputFile && !inputDir && !outputDir) throw new Error('error: either input-file or input-dir/output-dir should be set')
    if ((inputDir && !outputDir) || (outputDir && !inputDir)) throw new Error('error: input-dir/output-dir should both be set')
    if (maxPathLength && maxPathLength <= 0) throw new Error('error: max length should be greater than 0')
    if (maxPathLength && isNaN(maxPathLength)) throw new Error('error: max length should be an integer number')
  }
}

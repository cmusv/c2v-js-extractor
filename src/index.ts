import CLI from './util/CLI'
import ExtractionOrchestrator, { IOrchestratorOptions } from './extraction/ExtractionOrchestrator'
import FileExtractionOrchestrator from './extraction/FileExtractionOrchestrator'

try {
  const cli = new CLI()
  const config = cli.parse()
  const { inputFile, inputDir, outputDir, maxPathLength, defaultLabel } = config
  let orchestrator
  if (inputFile) {
    orchestrator = new FileExtractionOrchestrator(inputFile, maxPathLength)
  } else {
    const opts: IOrchestratorOptions = {
      sourceCodeDir: inputDir,
      datasetOutputDir: outputDir,
      defaultLabel,
      maxPathLength
    }
    orchestrator = new ExtractionOrchestrator(opts)
  }
  orchestrator.extract()
} catch (e) {
  if (!e.code.includes('commander')) {
    console.error(e.message)
  }
  process.exit(1)
}

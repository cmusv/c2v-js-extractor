import CLI from './util/CLI'
import ExtractionOrchestrator, { IOrchestratorOptions } from './extraction/ExtractionOrchestrator'
import FileExtractionOrchestrator from './extraction/FileExtractionOrchestrator'
import StreamingExtractionOrchestrator from './extraction/StreamingExtractionOrchestrator'

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
    // TODO: CLI flag
    // orchestrator = new ExtractionOrchestrator(opts)
    orchestrator = new StreamingExtractionOrchestrator(opts)
  }
  orchestrator.extract()
} catch (e) {
  if (e.message) {
    console.error(e.message)
  } else {
    console.error(e)
  }
  process.exit(1)
}

import CLI from './util/CLI'
import ExtractionOrchestrator, { IOrchestratorOptions } from './extraction/ExtractionOrchestrator'

try {
  const cli = new CLI()
  const config = cli.parse()
  const { inputDir, outputDir, format } = config
  const opts: IOrchestratorOptions = {
    sourceCodeDir: inputDir,
    datasetOutputDir: outputDir
  }
  const orchestrator = new ExtractionOrchestrator(opts)
  orchestrator.extract()
} catch (e) {
  if (!e.code.includes('commander')) {
    console.error(e.message)
  }
  process.exit(1)
}

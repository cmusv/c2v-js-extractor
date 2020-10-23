import CLI from './src/CLI.js'

try {
  const cli = new CLI()
  const config = cli.parse()
  console.log(config)
} catch (e) {
  if (!e.message.includes('CommanderError')) {
    console.error(e.message)
  }
  process.exit(1)
}

import CLI, { CLIConfig } from './CLI'

function simulateArgv (args: string) {
  return `node main.js ${args}`.split(' ')
}

test('can parse all valid option combinations with defaults', () => {
  const fakeArgs = simulateArgv('-i raw_data/ -o output/ -l 12')
  const cli = new CLI(fakeArgs)
  const config:CLIConfig = cli.parse()

  expect(config.inputDir).toBe('raw_data/')
  expect(config.outputDir).toBe('output/')
  expect(config.maxPathLength).toBe(12)

  const fakeArgs2 = simulateArgv('-f somefile.js')
  const cli2 = new CLI(fakeArgs2)
  const config2 = cli2.parse()

  expect(config2.inputFile).toBe('somefile.js')
  expect(config2.maxPathLength).toBe(8)
})

test('throws when given --max-path-length less than 0', () => {
  expect(() => {
    const fakeArgs = simulateArgv('-i raw_data/ -o output/ -f unsupported -l -3')
    const cli = new CLI(fakeArgs)
    cli.parse()
  }).toThrow()
})

test('throws when given --max-path-length not a number', () => {
  expect(() => {
    const fakeArgs = simulateArgv('-i raw_data/ -o output/ -f unsupported -l asd')
    const cli = new CLI(fakeArgs)
    cli.parse()
  }).toThrow()
})

test('throws when given input-dir/output-dir and input-file together', () => {
  expect(() => {
    const fakeArgs = simulateArgv('-i raw_data/ -f test.js')
    const cli = new CLI(fakeArgs)
    cli.parse()
  }).toThrow()

  expect(() => {
    const fakeArgs = simulateArgv('-o output/ -f test.js ')
    const cli = new CLI(fakeArgs)
    cli.parse()
  }).toThrow()

  expect(() => {
    const fakeArgs = simulateArgv('-i raw_data/ -o output/ -f test.js')
    const cli = new CLI(fakeArgs)
    cli.parse()
  }).toThrow()
})

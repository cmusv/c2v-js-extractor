import CLI from './CLI'

function simulateArgv (args: string) {
  return `node main.js ${args}`.split(' ')
}

test('can parse all options with defaults', () => {
  const fakeArgs = simulateArgv('-i raw_data/ -o output/ -f c2v -l 12')
  const cli = new CLI(fakeArgs)
  const config = cli.parse()

  expect(config.inputDir).toBe('raw_data/')
  expect(config.outputDir).toBe('output/')
  expect(config.format).toBe('c2v')
  expect(config.maxPathLength).toBe(12)

  const fakeArgs2 = simulateArgv('-i raw_data/ -o output/')
  const cli2 = new CLI(fakeArgs2)
  const config2 = cli2.parse()

  expect(config2.inputDir).toBe('raw_data/')
  expect(config2.outputDir).toBe('output/')
  expect(config2.format).toBe('c2v')
  expect(config2.maxPathLength).toBe(8)
})

test('throws when given unsupported --format', () => {
  expect(() => {
    const fakeArgs = simulateArgv('-i raw_data/ -o output/ -f unsupported')
    const cli = new CLI(fakeArgs)
    cli.parse()
  }).toThrow()
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

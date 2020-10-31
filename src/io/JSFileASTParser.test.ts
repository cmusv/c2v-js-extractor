import JSFileASTParser from './JSFileASTParser'

const simpleFixture = 'fixtures/test-simple/'
const unparseableFixture = 'fixtures/test-unparseable/'

test('can load module fixture files', () => {
  const parser = new JSFileASTParser(simpleFixture + 'src/module.js')
  const ast = parser.parse()

  expect(ast.sourceType).toBe('module')
  expect(ast.body).toBeDefined()
  expect(ast.type).toBe('Program')
})

test('can load script fixture files', () => {
  const parser = new JSFileASTParser(simpleFixture + 'src/nonmodule.js')
  const ast = parser.parse()
  expect(ast.sourceType).toBe('script')
  expect(ast.body).toBeDefined()
  expect(ast.type).toBe('Program')
})

test('parsing a file that is unparseable throws', () => {
  expect(() => {
    const parser = new JSFileASTParser(unparseableFixture + 'main.js')
    parser.parse()
  }).toThrow()

  expect(() => {
    const parser = new JSFileASTParser(unparseableFixture + 'main.js')
    parser.getFns()
  }).toThrow()
})

test('getting functions definitions from AST works', () => {
  const parser = new JSFileASTParser(simpleFixture + 'main.js')
  const fns = parser.getFns()
  const types = Object.entries(fns).map((e: any) => e[1].type)
  expect(types.length).toBe(3)
  expect(types).toStrictEqual([
    'FunctionDeclaration',
    'FunctionDeclaration',
    'FunctionDeclaration'
  ])
})

import Parser from './src/parser.js'
import esprima from 'esprima'


const program = `

function foo() {
  console.log("hello world")
}


`

const result = esprima.parseScript(program)
console.log(result)
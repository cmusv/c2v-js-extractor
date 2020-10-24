import RandomClass from './src/another.js'

function helloThere () {
  console.log('Hello there')
  const a = 'test'
  const b = 3
  return a + b
}

const rand = new RandomClass()

rand.anotherOne()

rand.someMethod()

helloThere()


if (true) {
  function foo() {
    console.log('foo')
    function nestedFunction() {}
    return nestedFunction
  }
  const nestedFn = foo()
  console.log(nestedFn)
}
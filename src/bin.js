const { testFn, greetFn } = require('./main.js');

const name = process.argv.splice(2).join(' ');

console.log(testFn());
console.log(greetFn(name));

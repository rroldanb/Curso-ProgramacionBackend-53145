const {Command} = require('commander')
const program = new Command()

program
    .option ('-d', 'Variable para debug', false)
    .option ('-p <port>', 'puerto del server', 8080)
    .option ('--mode <mode>', 'modo de trabajo de mi server', 'production')
    .option ('-u <user>', 'usuario del aplicativo', 'no se ha declarado user')
    .option ('-l, --letters [letters...]', 'specify letter')
    program.parse()

console.log('Options:', program.opts())
console.log('Argumentos:', program.args)

//node process.js -d -p 3000 --mode development -u root --letters a b s
//node process.js  -p 3000 -u root  2 a 5 --letters a b s
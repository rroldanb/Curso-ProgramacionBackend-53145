const { Command } = require('commander');
const program = new Command();

program
    .option('--mode <mode>', 'modo de trabajo de la aplicacion', 'production')
    .parse(process.argv);

exports.program = program;

var program = require('commander');
var version = require('./version');

program
    .version(version)
    .command('history <subcommand>', 'get historical data for various markets and indices.').alias('h')
    .command('calendar <subcommand>', 'get economic calendar informations.').alias('c')
    .parse(process.argv);
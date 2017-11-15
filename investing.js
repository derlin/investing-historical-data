var program = require('commander');

program
    .version('0.0.1')
    .command('history <subcommand>', 'get historical data for various markets and indices.').alias('h')
    .command('calendar <subcommand>', 'get economic calendar informations.').alias('c')
    .parse(process.argv);
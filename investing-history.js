var program = require('commander');
var version = require('./version');

program
    .version(version)
    .command('get <id>', 'fetch data about an item.').alias('g')
    .command('search <string>', 'search investing.com for an id.').alias('s')
    .parse(process.argv);
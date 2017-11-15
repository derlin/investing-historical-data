var program = require('commander');

program
    .version('0.0.1')
    .command('get <id>', 'fetch data about an item.').alias('g')
    .command('search <string>', 'search investing.com for an id.').alias('s')
    .parse(process.argv);
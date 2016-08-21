var program = require( 'commander' );

program
    .version( '0.0.1' )
    .command( 'get <id>', 'get historical data for the given commodity.' ).alias( 'g' )
    .command( 'list', 'list all available commodities.' ).alias( 'l' )
    .parse( process.argv );
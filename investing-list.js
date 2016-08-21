var program = require( 'commander' );
var commodities = require('./investing-commodities');

// ================= parse program arguments

program.version( '0.0.1' )
    .option( '-c --country [UK|US]', 'list only commodities from the given country' )
    .option( '-r --regex [search]', 'find commodities with names matching regex. Example: ca, \d, "[cad]a"' )
    .parse( process.argv );

var cm = commodities.commodities;

if(program.country){
     if( program.country.toUpperCase() == 'US'){
         cm = commodities.usOnly();
     }else if( program.country.toUpperCase() == 'UK'){
         cm = commodities.ukOnly();
     } else {
         console.error('unknown country', program.country);
         process.exit(1);
     }
}

if(program.regex){
    cm = commodities.find(new RegExp(program.regex, "i"));
    if(cm.length == 0){
         console.error('no commodity matching', program.regex);
         process.exit(0);
    }
}


for(var i = 0; i < cm.length; i++){
    var o = cm[i];
    console.log( o.name, "(" + o.country + ") :", o.id);
}
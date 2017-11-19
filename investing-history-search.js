var program = require('commander');
var utils = require('./utils');
var version = require('./version');

var SEARCH_URL = "https://www.investing.com/search/service/search";

var CATEGORIES = ["All", "Indices", "Equities", "Bonds", "Funds", "Commodities", "Currencies", "ETFs"];

// ================= parse program arguments

program
    .version(version)
    .arguments('<search>', 'search term (can contain spaces)')
    .description('search the items available in investing.com\'s history. ' +
        'The id can then be used as argument to investing-history-get.js.')
    .option('-f --file [file]', 'result file. If none, the result will be printed to the console.')
    .option('-c --category <category>', 'category to search. One of: "' + CATEGORIES.join('", "') + '". Default to All.')
    .option('-v --verbose', 'enable verbose mode.')
    .parse(process.argv);

var verbose = program.verbose;

// check for required param
if (!program.args.length) {
    console.log("missing required argument <string>");
    program.help();
    return;
}

var search = program.args[0];
var url = SEARCH_URL;
var searchCategory = program.category || CATEGORIES[0];

if (verbose) {
    console.log("getting info for term = ", search);
}

// ================= main

// form data
var post_data = {
    search_text: search,
    term: search,
    country_id: 0,
    tab_id: searchCategory
};

utils.postInvesting(url, post_data, verbose).then(
    function (body) {
        // got a body, parse it to csv
        var results = JSON.parse(body)["All"];
        if (results.length === 0) {
            console.log("no result found");
        } else {
            var csv = ['ID, name, type, country, url'];
            results.forEach(function (item) {
                if(searchCategory === CATEGORIES[0] || searchCategory === item.tab_ID)
                csv.push([
                    item.pair_ID,
                    item.name,
                    item.pair_type,
                    item.flag,
                    "https://www.investing.com" + item.link
                ].join(", "));
            });
            // write results to a file or to the console depending on the -f argument
            if (program.file) {
                utils.writeToFile(program.file, csv);
            } else {
                console.log(csv.join("\n"));
            }
        }
    },

    function (errorData) {
        console.error("An error occurred: " + errorData.error + ", " + errorData.httpResponse.statusCode);
    }
);


var cheerio = require('cheerio');
var program = require('commander');

var utils = require('./utils');

var SEARCH_URL = "https://www.investing.com/economic-calendar/search-auto-complete";

// ================= parse program arguments

program
    .arguments('<search>', 'search string')
    .parse(process.argv);

// check for required param
if (!program.args.length) {
    console.log("missing required argument <string>");
    program.help();
    return;
}

var search = program.args[0];

// -------------------

var post_data = {
    search_text: search,
    term: search,
    country_id: 0
};

utils.postInvesting(SEARCH_URL, post_data).then(function (body) {
    results = JSON.parse(body);
    var csv = ["id, name"];

    if (results.length > 0) {
        results.forEach(function (res) {
            csv.push([res.eventId, res.value].join(", "));
        });

        if(program.file) utils.writeToFile(program.file, csv);
        else console.log(csv.join("\n"));

    } else {
        console.log("no result found.");
    }

}, function (err, httpResponse) {
    console.log("an error occurred: ", err);
    console.log("HTTP status code: " + httpResponse.statusCode);
});


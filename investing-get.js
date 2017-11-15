var fs = require('fs');
var cheerio = require('cheerio');
var program = require('commander');

var utils = require('./utils');
var commodities = require('./investing-commodities');

var DEFAULT_HISTORY_URL = "https://uk.investing.com/instruments/HistoricalDataAjax";
// ================= parse program arguments

program.version('0.0.1')
    // .option('-u --url <url>', 'url for fetching historical data, default to "' + DEFAULT_HISTORY_URL + '"')
    .option('-i --id <id>', 'id of the commodity to fetch')
    .option('-s --startdate [date]', 'start date in MM/dd/yyyy format.', utils.asDate)
    .option('-e --enddate [date]', 'end date in MM/dd/yyyy format.', utils.asDate)
    .option('-f --file [file]', 'result file. If none, the result will be printed to the console.')
    .option('-v --verbose', 'enable verbose mode.')
    .parse(process.argv);

var verbose = program.verbose;

// check for required param
if (!program.id) {
    console.log("missing required parameter --id");
    program.help();
    return;
}

var commodity = commodities.get(program.id);

if (!commodity) {
    commodity = {name: 'unknown', country: 'unknown', id: program.id};
}

var url = program.url || DEFAULT_HISTORY_URL;

if (verbose) {
    console.log("getting info for", commodity.name, commodity.country);
    console.log("start date: ", program.startdate, ", end date: ", program.enddate, ", file: ", program.file);
}

// ================= main

getHtml(url, program.startdate, program.enddate, commodity.id).then(
    function (body) {
        // got a body, parse it to csv
        var csv = bodyToCSV(body);
        // write results to a file or to the console depending on the -f argument
        if (program.file) {
            utils.writeToFile(program.file, csv);
        } else {
            console.log(csv);
        }
    },

    function (err, response) {
        // could not get data
        console.error("An error occurred (id=" + id + "): ", err, ", ", response.statusCode);
    });

// ================= functions

/**
 * Retrieve historical data from investing.com
 * @param url    the url for ajax historical data retrieval
 * @param start  the start date
 * @param stop   the end date
 * @param id     the id / type of commodity
 * @returns {Promise} resolve(body) or reject(err, httpResponse)
 */
function getHtml(url, start, stop, id) {
    // form data
    var post_data = {
        action: 'historical_data',
        curr_id: id,
        st_date: utils.formatDate(start, "MM/dd/yyyy"), //'07/19/2015',
        end_date: utils.formatDate(stop, "MM/dd/yyyy"), //'08/19/2016',
        interval_sec: 'Daily',
        sort_col: 'date',
        sort_ord: 'DESC'
    };

    return utils.postInvesting(url, post_data, verbose);
}


/**
 * Parse the html body: extract data from the results table into a csv.
 * @param body  the html body
 * @returns {string} the csv, with headers
 */
function bodyToCSV(body) {
    var $ = cheerio.load(body);
    var csv = []; // an array of csv records
    var headers = [];

    // get the first table, which holds the interesting data
    var table = $('table').first();

    // get headers
    table.find('th').each(function () {
        headers.push($(this).text());
    });
    csv.push(headers.join(', '));

    // get data
    table.find('tr').each(function () {
        var line = [];
        $(this).children('td').each(function () {
            line.push($(this).text());
        });
        csv.push(line.join(', '));
    });

    if (verbose)
        console.log("Found " + (csv.length - 1) + " records.");

    return csv.join("\n");

}

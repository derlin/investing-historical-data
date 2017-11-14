var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Promise = require('promise');
var program = require('commander');

var commodities = require('./investing-commodities');

// ================= parse program arguments

program.version('0.0.1')
    .option('-i --id <id>', 'id of the commodity to fetch')
    .option('-s --startdate [date]', 'start date in MM/dd/yyyy format.', checkDate)
    .option('-e --enddate [date]', 'end date in MM/dd/yyyy format.', checkDate)
    .option('-f --file [file]', 'result file. If none, the result will be printed to the console.')
    .option('-v --verbose', 'enable verbose mode.')
    .parse(process.argv);

var verbose = program.verbose;

// check for required param
if(!program.id){
    console.log("missing required parameter --id");
    program.help();
    return;
}

var commodity = commodities.get(program.id);

if (!commodity) {
    commodity = {name: 'unknown', country: 'unknown', id: program.id};
}

if (verbose) {
    console.log("getting info for", commodity.name, commodity.country);
    console.log("start date: ", program.startdate, ", end date: ", program.enddate, ", file: ", program.file);
}

// ================= main

getHtml(program.startdate, program.enddate, commodity.id).then(
    function (body) {
        // got a body, parse it to csv
        var csv = bodyToCSV(body);
        // write results to a file or to the console depending on the -f argument
        if (program.file) {
            writeToFile(program.file, csv);
        } else {
            console.log(csv);
        }
    },

    function (id, err, response) {
        // could not get data
        console.error("An error occurred (id=" + id + "): ", err, ", ", response.statusCode);
    });

// ================= functions

/**
 * Retrieve historical data from investing.com
 * @param start  the start date
 * @param stop   the end date
 * @param id     the id / type of commodity
 * @returns {Promise} resolve(body) or reject(err, httpResponse)
 */
function getHtml(start, stop, id) {
    // form data
    var post_data = {
        action: 'historical_data',
        curr_id: id,
        st_date: start, //'07/19/2015',
        end_date: stop, //'08/19/2016',
        interval_sec: 'Daily'
    };

    if (verbose) console.log("post data:", post_data);

    // specify headers
    var options = {
        url: "https://uk.investing.com/instruments/HistoricalDataAjax",
        form: post_data,
        headers: {
            'Origin': 'http://www.investing.com',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu' +
            ' Chromium/51.0.2704.79 Chrome/51.0.2704.79 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    return new Promise(function (resolve, reject) {
        // do the request
        request.post(options, function (err, httpResponse, body) {
            if (verbose) console.log(id, ": ", httpResponse.statusCode, body.length);
            if (err || httpResponse.statusCode !== 200) reject(id, err, httpResponse);
            else resolve(body);
        });

    });

}

/**
 * Check date arguments: should match the format MM/dd/yyyy and be in the past.
 * If the date is incorrect, the whole programm will shut down.
 * @param s  the date
 * @returns {string} s
 */
function checkDate(s) {
    if (!s.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        console.error("Invalid date: required format is MM/dd/yyyy");
        process.exit(1);
    }
    var date = new Date(s);
    if (isNaN(date.getTime()) || date > new Date()) {
        console.error("Invalid date: should be in the past");
        return null;
    }
    return s;
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

/**
 * Write a string to a file
 * @param file the filename
 * @param str the string to write
 */
function writeToFile(file, str) {
    fs.writeFile(file, str, function (err) {
        if (err) return console.log(err);
        console.log("File saved.");
    })
}


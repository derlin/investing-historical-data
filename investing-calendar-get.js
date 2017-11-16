var cheerio = require('cheerio');
var program = require('commander');
var utils = require('./utils');
var version = require('./version');

var DATE_FORMAT = "YYYY-MM-DD";
var HEADERS = "date, label, time, actual, forecast, previous";

// ================= parse program arguments

program
    .version(version)
    .arguments('<id>', 'id of the item to fetch')
    .description('download tabular data from investing.com\'s economic calendar. ' +
        'To find the id of the item you are looking for, use investing-calendar-search.js.')
    .option('-s --startdate [date]', 'start date in MM/dd/yyyy format.', utils.asDate)
    .option('-e --enddate [date]', 'end date in MM/dd/yyyy format.', utils.asDate)
    .option('-f --file [file]', 'result file. If none, the result will be printed to the console.')
    .option('-v --verbose', 'enable verbose mode.')
    .parse(process.argv);

// check for required param
if (!program.args.length) {
    console.log("missing required argument <id>");
    program.help();
    return;
}

var ed = program.enddate || utils.now();
var st = program.startdate || utils.now();

var verbose = program.verbose;


var id = program.args[0];

if (verbose)
    console.log("getting data for id " + options.id, "start date: ", st, "end date: ", ed);

doGet(utils.formatDate(ed, DATE_FORMAT), utils.formatDate(st, DATE_FORMAT));

// ================= main

function doGet(fromDate, endDate) {
    if (verbose)
        console.log("getting data between", fromDate, endDate);

    var post_data = {
        eventID: 123456,
        event_attr_ID: id,
        event_timestamp: endDate + " 00:00:00", //'2017-11-03 12:30:00',
        is_speech: 0
    };

    var url = "https://www.investing.com/economic-calendar/more-history";

    var csv = [HEADERS];

    utils.postInvesting(url, post_data).then(function (body) {


        results = JSON.parse(body);
        var ts = null;
        var $ = cheerio.load(results.historyRows);

        $('tr').each(function () {
            var line = [];
            ts = $(this).attr('event_timestamp').split(" ")[0];
            line.push(ts); // datr
            $(this).children('td').each(function () {
                line.push($(this).text().replace(/,/g, " "));
            });
            csv.push(line.join(', '));
        });
        if (ts > fromDate) {
            // get recursively all the data
            doGet(fromDate, ts);

        } else {
            // got everything: print the results
            if (program.file) {
                utils.writeToFile(program.file, csv);
            } else {
                console.log(csv.join("\n"));
            }
        }

    }, function (errorData) {
        console.log("an error occurred: ", errorData.error);
        console.log("HTTP status code: " + erorData.httpResponse.statusCode);
    });
}









var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var program = require('commander');

var utils = require('./utils');

// ================= parse program arguments

program
    .command('get')
    .option('-i --id <event_id>')
    .option('-s --startdate [date]', 'start date in MM/dd/yyyy format.', utils.checkDate)
    .option('-e --enddate [date]', 'end date in MM/dd/yyyy format.', utils.checkDate)
    .action(function (options) {
        console.log("getting data for id " + options.id);
        var ed = options.enddate ? new Date(options.enddate) : new Date();
        var st = options.startdate ? new Date(options.startdate) : new Date();
        console.log("date, label, time, actual, forecast, previous");
        doGet(options.id, st.toISOString().substr(0, 10), ed.toISOString().substr(0, 10));

    });

program
    .command('search')
    .option('-s --string <search>', 'search string')
    .action(function (options) {
        console.log("searching for ", options.string);
        doSearch(options.string);
    });

program.parse(process.argv);

// -------------------

function doSearch(search) {
    var post_data = {
        search_text: search,
        term: search,
        country_id: 0
    };

    var url = "https://www.investing.com/economic-calendar/search-auto-complete";

    utils.postInvesting(url, post_data).then(function (body) {
        results = JSON.parse(body);
        if (results.length > 0) {
            results.forEach(function (res) {
                console.log(res.eventId + " --> " + res.value);
            });
        } else {
            console.log("no result found.");
        }

    }, function (err, httpResponse) {
        console.log("an error occurred: ", err);
        console.log("HTTP status code: " + httpResponse.statusCode);
    });

}

function doGet(id, fromDate, endDate) {
    var post_data = {
        eventID: 123456,
        event_attr_ID: id,
        event_timestamp: endDate + " 00:00:00", //'2017-11-03 12:30:00',
        is_speech: 0
    };
    var url = "https://www.investing.com/economic-calendar/more-history";

    utils.postInvesting(url, post_data).then(function (body) {

        results = JSON.parse(body);
        var csv = [];
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

        console.log(csv.join("\n"));
        if (ts > fromDate) {
            doGet(id, fromDate, ts);
        }

    }, function (err, httpResponse) {
        console.log("an error occurred: ", err);
        console.log("HTTP status code: " + httpResponse.statusCode);
    });

}







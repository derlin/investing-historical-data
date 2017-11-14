var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Promise = require('promise');
var program = require('commander');

var headers = {
    'Origin': 'http://www.investing.com',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu' +
    ' Chromium/51.0.2704.79 Chrome/51.0.2704.79 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
};

// ================= parse program arguments

program
    .command('get')
    .option('-i --id <event_id>')
    .option('-u --until <end_date>')
    .action(function (options) {
        console.log("getting data for id " + options.id);
        var ed = options.until ? new Date(options.until) : new Date();
        console.log("date, label, time, actual, forecast, previous");
        doGet(options.id, new Date(), ed);

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

    var options = {
        url: "https://www.investing.com/economic-calendar/search-auto-complete",
        form: post_data,
        headers: headers
    };

    request.post(options, function (err, httpResponse, body) {
        if (err === null) {
            results = JSON.parse(body);
            if (results.length > 0) {
                results.forEach(function (res) {
                    console.log(res.eventId + " --> " + res.value);
                });
            } else {
                console.log("no result found.");
            }
        } else {
            console.log("an error occurred: ", err);
            console.log("HTTP status code: " + httpResponse.statusCode);
        }
    });

}

function doGet(id, fromDate, endDate) {
    var post_data = {
        eventID: 123456,
        event_attr_ID: id,
        event_timestamp: fromDate.toISOString().substr(0, 10) + " 00:00:00", //'2017-11-03 12:30:00',
        is_speech: 0
    };

    var options = {
        url: "https://www.investing.com/economic-calendar/more-history",
        form: post_data,
        headers: headers
    };

    request.post(options, function (err, httpResponse, body) {
        if (err === null) {
            results = JSON.parse(body);
            var csv = [];
            var ts = null;
            var $ = cheerio.load(results.historyRows);
            $('tr').each(function () {
                var line = [];
                ts = $(this).attr('event_timestamp');
                line.push(ts.split(" ")[0]); // datr
                $(this).children('td').each(function () {
                    line.push($(this).text().replace(/,/g, " "));
                });
                csv.push(line.join(', '));
            });

            console.log(csv.join("\n"));
            fromDate = new Date(ts);
            if (fromDate > endDate) {
                doGet(id, fromDate, endDate);
            }

        } else {
            console.log("an error occurred: ", err);
            console.log("HTTP status code: " + httpResponse.statusCode);
        }
    });

}







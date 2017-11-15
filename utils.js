var request = require('request');
var Promise = require('promise');
var moment = require('moment');

const INVESTING_HEADERS = {
    'Origin': 'http://www.investing.com',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu' +
    ' Chromium/51.0.2704.79 Chrome/51.0.2704.79 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept-Language': 'en-GB,en;'
};

/**
 * Check date arguments: should match the format MM/dd/yyyy and be in the past.
 * If the date is incorrect, the whole programm will shut down.
 * @param s  the date
 * @returns {string} s
 */
function asDate(s) {
    var date = moment.utc(s);
    if (!date.isValid()) {
        console.error("Invalid date: should be in a valid ISO format (yyyy-MM-dd)");
        process.exit(1);
    }
    return date;
}

function formatDate(date, fmt){
    if(!date) return;
    else if(!date instanceof moment) date = moment(date);
    return date.format(fmt);
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

/**
 * Do a post request to investing.com
 * @param url the url
 * @param postData the dictionary containing post data
 * @param verbose whether to be verbose or not
 * @return a promise
 */
function postInvesting(url, postData, verbose) {

    if (verbose) console.log("post data:", postData);

    // specify headers
    var options = {
        url: url,
        form: postData,
        headers: INVESTING_HEADERS
    };

    return new Promise(function (resolve, reject) {
        // do the request
        request.post(options, function (err, httpResponse, body) {
            if (verbose) console.log("HTTP error: " + err, httpResponse.statusCode, body.length);
            if (err || httpResponse.statusCode > 305) reject({error: err, httpResponse: httpResponse});
            else resolve(body);
        });
    });
}

module.exports = {
    headers:  INVESTING_HEADERS,
    writeToFile: writeToFile,
    postInvesting: postInvesting,
    asDate: asDate,
    now: moment,
    formatDate: formatDate
};
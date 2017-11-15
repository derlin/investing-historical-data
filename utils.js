var request = require('request');
var Promise = require('promise');

const INVESTING_HEADERS = {
    'Origin': 'http://www.investing.com',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu' +
    ' Chromium/51.0.2704.79 Chrome/51.0.2704.79 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
};

/**
 * Check date arguments: should match the format MM/dd/yyyy and be in the past.
 * If the date is incorrect, the whole programm will shut down.
 * @param s  the date
 * @returns {string} s
 */
function asDate(s) {
    var date = new Date(s);
    if (isNaN(date.getTime()) || date > new Date()) {
        console.error("Invalid date: should be in a valid format (MM/dd/yyyy or yyyy-MM-dd) and in the past");
        return null;
    }
    return date;
}

function formatDate(date, fmt){
    if(!date || !(date instanceof Date)) return undefined;
    return fmt
        .replace("MM", ("00" + (date.getMonth() + 1)).slice(-2))
        .replace("dd", ("00" + date.getDate()).slice(-2))
        .replace("yyyy", "" + date.getFullYear());
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
            if (verbose) console.log("HTTP error: ", httpResponse.statusCode, body.length);
            if (err || httpResponse.statusCode !== 200) reject(err, httpResponse);
            else resolve(body);
        });
    });
}

module.exports = {

    headers:  INVESTING_HEADERS,
    writeToFile: writeToFile,
    postInvesting: postInvesting,
    asDate: asDate,
    formatDate: formatDate
};
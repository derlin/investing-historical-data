# Investing

A little command-line app to download data from [investing.com](http://www.investing.com/) in CSV format.

# Setup

```
git clone git@github.com:derlin/investing-historical-data.git
cd investing-historical-data
npm install
```

# Usage 

To run the script,  use one of the following:
```
npm start -- <args>
node investing.js <args>
``` 


# Available commands


      Usage: investing [options] [command]

      Options:

        -V, --version  output the version number
        -h, --help     output usage information


      Commands:

        history|h <get|search>   get historical data for various markets and indices.
        calendar|c <get|search>  get economic calendar informations.
        help [cmd]               display help for [cmd]



## history-search (h s)

List and search the available commodities and items along with their ID.

Example:

    npm start -- history search "us oil" -c Indices
    npm start -- h s "us oil" -c ETFs
    node investing-history-search.js "us oil" -c Indices

Options:

    -V, --version             output the version number
    -f --file [file]          result file. If none, the result will be printed to the console.
    -c --category <category>  category to search.
                              One of: "All", "Indices", "Equities",
                              "Bonds", "Funds", "Commodities", "Currencies",
                              "ETFs". Default to All.
    -v --verbose              enable verbose mode.
    -h, --help                output usage information



## history-get (h g)

Download historical data from [investing.com](http://www.investing.com/). By default, the result is printed to the console. Use `-f` if you want the csv te be saved directly into a file.

Examples:

    npm run start -- history get 957520 -s '2016-06-01' -e '2017-01-01'
    npm run start -- h g 957520 -s '2017-11-01'
    node investing-history-get.js 957520

Options:

    -V, --version          output the version number
    -s --startdate [date]  start date in DD/MM/YYYY format.
    -e --enddate [date]    end date in DD/MM/YYYY format.
    -f --file [file]       result file. If none, the result will be printed to the console.
    -v --verbose           enable verbose mode.
    -h, --help             output usage information

## calendar search (c s)

Search the items available in investing.com's economic calendar. The id can then be used as argument to `investing-calendar-get.js`.

Examples:

    npm run start -- calendar search "gdp"
    npm run start -- c s "gdp"
    node investing-calendar-search.js "gdp"

Options:

    -V, --version  output the version number
    -h, --help     output usage information

## calendar get (c g)

Download tabular data from investing.com's economic calendar. To find the id of the item you are looking for, use `investing-calendar-search.js`.

Examples:

    npm run start -- calendar get 1635 -s '2017-01-01'
    npm run start -- c g 1635 -s '2016-06-01' -e '2017-01-01'
    node investing-calendar.get.js 1635

Options:

    -V, --version          output the version number
    -s --startdate [date]  start date in MM/dd/yyyy format.
    -e --enddate [date]    end date in MM/dd/yyyy format.
    -f --file [file]       result file. If none, the result will be printed to the console.
    -v --verbose           enable verbose mode.
    -h, --help             output usage information


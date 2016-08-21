# Investing

A little command-line app to download historical data from [investing.com](http://www.investing.com/) in CSV format.

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


      Commands:
      
        get [name|id]  get historical data
        list           list all available commodities
        help [cmd]     display help for [cmd]
      
      Options:
      
        -h, --help     output usage information
        -V, --version  output the version number


## list

Get the list of available commodities.

      Options:
      
        -h, --help            output usage information
        -V, --version         output the version number
        -c --country [UK|US]  list only commodities from the given country
        -r --regex [search]   find commodities with names matching regex. Example: ca, d, "[cad]a"


## get 

Download historical data from [investing.com](http://www.investing.com/). By default, the result is printed to the console. Use `-f` if you want the csv te be saved directly into a file.

      Options:
      
        -h, --help             output usage information
        -V, --version          output the version number
        -i --id [id]           id of the commodity to fetch
        -s --startdate [date]  start date in MM/dd/yyyy format.
        -e --enddate [date]    end date in MM/dd/yyyy format.
        -f --file [file]       result file. If none, the result will be printed to the console.
        -v --verbose           enable verbose mode.


# Commodities

The program supports commodities from US and UK. If you need a commodity which is not listed by `list`, you can try to find its id in the _investing.com_ page. 

For example, to find the id corresponding to gold:

1. go to http://www.investing.com/commodities/gold;
2. open the developer console of your navigator;
3. in the html source file, search the string `pair_id`, for example: `<div pair_id="8830">...</div>`.

Here you go ! 8830 is the gold commodity id. You can not run `investing.js get -i 8830`.

Usually, commodities ids are between 8800-8999 or 950000-961999. 

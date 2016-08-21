var COMMODITIES = [
    {
        "name"   : "Gold",
        "country": "US",
        "id"     : "8830"
    },
    {
        "name"   : "XAU/USD",
        "country": "US",
        "id"     : "68"
    },
    {
        "name"   : "Silver",
        "country": "US",
        "id"     : "8836"
    },
    {
        "name"   : "Copper",
        "country": "US",
        "id"     : "8831"
    },
    {
        "name"   : "Platinum",
        "country": "US",
        "id"     : "8910"
    },
    {
        "name"   : "Palladium",
        "country": "US",
        "id"     : "8883"
    },
    {
        "name"   : "Crude Oil",
        "country": "US",
        "id"     : "8849"
    },
    {
        "name"   : "Brent Oil",
        "country": "UK",
        "id"     : "8833"
    },
    {
        "name"   : "Natural Gas",
        "country": "US",
        "id"     : "8862"
    },
    {
        "name"   : "Heating Oil",
        "country": "US",
        "id"     : "8988"
    },
    {
        "name"   : "Gasoline RBOB",
        "country": "US",
        "id"     : "954867"
    },
    {
        "name"   : "London Gas Oil",
        "country": "UK",
        "id"     : "8861"
    },
    {
        "name"   : "Aluminum",
        "country": "UK",
        "id"     : "49768"
    },
    {
        "name"   : "Zinc",
        "country": "UK",
        "id"     : "956470"
    },
    {
        "name"   : "Lead",
        "country": "UK",
        "id"     : "959207"
    },
    {
        "name"   : "Nickel",
        "country": "UK",
        "id"     : "959208"
    },
    {
        "name"   : "Copper",
        "country": "UK",
        "id"     : "959211"
    },
    {
        "name"   : "Tin",
        "country": "UK",
        "id"     : "959209"
    },
    {
        "name"   : "US Wheat",
        "country": "US",
        "id"     : "8917"
    },
    {
        "name"   : "Rough Rice",
        "country": "US",
        "id"     : "13916"
    },
    {
        "name"   : "US Corn",
        "country": "US",
        "id"     : "8918"
    },
    {
        "name"   : "US Soybeans",
        "country": "US",
        "id"     : "8916"
    },
    {
        "name"   : "US Soybean Oil",
        "country": "US",
        "id"     : "8915"
    },
    {
        "name"   : "US Soybean Meal",
        "country": "US",
        "id"     : "8919"
    },
    {
        "name"   : "US Cotton #2",
        "country": "US",
        "id"     : "8851"
    },
    {
        "name"   : "US Cocoa",
        "country": "US",
        "id"     : "8894"
    },
    {
        "name"   : "US Coffee C",
        "country": "US",
        "id"     : "8832"
    },
    {
        "name"   : "US Sugar #11",
        "country": "US",
        "id"     : "8869"
    },
    {
        "name"   : "Orange Juice",
        "country": "US",
        "id"     : "8891"
    },
    {
        "name"   : "Live Cattle",
        "country": "US",
        "id"     : "8914"
    },
    {
        "name"   : "Lean Hogs",
        "country": "US",
        "id"     : "8913"
    },
    {
        "name"   : "Feeder Cattle",
        "country": "US",
        "id"     : "961618"
    },
    {
        "name"   : "Lumber",
        "country": "US",
        "id"     : "959198"
    },
    {
        "name"   : "Oats",
        "country": "US",
        "id"     : "959199"
    }
];

function filter(prop, condition){
    return COMMODITIES.filter(function(o){
        return o[prop] == condition;
    });
}

function find(regex, country){
    var commodities = COMMODITIES;
    if(country) commodities = filterByCountry(country);

    return commodities.filter(function(o){
        return o.name.match(regex);
    });
}

function findById(id){
    return COMMODITIES.filter(function(o){
        return o.country == country;
    });
}

module.exports = {

    commodities:  COMMODITIES,
    usOnly: function(){
        return filter('country', 'US');
    },
    ukOnly: function(){
        return filter('country', 'UK');
    },
    get: function(id){
        var o = filter('id', id);
        return o.length != 1 ? undefined : o[0];
    },
    find: find
};
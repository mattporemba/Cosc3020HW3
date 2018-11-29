// Eventually, I need to read from the .csv file
// Via node.js


// Lets just manually enter data, what would that look like...
// We can probably use lat and long to determine distance...
var citiesList = [
    ["Cheyenne", 41.1418, -104.794],
    ["Laramie", 41.3095, -105.61],
    ["Fort Laramie", 42.2134, -104.5178],    // Parser should work with " "
    ["Powell", 44.7962, -108.7682],
    ["Saratoga", 41.4517, -106.8107],
    ["Torrington", 42.0658, -104.1621],
    ["Buffalo", 44.3426, -106.7138],
    ["Rock Springs", 41.595, -109.2237],
    ["Evanston", 41.2602, -110.9646]
]

// Held-Karp Algorithm
// cities is the set NOT visited so far (including start)
function heldKarp(cities, start) {
    if (cities.length == 2) {
        console.log(cities);
        // return  distance between last two;
        return distance(0, 1);
    }
    else {
        var minDist = Infinity;
        for(var i = 0; i < cities.length-1; i++){
            var newCities = cities.slice();    // Pass a copy of the list
            newCities.splice(start, 1); // Delete start from cities
            // Need a new start
            var newStart = i;
            //console.log("start:\t"+start+"\nnewStart:\t"+newStart);
            heldKarp(newCities, newStart) + distance(start, newStart);
        }
        return minDist;
    }
}







// Stochastic Local Search
// Set debug to TRUE if you would like to see each step logged to the console.
// TODO: DECIDE: Where to end: could be a set number/time, could be related to time complexity,
// could be (this would be good i think) when haven't seen a change in ___ iterations
// TODO: Needs a random start
var debug = false;
function stochasticSearch(route) {
    for (var index = 0; index < (route.length * route.length); index++){
        var incumbent = routeDist(route);

        // Create a new random route using twoOptSwap, ensure i =< k
        var i = Math.floor(Math.random()*(route.length-1));
        var k = Math.floor(Math.random()*(route.length-1));
        if (k < i){
            var temp = i;
            i = k;
            k = temp;
        }

        if(debug){
            console.log("----------");
            console.log("Iteration: " + index);
            console.log("i:\t"+i+"\nk:\t"+k);
        }

        // twoOptSwap is destructive, need a copy of route
        var oldRoute = route.slice();
        var newRoute = twoOptSwap(oldRoute, i, k);
        var newDist = routeDist(newRoute);

        if (debug) {
            console.log("old:\t" + route);
            console.log("new:\t" + newRoute);
            console.log("incumbent: " + incumbent + "\nnewDist: " + newDist);
            console.log("----------");
        }


        if(newDist<incumbent){
            incumbent = newDist;
            route = newRoute;
        }
    }
    return route;
}

function twoOptSwap(route, i, k) {
    var beginning = route.splice(0,i);
    //console.log("Beg:\t" + beginning);
    var middle = route.splice(0, k-i + 1);
    //console.log("Mid:\t" + middle);
    var end = route;
    //console.log("End:\t" + end);

    var newRoute = beginning.concat(middle.reverse()).concat(end);
    return newRoute;
}






//
// HELPER FUNCTIONS:
//

// Takes city name and list, returns city's index
function findCity(city, cityList) {
    for(var i = 0; i < cityList.length; i++){
        if (city == cityList[i][0]){
            return i;
        }
    }
    return -1;
}
// Take city index, return lat and long
function getLat(i){
    return citiesList[i][1];
}
function getLong(i){
    return citiesList[i][2];
}
// Print a city by index
function printCity(i) {
    console.log("City: " + citiesList[i][0]);
    console.log("Latitude: " + getLat(i));
    console.log("Longitude: " + getLong(i) + "\n");
}


// The haversine formula for distance (km) between two coordinates
// Lightly modified to take two cities, original code from:
// https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}
function distance(city1, city2){
    var R = 6371; // km
    var x1 = getLat(city2)-getLat(city1);
    var dLat = x1.toRad();
    var x2 = getLong(city2)-getLong(city1);
    var dLon = x2.toRad();
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(getLat(city1).toRad()) * Math.cos(getLat(city2).toRad()) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Function to find the distance of a route
function routeDist(route) {
    var dist = 0;
    for (var i = 0; i < route.length-1; i++){
        dist += distance(route[i], route[i+1]);
    }
    return dist;
}




//
// LOGIC TESTS
//
// If true, shows tests I ran to make sure individual functions were working as intended.
// This is NOT the tests of the two algorithms themselves, thus will be left false on turn-in.
if (false) {
// Testing distance function
    console.log("----------\nTesting distance funtion:");
    var city1 = findCity("Cheyenne", cities);
    var city2 = findCity("Laramie", cities)
    console.log("Laramie to Cheyenne: " + distance(city1, city2) + " km");

    var city3 = findCity("Evanston", cities);
    console.log("Laramie to Evanston: " + (distance(city1, city3)) + "km");

// Testing print function
    console.log("----------\nTesting printing a City:");
    for (var i = 0; i < cities.length; i++) {
        printCity(i);
    }

// Testing twoOptSwap
    console.log("----------\nTesting twoOptSwap:");
    console.log(twoOptSwap([0, 1, 2, 3, 4, 5], 2, 4));
// Should be: [0, 1, 4, 3, 2, 5]
    console.log(twoOptSwap(['A', 'B', 'C', 'D', 'E', 'F'], 2, 4));
// Should be: [A, B, E, D, C, F], as given as an example
    console.log(twoOptSwap(['A', 'B', 'E', 'D', 'C', 'F'], 2, 4));


// Testing routeDist
    console.log("----------\nTesting routeDist funtion:");
// Cheyenne -> Laramie -> Fort Laramie
    console.log(routeDist([0, 1, 2]) ==
        distance(0, 1) +
        distance(1,2));

    console.log(routeDist([0, 1, 2, 3, 4]) ==
        distance(0, 1) +
        distance(1,2) +
        distance(2, 3) +
        distance(3, 4));

// Testing Stochastic Local Search
    var bestRoute = stochasticSearch([0, 1, 2, 3, 4, 5, 6, 7, 8], 0);
    console.log("Final Route: " + bestRoute);
    console.log("Distance: " + routeDist(bestRoute) + " km")
}

console.log(heldKarp(citiesList, 0));



'use strict';

/* global GD_SERVER_ADDRESS */
/* global d3 */
/* global setUpBrush */

/*
    Variables
*/

const PROMISES = [];

let meteoriteData;

let countries;

let time;

// Animation speed in years/second
let speed = 1;

/*
    Functions
*/

function row(d) {
    if ('year'      in d) { d.year = d3.timeParse('%Y')(d.year); }
    if ('number'    in d) { d.number = parseInt(d.number); }
    if ('totalMass' in d) { d.totalMass = parseFloat(d.totalMass); }
    return d;
}

/*
    Execution
*/

// Get all the data
PROMISES.push(fetch(GD_SERVER_ADDRESS)
    .then(response => response.text())
    .then(data => {
        meteoriteData = d3.csvParse(data, row);
    }));

// Get the data grouped by year and set up the brush
PROMISES.push(fetch(GD_SERVER_ADDRESS + '?groupByYear')
    .then(response => response.text())
    .then(data => {
        const DATA_GROUPED_BY_YEAR = d3.csvParse(data, row);
        time = DATA_GROUPED_BY_YEAR[0].year.getFullYear();
        setUpBrush(DATA_GROUPED_BY_YEAR);
    }));

// Get the list of countries and their IDs and
// set up the country field
PROMISES.push(fetch(GD_SERVER_ADDRESS + '?countries')
    .then(response => response.text())
    .then(data => {
        countries = d3.csvParse(data);
        setUpTypeAheadField();
    }));


Promise.all(PROMISES).then(() => {
    startMainAnimation();
});


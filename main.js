'use strict';

/*
    Variables
*/

const PROMISES = [];

let meteoriteData;

let countries;

/*
    Execution
*/

// Get all the data
PROMISES.push(fetch(GD_SERVER_ADDRESS)
    .then(response => response.text())
    .then(data => {
        meteoriteData = d3.csvParse(data, d => {
            d.year = d3.timeParse('%Y')(d.year);
            return d;
        });
    }));

// Get the data grouped by year and set up the brush
PROMISES.push(fetch(GD_SERVER_ADDRESS + '?groupByYear')
    .then(response => response.text())
    .then(data => {
        const DATA_GROUPED_BY_YEAR = d3.csvParse(data, d => {
            return {
                year      : d3.timeParse('%Y')(d.year),
                number    : parseInt(d.number),
                totalMass : parseFloat(d.totalMass)
            };
        });
        time = DATA_GROUPED_BY_YEAR[0].year.getFullYear();
        setUpBrush(DATA_GROUPED_BY_YEAR);
    }));

// Get the list of countries and their IDs and
// set up the country field
PROMISES.push(fetch(GD_SERVER_ADDRESS + '?countries')
    .then(response => response.text())
    .then(data => {
        countries = d3.csvParse(data);
        setSearchDatabase(countries.map(data => data.name));
    }));


Promise.all(PROMISES).then(() => {
    setUpBipartiteGraph();
    startMainAnimation();
});


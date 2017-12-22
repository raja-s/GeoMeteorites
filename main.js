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
            d.long = parseFloat(d.long);
            d.lat  = parseFloat(d.lat);
            d.mass = parseFloat(d.mass);
            return d;
        });
    }));

// Get the data grouped by year and set up the timeline
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
        setUpTimeline(DATA_GROUPED_BY_YEAR);
    }));

// Get the list of countries and their IDs and
// set up the country field
PROMISES.push(fetch(GD_SERVER_ADDRESS + '?countries')
    .then(response => response.text())
    .then(data => {
        countries = d3.csvParse(data);
    }));


Promise.all(PROMISES).then(() => {
    
    setUpSearchDatabase(countries.filter(country => meteoriteData.some(entry =>
            country.country === entry.country)).map(data => data.name));
    
    setUpBipartiteGraph();
    
    startMainAnimation();
    
});


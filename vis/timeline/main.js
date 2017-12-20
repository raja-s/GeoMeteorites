'use strict';

/*
    Constants
*/

const TIMELINE = d3.select('#timeline');

const TIMELINE_DIMENSIONS = Object.freeze({
    HEIGHT : window.innerHeight * 0.15,
    WIDTH  : window.innerWidth  * 0.7
});

const TIMELINE_MARGINS = Object.freeze({
    
    // Vertical margins
    TOP    : 0,
    MIDDLE : 20,
    BOTTOM : 0,
    
    // Horizontal margins
    RIGHT  : 60,
    LEFT   : 60
    
});

const TIMELINE_CHART_DIMENSIONS = Object.freeze({
    
    HEIGHT : (TIMELINE_DIMENSIONS.HEIGHT -
        (TIMELINE_MARGINS.TOP + TIMELINE_MARGINS.MIDDLE + TIMELINE_MARGINS.BOTTOM)) / 2,
    
    WIDTH  : TIMELINE_DIMENSIONS.WIDTH  - (TIMELINE_MARGINS.LEFT + TIMELINE_MARGINS.RIGHT)
    
});

const TIMELINE_TRANSITION = d3.transition()
                                .duration(SECOND);

/*
    Variables
*/

let xTimeline = d3.scaleTime()
                      .range([0, TIMELINE_CHART_DIMENSIONS.WIDTH]);

let xAxisTimeline = d3.axisBottom(xTimeline);

let timelineBarWidth = 0;

/*
    D3 code
*/

TIMELINE.attr('height', TIMELINE_DIMENSIONS.HEIGHT);
TIMELINE.attr('width' , TIMELINE_DIMENSIONS.WIDTH);

/*
    Functions
*/

function setUpDataForTimeline(data) {
    
    const RESULT_DATA = data.slice();
    
    // Fill up empty holes in the data
    let previous = RESULT_DATA[0].year.getFullYear();
    for (let i = 1 ; i < RESULT_DATA.length ; i++) {
        const CURRENT = RESULT_DATA[i].year.getFullYear();
        const DIFF = CURRENT - previous;
        if (DIFF > 1) {
            for (let k = 1 ; k < DIFF ; k++) {
                RESULT_DATA.splice(i + k - 1, 0, {
                    // year      : d3.timeParse('%Y')(previous + k),
                    year      : new Date(previous + k, 0),
                    number    : 0,
                    totalMass : 0
                });
            }
            i += DIFF - 1;
        }
        previous = CURRENT;
    }
    
    for (let year = RESULT_DATA[0].year.getFullYear() - 1 ; year >= timelineStart() ; year--) {
        RESULT_DATA.unshift({
            year      : new Date(year, 0),
            number    : 0,
            totalMass : 0
        });
    }
    
    for (let year = RESULT_DATA[RESULT_DATA.length - 1].year.getFullYear() + 1;
        year <= timelineEnd() ; year++)
    {
        RESULT_DATA.push({
            year      : new Date(year, 0),
            number    : 0,
            totalMass : 0
        });
    }
    
    return RESULT_DATA;
    
}

function setUpTimeline(data) {
    
    const DOMAIN_YEARS = d3.extent(data, d => d.year).map(year => year.getFullYear());
    
    DOMAIN_YEARS[0]--;
    DOMAIN_YEARS[1]++;
    
    xTimeline.domain([ new Date(DOMAIN_YEARS[0], 0) , new Date(DOMAIN_YEARS[1], 0) ]);
    
    timelineBarWidth = (TIMELINE_CHART_DIMENSIONS.WIDTH / (DOMAIN_YEARS[1] - DOMAIN_YEARS[0])) - 1;
    
    data = setUpDataForTimeline(data);
    
    setUpFrequencyTimeline(data);
    setUpMeanMassTimeline(data);
    
    updateFrequencyTimeline(data);
    updateMeanMassTimeline(data);
    
    TIMELINE.append('g')
              .attr('class', 'axes x-axes')
              .attr('transform', `translate(${TIMELINE_MARGINS.LEFT},
                    ${TIMELINE_MARGINS.TOP + TIMELINE_CHART_DIMENSIONS.HEIGHT})`)
              .call(xAxisTimeline);
    
    appendTimeIndicator();
    
}

function updateTimeline(data) {
    
    data = setUpDataForTimeline(data);
    
    updateFrequencyTimeline(data);
    updateMeanMassTimeline(data);
    
}

function timelineStart() {
    return xTimeline.domain()[0].getFullYear() + 1;
}

function timelineEnd() {
    return xTimeline.domain()[1].getFullYear() - 1;
}

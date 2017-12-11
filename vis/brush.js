'use strict';

/*
    Brush
*/

const BRUSH_SVG = d3.select('#timeline');

const BRUSH_SVG_WIDTH = window.innerWidth;
const BRUSH_SVG_HEIGHT = 150;

const MARGINS = Object.freeze({
    TOP    : 20,
    RIGHT  : 40,
    BOTTOM : 20,
    LEFT   : 40
});

const BRUSH_WIDTH  = BRUSH_SVG_WIDTH  - MARGINS.LEFT - MARGINS.RIGHT;
const BRUSH_HEIGHT = BRUSH_SVG_HEIGHT - MARGINS.TOP  - MARGINS.BOTTOM;

const BRUSH_SELECTION = {
    start : 0,
    end   : 0
};

BRUSH_SVG.attr('width', BRUSH_SVG_WIDTH);
BRUSH_SVG.attr('height', BRUSH_SVG_HEIGHT);

let x = d3.scaleTime().range([0, BRUSH_WIDTH]);
let y = d3.scaleLog().range([BRUSH_HEIGHT, 0]);

let xAxis = d3.axisBottom(x);
let yAxis = d3.axisLeft(y).ticks(4, ',d');

const BRUSH = d3.brushX()
    .extent([[0, 0], [BRUSH_WIDTH, BRUSH_HEIGHT]])
    .on('brush end', brushed);

BRUSH_SVG.append('defs').append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', BRUSH_WIDTH)
    .attr('height', BRUSH_HEIGHT);

const CONTEXT = BRUSH_SVG.append('g')
    .attr('class', 'context')
    .attr('transform', `translate(${MARGINS.LEFT}, ${MARGINS.TOP})`);

function setUpBrush(data) {
    
    // Fill up empty holes in the data
    let previous = data[0].year.getFullYear();
    for (let i = 1 ; i < data.length ; i++) {
        const CURRENT = data[i].year.getFullYear();
        const DIFF = CURRENT - previous;
        if (DIFF > 1) {
            for (let k = 1 ; k < DIFF ; k++) {
                data.splice(i + k - 1, 0, {
                    year      : d3.timeParse('%Y')(previous + k),
                    number    : 0,
                    totalMass : 0
                });
            }
            i += DIFF - 1;
        }
        previous = CURRENT;
    }
    
    x.domain(d3.extent(data , d => d.year));
    y.domain([1, d3.max(data, d => d.number)]);
    
    let xExtent      = x.domain().map(bound => bound.getFullYear());
    let xBandwidth   = BRUSH_WIDTH / (xExtent[1] - xExtent[0]);
    let barWidth     = xBandwidth - 1;
    let halfBarWidth = barWidth / 2;
    
    let transition = d3.transition()
                         .duration(1000);
    
    CONTEXT.append('g')
             .attr('id', 'timeline-bars-group')
        .selectAll('rect')
             .data(data)
            .enter()
           .append('rect')
             .attr('x'     , d => x(d.year) - halfBarWidth)
             .attr('y'     , BRUSH_HEIGHT)
             .attr('width' , barWidth)
             .attr('class' , 'bars-meteorites-found')
            .style('opacity', '0.7')
       .transition(transition)
             .attr('y'     , d => y(d.number))
             .attr('height', d => BRUSH_HEIGHT - y(d.number));
    
    CONTEXT.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${BRUSH_HEIGHT})`)
        .call(xAxis);
    
    CONTEXT.append('g')
        .attr('class', 'axis axis--y')
        .call(yAxis);
    
    CONTEXT.append('g')
        .attr('class', 'brush')
        .call(BRUSH)
        .call(BRUSH.move, x.range());
    
    appendTimeIndicator();
    
    updateSelection(x.domain());
    
}

function brushed() {
    
    if ((d3.event.sourceEvent !== null) && (d3.event.sourceEvent.type === 'mouseup')) {
        
        let selection;
        
        if (d3.event.selection === null) {
            selection = x.domain();
            d3.select(this).call(BRUSH.move, x.range());
        } else {
            selection = d3.event.selection.map(x.invert, x);
        }
        
        updateSelection(selection);
        
    }
    
}

function updateSelection(selection) {
    
    selection = selection.map(date => date.getFullYear());
    
    BRUSH_SELECTION.start = selection[0];
    BRUSH_SELECTION.end   = selection[1];
    
}

/*
    Time Indicator
*/

let timeIndicator, timeText;
let presentBar;

const TIME_HANDLE_HEIGHT = 37.5;
const TIME_HANDLE_WIDTH  = 50;
const TIME_HANDLE_PATH = 'M40,0Q50,0,50,10L50,20Q50,25,45,27.5L25,37.5L5,27.5Q0,25,0,20L0,10Q0,0,10,0Z';

const TIME_INDICATOR_TRANSITION = d3.transition()
                                      .duration(250);

function appendTimeIndicator() {
    
    timeIndicator = BRUSH_SVG.append('g')
                               .attr('id', 'time-indicator');
    
    timeIndicator.append('path')
                   .attr('id', 'time-handle')
                   .attr('d', TIME_HANDLE_PATH);
    
    timeText = timeIndicator.append('text')
                   .attr('id', 'time-text')
                   .attr('x', TIME_HANDLE_WIDTH / 2)
                   .attr('y', TIME_HANDLE_HEIGHT / 1.875);
    
}

function updateTimeIndicator() {
    
    const TIME_DIFF = time - x.domain()[0].getFullYear();
    
    if (presentBar !== undefined) {
        d3.select(presentBar).transition(TIME_INDICATOR_TRANSITION)
                                  .style('opacity', '0.7');
    }
    
    presentBar = document.getElementById('timeline-bars-group')
        .children[(TIME_DIFF === 0) ? 0 : TIME_DIFF];
    
    d3.select(presentBar).transition(TIME_INDICATOR_TRANSITION)
                              .style('opacity', '1');
    
    const X = MARGINS.LEFT + x(new Date(time, 0)) - (TIME_HANDLE_WIDTH / 2);
    const Y = MARGINS.TOP + BRUSH_HEIGHT - presentBar.height.baseVal.value - TIME_HANDLE_HEIGHT - 2;
    
    timeIndicator.transition(TIME_INDICATOR_TRANSITION)
                       .attr('transform', `translate(${X}, ${Y})`);
            
    
    // Update the year inside the indicator
    timeText.html(time);
    
}

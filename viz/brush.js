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
let y = d3.scaleLinear().range([BRUSH_HEIGHT, 0]);

let xAxis = d3.axisBottom(x);
let yAxis = d3.axisLeft(y);

const BRUSH = d3.brushX()
    .extent([[0, 0], [BRUSH_WIDTH, BRUSH_HEIGHT]])
    .on('brush end', brushed);

BRUSH_SVG.append('defs').append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', BRUSH_WIDTH)
    .attr('height', BRUSH_HEIGHT);

const context = BRUSH_SVG.append('g')
    .attr('class', 'context')
    .attr('transform', `translate(${MARGINS.LEFT}, ${MARGINS.TOP})`);

function setUpBrush(data) {
    
    x.domain(d3.extent(data , d => d.year));
    y.domain([0, d3.max(data, d => d.number)]);
    
    let xExtent      = x.domain().map(bound => bound.getFullYear());
    let xBandwidth   = BRUSH_WIDTH / (xExtent[1] - xExtent[0]);
    let barWidth     = xBandwidth - 1;
    let halfBarWidth = barWidth / 2;
    
    let transition = d3.transition()
                         .duration(1000);
    
    context.append('g')
        .selectAll('rect')
             .data(data)
            .enter()
           .append('rect')
             .attr('x'     , d => x(d.year) - halfBarWidth)
             .attr('y'     , BRUSH_HEIGHT)
             .attr('width' , barWidth)
             .attr('class' , 'bars-meteorites-found')
       .transition(transition)
             .attr('y'     , d => y(d.number))
             .attr('height', d => BRUSH_HEIGHT - y(d.number));
            
    
    context.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${BRUSH_HEIGHT})`)
        .call(xAxis);
    
    context.append('g')
        .attr('class', 'brush')
        .call(BRUSH)
        .call(BRUSH.move, x.range());
    
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

const TIME_INDICATOR = document.getElementById('time-indicator');
const TIME_TEXT      = document.getElementById('time-text');

const TIME_HANDLE_HEIGHT = 37.5;
const TIME_HANDLE_WIDTH  = 50;

function updateTimeIndicator() {
    
    // Update the indicator's position
    TIME_INDICATOR.setAttribute('transform',
        `translate(${MARGINS.LEFT + x(new Date(time, 0)) - (TIME_HANDLE_WIDTH / 2)},
            ${MARGINS.TOP - TIME_HANDLE_HEIGHT})`);
    
    // Update the year inside the indicator
    TIME_TEXT.innerHTML = time;
    
}

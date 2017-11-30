
const BRUSH_SVG = d3.select('svg');

const SVG_WIDTH = document.getElementById('mapArea').clientWidth;
const SVG_HEIGHT = 100;

const MARGINS = Object.freeze({
    TOP    : 20,
    RIGHT  : 20,
    BOTTOM : 30,
    LEFT   : 40
});

const BRUSH_WIDTH  = SVG_WIDTH  - MARGINS.LEFT - MARGINS.RIGHT;
const BRUSH_HEIGHT = SVG_HEIGHT - MARGINS.TOP  - MARGINS.BOTTOM;

const BRUSH_SELECTION = {
    start : 0,
    end   : 0
};

BRUSH_SVG.attr('width', SVG_WIDTH);
BRUSH_SVG.attr('height', SVG_HEIGHT);

let x = d3.scaleTime().range([0, BRUSH_WIDTH]);
let y = d3.scaleLinear().range([BRUSH_HEIGHT, 0]);

let xAxis = d3.axisBottom(x);
let yAxis = d3.axisLeft(y);

const BRUSH = d3.brushX()
    .extent([[0, 0], [BRUSH_WIDTH, BRUSH_HEIGHT]])
    .on('brush end', brushed);

const area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(d => x(d.year))
    .y0(BRUSH_HEIGHT)
    .y1(d => y(d.number));

BRUSH_SVG.append('defs').append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', BRUSH_WIDTH)
    .attr('height', BRUSH_HEIGHT);

const context = BRUSH_SVG.append('g')
    .attr('class', 'context')
    .attr('transform', `translate(${MARGINS.LEFT}, ${MARGINS.TOP})`);

function setUpBrush(data) {
    
    x.domain(d3.extent(data, d => d.year));
    y.domain([0, d3.max(data, d => d.number)]);
    
    context.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('d', area);
    
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

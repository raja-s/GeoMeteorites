const svg = d3.select("svg");
const svgWidth = document.getElementById("mapArea").clientWidth;
const svgHeight = 100;
const margin = {top: 20, right: 20, bottom: 30, left: 40};
const brushWidth = svgWidth - margin.left - margin.right;
const brushHeight = svgHeight - margin.top - margin.bottom;

svg.attr("width", svgWidth);
svg.attr("height", svgHeight);


const parseDate = d3.timeParse("%b %Y");

let x = d3.scaleTime().range([0, brushWidth]);
let y = d3.scaleLinear().range([brushHeight, 0]);

let xAxis = d3.axisBottom(x);
let yAxis = d3.axisLeft(y);

const brush = d3.brushX()
    .extent([[0, 0], [brushWidth, brushHeight]])
    .on("brush end", brushed);

const area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.date); })
    .y0(brushHeight)
    .y1(function(d) { return y(d.number); });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", brushWidth)
    .attr("height", brushHeight);

const context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("fakeData.csv", type, function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.number; })]);

    context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + brushHeight + ")")
        .call(xAxis);

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

});

function brushed() {
    // console.log("yes");
}

function type(d) {
    d.date = parseDate(d.date);
    d.number = +d.number;
    return d;
}

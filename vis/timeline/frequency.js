'use strict';

/*
    Constants
*/

const FREQUENCY_GRAPH =
    TIMELINE.append('g')
              .attr('transform', `translate(${TIMELINE_MARGINS.LEFT}, ${TIMELINE_MARGINS.TOP})`);

/*
    Variables
*/

let yFrequency = d3.scaleLog()
                      .range([TIMELINE_CHART_DIMENSIONS.HEIGHT, 0]);

let yAxisFrequency = d3.axisRight(yFrequency)
                          .ticks(4, ',d');

/*
    Functions
*/

function setUpFrequencyTimeline(data, barWidth) {
    
    const HALF_BAR_WIDTH = barWidth / 2;
    
    yFrequency.domain([0.5, d3.max(data, d => d.number)]);
    
    FREQUENCY_GRAPH.append('g')
                     .attr('id', 'timeline-frequency-bars-group')
                .selectAll('rect')
                     .data(data)
                    .enter()
                   .append('rect')
                     .attr('x'     , d => xTimeline(d.year) - HALF_BAR_WIDTH)
                     .attr('y'     , TIMELINE_CHART_DIMENSIONS.HEIGHT)
                     .attr('width' , barWidth)
                     .attr('class' , 'timeline-bars timeline-frequency-bars')
               .transition(TIMELINE_TRANSITION)
                     .attr('y'     , d => (d.number === 0) ?
                            TIMELINE_CHART_DIMENSIONS.HEIGHT : yFrequency(d.number))
                     .attr('height', d => (d.number === 0) ?
                            0 : TIMELINE_CHART_DIMENSIONS.HEIGHT - yFrequency(d.number));
    
    FREQUENCY_GRAPH.append('g')
                     .attr('class', 'axes')
                     .attr('transform', `translate(${TIMELINE_CHART_DIMENSIONS.WIDTH}, 0)`)
                     .call(yAxisFrequency);
    
}

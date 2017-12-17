'use strict';

/*
    Constants
*/

const MEAN_MASS_GRAPH =
    TIMELINE.append('g')
              .attr('transform', `translate(${TIMELINE_MARGINS.LEFT}, ${TIMELINE_MARGINS.TOP +
                    TIMELINE_CHART_DIMENSIONS.HEIGHT + TIMELINE_MARGINS.MIDDLE})`);

/*
    Variables
*/

let yMeanMass = d3.scaleLog()
                     .range([0, TIMELINE_CHART_DIMENSIONS.HEIGHT]);

let yAxisMeanMass = d3.axisRight(yMeanMass)
                         .ticks(4, ',d');

/*
    Functions
*/

function setUpmeanMassTimeline(data, barWidth) {
    
    const HALF_BAR_WIDTH = barWidth / 2;
    
    yMeanMass.domain([0.5, d3.max(data, d => d.totalMass)]);
    
    MEAN_MASS_GRAPH.append('g')
                     .attr('id', 'timeline-mean-mass-bars-group')
                .selectAll('rect')
                     .data(data)
                    .enter()
                   .append('rect')
                     .attr('x'     , d => xTimeline(d.year) - HALF_BAR_WIDTH)
                     .attr('y'     , 0)
                     .attr('width' , barWidth)
                     .attr('class' , 'timeline-bars timeline-mean-mass-bars')
               .transition(TIMELINE_TRANSITION)
                     .attr('height', d => (d.totalMass === 0) ?
                            0 : TIMELINE_CHART_DIMENSIONS.HEIGHT - yMeanMass(d.totalMass));
    
    MEAN_MASS_GRAPH.append('g')
                     .attr('class', 'axes')
                     .attr('transform', `translate(${TIMELINE_CHART_DIMENSIONS.WIDTH}, 0)`)
                     .call(yAxisMeanMass);
    
}

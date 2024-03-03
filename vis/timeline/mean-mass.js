'use strict';

/*
	Constants
*/

const MEAN_MASS_CHART =
	TIMELINE.append('g')
			  .attr('transform', `translate(${TIMELINE_MARGINS.LEFT}, ${TIMELINE_MARGINS.TOP +
					TIMELINE_CHART_DIMENSIONS.HEIGHT + TIMELINE_MARGINS.MIDDLE})`);

const TIMELINE_MEAN_MASS_BARS_GROUP =
	MEAN_MASS_CHART.append('g')
					 .attr('id', 'timeline-mean-mass-bars-group');

const TIMELINE_MEAN_MASS_Y_AXIS_GROUP =
	MEAN_MASS_CHART.append('g')
					 .attr('class', 'axes')
					 .attr('transform', `translate(${TIMELINE_CHART_DIMENSIONS.WIDTH}, 0)`);

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

function setUpMeanMassTimeline(data) {

	const HALF_BAR_WIDTH = timelineBarWidth / 2;

	TIMELINE_MEAN_MASS_BARS_GROUP
		.selectAll('rect')
			 .data(data)
			.enter()
		   .append('rect')
			 .attr('x'    , d => xTimeline(d.year) - HALF_BAR_WIDTH)
			 .attr('y'    , 0)
			 .attr('width', timelineBarWidth)
			 .attr('class', 'timeline-bars timeline-mean-mass-bars')
			   .on('click', timelineBarsClickListener);

}

function updateMeanMassTimeline(data) {

	yMeanMass.domain([0.2, d3.max(data, d => d.totalMass)]);

	TIMELINE_MEAN_MASS_BARS_GROUP
		.selectAll('rect')
			 .data(data)
	   .transition(TIMELINE_TRANSITION)
			 .attr('height', d => (d.totalMass === 0) ? 0 : yMeanMass(d.totalMass));

	TIMELINE_MEAN_MASS_Y_AXIS_GROUP.call(yAxisMeanMass);

}

'use strict';

/*
	Constants
*/

const FREQUENCY_CHART =
	TIMELINE.append('g')
			  .attr('transform', `translate(${TIMELINE_MARGINS.LEFT}, ${TIMELINE_MARGINS.TOP})`);

const TIMELINE_FREQUENCY_BARS_GROUP =
	FREQUENCY_CHART.append('g')
					 .attr('id', 'timeline-frequency-bars-group');

const TIMELINE_FREQUENCY_Y_AXIS_GROUP =
	FREQUENCY_CHART.append('g')
					 .attr('class'    , 'axes')
					 .attr('transform', `translate(${TIMELINE_CHART_DIMENSIONS.WIDTH}, 0)`);

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

function setUpFrequencyTimeline(data) {

	const HALF_BAR_WIDTH = timelineBarWidth / 2;

	TIMELINE_FREQUENCY_BARS_GROUP
		.selectAll('rect')
			 .data(data)
			.enter()
		   .append('rect')
			 .attr('x'    , d => xTimeline(d.year) - HALF_BAR_WIDTH)
			 .attr('y'    , TIMELINE_CHART_DIMENSIONS.HEIGHT)
			 .attr('width', timelineBarWidth)
			 .attr('class', 'timeline-bars timeline-frequency-bars')
			   .on('click', timelineBarsClickListener);

}

function updateFrequencyTimeline(data) {

	yFrequency.domain([0.5, d3.max(data, d => d.number)]);

	TIMELINE_FREQUENCY_BARS_GROUP
		.selectAll('rect')
			 .data(data)
	   .transition(TIMELINE_TRANSITION)
			 .attr('y', d => (d.number === 0) ?
				TIMELINE_CHART_DIMENSIONS.HEIGHT : yFrequency(d.number))
			 .attr('height', d => (d.number === 0) ?
				0 : TIMELINE_CHART_DIMENSIONS.HEIGHT - yFrequency(d.number));

	TIMELINE_FREQUENCY_Y_AXIS_GROUP.call(yAxisFrequency);

}

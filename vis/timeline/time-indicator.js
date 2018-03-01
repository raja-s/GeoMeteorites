'use strict';

/*
    Constants
*/

const TIME_HANDLE_HEIGHT = 37.5;
const TIME_HANDLE_WIDTH  = 50;
const TIME_HANDLE_PATH   = 'M40,0Q50,0,50,10L50,20Q50,25,45,27.5L25,37.5L5,27.5Q0,25,0,20L0,10Q0,0,10,0Z';

const TIME_INDICATOR_TRANSITION = d3.transition()
                                      .duration(SECOND / 4);

/*
    Variables
*/

let timeIndicator, timeText;
let presentFrequencyBar, presentMeanMassBar;

let timeIndicatorHeld = false;

/*
    Functions
*/

function appendTimeIndicator() {
    
    timeIndicator = TIMELINE.append('g')
                              .attr('id', 'time-indicator');
    
    timeIndicator.append('path')
                   .attr('id', 'time-handle')
                   .attr('d', TIME_HANDLE_PATH);
    
    timeText = timeIndicator.append('text')
                              .attr('x', TIME_HANDLE_WIDTH  / 2)
                              .attr('y', TIME_HANDLE_HEIGHT / 1.875);
    
    // Add event listener needed for dragging the indicator around
    timeIndicator.on('mousedown', event => {
        timeIndicatorHeld = true;
    });
    
}

function updateTimeIndicator() {
    
    const TIME_DIFF = time - timelineStart();
    
    if (presentFrequencyBar !== undefined) {
        d3.select(presentFrequencyBar)
            .attr('data-present', null);
        d3.select(presentMeanMassBar)
            .attr('data-present', null);
    }
    
    presentFrequencyBar = document.getElementById('timeline-frequency-bars-group').children[TIME_DIFF];
    presentMeanMassBar  = document.getElementById('timeline-mean-mass-bars-group').children[TIME_DIFF];
    
    d3.select(presentFrequencyBar)
        .attr('data-present', '');
    d3.select(presentMeanMassBar)
        .attr('data-present', '');
    
    const X = TIMELINE_MARGINS.LEFT + xTimeline(new Date(time, 0)) - (TIME_HANDLE_WIDTH / 2);
    const Y = TIMELINE_MARGINS.TOP  + TIMELINE_CHART_DIMENSIONS.HEIGHT -
        presentFrequencyBar.height.baseVal.value - TIME_HANDLE_HEIGHT - 2;
    
    timeIndicator.transition(TIME_INDICATOR_TRANSITION)
        .attr('transform', `translate(${X}, ${Y})`);
    
    // Update the year inside the indicator
    timeText.html(time);
    
}

/*
    Event Listeners
*/

window.addEventListener('mouseup', event => {
    
    if (timeIndicatorHeld) {
        
        const LEFT_LIMIT  = ((window.innerWidth - TIMELINE_DIMENSIONS.WIDTH) / 2)
            + TIMELINE_MARGINS.LEFT;
        const RIGHT_LIMIT = LEFT_LIMIT + TIMELINE_CHART_DIMENSIONS.WIDTH;
        
        const X = clamp(event.clientX, LEFT_LIMIT, RIGHT_LIMIT) - LEFT_LIMIT;
        
        time = clamp(xTimeline.invert(X).getFullYear(), timelineStart(), timelineEnd());
        
        updateTimeIndicator();
        
        clearMainAnimationTimeouts();
        explodeMeteoritesInMidAir();
        
        if (playPauseState) {
            resumeMainAnimation();
        }
        
    }
    
    timeIndicatorHeld = false;
    
});

window.addEventListener('mousemove', event => {
    
    if (timeIndicatorHeld) {
        
        pauseMainAnimation();
        
        const LEFT_LIMIT  = ((window.innerWidth - TIMELINE_DIMENSIONS.WIDTH) / 2)
            + TIMELINE_MARGINS.LEFT;
        const RIGHT_LIMIT = LEFT_LIMIT + TIMELINE_CHART_DIMENSIONS.WIDTH;
        
        const X = clamp(event.clientX, LEFT_LIMIT, RIGHT_LIMIT) - LEFT_LIMIT;
        
        const YEAR = clamp(xTimeline.invert(X).getFullYear(), timelineStart(), timelineEnd())
        
        const BAR = document.getElementById('timeline-frequency-bars-group')
            .children[YEAR - timelineStart()];
        const Y = TIMELINE_MARGINS.TOP  + TIMELINE_CHART_DIMENSIONS.HEIGHT -
            BAR.height.baseVal.value - TIME_HANDLE_HEIGHT - 2;
        
        timeIndicator.attr('transform',
            `translate(${X + TIMELINE_MARGINS.LEFT - (TIME_HANDLE_WIDTH / 2)}, ${Y})`);
        
        // Update the year inside the indicator
        timeText.html(YEAR);
        
    }
    
});

'use strict';

/*
    Variables
*/

let mainAnimationPlaying = false;

let mainAnimationTimeout = -1;

const YEAR_SCHEDULE = {};

/*
    Functions
*/

function scheduleCallback(years, callback) {
    
    years.forEach(year => {
        
        if (!(year in YEAR_SCHEDULE)) {
            YEAR_SCHEDULE[year] = [];
        }
        
        YEAR_SCHEDULE[year].push(callback);
        
    });
    
}

function incrementTime() {
    
    // Increment time
    time++;
    
    // Check if there are callbacks
    // scheduled for this year
    if (time in YEAR_SCHEDULE) {
        
        // Run the scheduled callbacks
        YEAR_SCHEDULE[time].forEach(callback => callback(time));
        
        // Remove the callbacks
        delete YEAR_SCHEDULE[time];
        
    }
    
}

function startMainAnimation() {
    
    function iteration() {
        
        if (time >= BRUSH_SELECTION.end) {
            return;
        }
        
        updateTimeIndicator();
        
        const FILTERED_DATA = meteoriteData.filter(entry => entry.year.getFullYear() === time);
        
        if (FILTERED_DATA.length > 0) {
            
            speed = 2 / FILTERED_DATA.length;
            
            FILTERED_DATA.forEach((meteorite, i) => {
                setTimeout(() => dropMeteorite(meteorite.reclong, meteorite.reclat, meteorite.mass),
                    i * 500);
            });
            
        } else {
            
            speed = 1;
            
        }
        
        if (mainAnimationPlaying) {
            mainAnimationTimeout = setTimeout(() => {
                incrementTime();
                iteration();
            }, 1000 / speed);
        }
        
    }
    
    time = BRUSH_SELECTION.start;
    
    resumeGlobeAnimation();
    resumeMainAnimation();
    
    iteration();
    
}

function pauseMainAnimation() {
    mainAnimationPlaying = false;
    clearTimeout(mainAnimationTimeout);
}

function resumeMainAnimation() {
    mainAnimationPlaying = true;
}

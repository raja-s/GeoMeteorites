'use strict';

/*
    Variables
*/

let time;

// Animation speed in years/second
let speed = 1;

let mainAnimationPlaying = false;

let mainAnimationTimeout = -1;

const YEAR_CALLBACK_SCHEDULE = {};
const YEAR_MINIMUM_DURATIONS = {};

/*
    Functions
*/

function scheduleCallback(years, callback) {
    
    years.forEach(year => {
        
        if (!(year in YEAR_CALLBACK_SCHEDULE)) {
            YEAR_CALLBACK_SCHEDULE[year] = [];
        }
        
        YEAR_CALLBACK_SCHEDULE[year].push(callback);
        
    });
    
}

function setMinimumDuration(years, duration) {
    
    if (duration > 0) {
        
        years.forEach(year => {
            
            YEAR_MINIMUM_DURATIONS[year] = (year in YEAR_MINIMUM_DURATIONS) ?
                Math.max(YEAR_MINIMUM_DURATIONS[year], duration) : duration;
            
        });
        
    }
    
}

function incrementTime() {
    
    // Increment time
    time++;
    
    // Check if there are callbacks
    // scheduled for this year
    if (time in YEAR_CALLBACK_SCHEDULE) {
        
        // Run the scheduled callbacks
        YEAR_CALLBACK_SCHEDULE[time].forEach(callback => callback(time));
        
        // Remove the callbacks
        delete YEAR_CALLBACK_SCHEDULE[time];
        
    }
    
}

function mainAnimation() {
    
    function dropMeteorites() {
        
        if (time >= BRUSH_SELECTION.end) {
            return;
        }
        
        updateTimeIndicator();
        
        const FILTERED_DATA = meteoriteData.filter(entry => entry.year.getFullYear() === time);
        const COUNT = FILTERED_DATA.length;
        
        const LOG = Math.log10(COUNT);
        
        let totalDuration;
        
        if (COUNT === 0) {
            
            totalDuration = SECOND;
            
        // } else if (COUNT < 16) {
            
        //     totalDuration = FALL_DURATION;
            
        } else {
            
            const LAUNCH_DURATION = (LOG ** 3) * SECOND;
            
            const SQRT             = Math.sqrt(COUNT);
            const GROUP_COUNT      = Math.round(SQRT);
            const WHOLE_GROUP_SIZE = Math.ceil(SQRT);
            
            const DELTA_TIME = (GROUP_COUNT === 1) ? 0 : LAUNCH_DURATION / (GROUP_COUNT - 1);
            
            totalDuration = LAUNCH_DURATION + FALL_DURATION;
            
            let index = 0;
            for (let i = 0 ; i < GROUP_COUNT ; i++) {
                setTimeout(() => {
                    
                    FILTERED_DATA.slice(index, index + WHOLE_GROUP_SIZE).forEach((meteorite, i) =>
                        dropMeteorite(meteorite.long, meteorite.lat, meteorite.mass));
                    
                    index += WHOLE_GROUP_SIZE;
                    
                }, DELTA_TIME * i);
            }
            
            /*let dur = 0;
            FILTERED_DATA.forEach((meteorite, i) => {
                
                setTimeout(() => {
                    dropMeteorite(meteorite.long, meteorite.lat, meteorite.mass);
                }, dur);
                
                dur += 50;
                dur %= LAUNCH_DURATION;
                
            });*/
            
            /*FILTERED_DATA.forEach((meteorite, i) => {
                setTimeout(() => dropMeteorite(meteorite.long, meteorite.lat, meteorite.mass),
                    i * 500);
            });*/
            
        }
        
        if ((time in YEAR_MINIMUM_DURATIONS) && (YEAR_MINIMUM_DURATIONS[time] > totalDuration)) {
            totalDuration = YEAR_MINIMUM_DURATIONS[time];
        }
        delete YEAR_MINIMUM_DURATIONS[time];
        
        speed = SECOND / totalDuration;
        
    }
    
    function iteration(nextIteration) {
        
        if (mainAnimationPlaying) {
            
            mainAnimationTimeout = setTimeout(() => {
                
                // Increment the time
                incrementTime();
                
                // Drop the meteorites for this iteration
                dropMeteorites();
                
                // Do another iteration in `SECOND / speed` milliseconds
                iteration(SECOND / speed);
                
            }, nextIteration);
            
        }
        
    }
    
    resumeGlobeAnimation();
    
    mainAnimationPlaying = true;
    
    iteration(0);
    
}

function resumeMainAnimation() {
    
    if (!mainAnimationPlaying) {
        mainAnimation();
    }
    
}

function startMainAnimation() {
    
    time = BRUSH_SELECTION.start;
    
    mainAnimation();
    
}

function pauseMainAnimation() {
    
    mainAnimationPlaying = false;
    
    clearTimeout(mainAnimationTimeout);
    
}

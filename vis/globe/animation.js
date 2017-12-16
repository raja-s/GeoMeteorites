'use strict';

/*
    Variables
*/

let time;

// Animation speed in years/second
let speed = 1;

let mainAnimationPlaying = false;

let mainAnimationTimeout = -1;

let yearCallbackSchedule = {};
let yearMinimumDurations = {};

/*
    Functions
*/

function scheduleCallback(years, callback) {
    
    years.forEach(year => {
        
        if (!(year in yearCallbackSchedule)) {
            yearCallbackSchedule[year] = [];
        }
        
        yearCallbackSchedule[year].push(callback);
        
    });
    
}

function clearSchedule() {
    yearCallbackSchedule = {};
}

function setMinimumDuration(years, duration) {
    
    if (duration > 0) {
        
        years.forEach(year => {
            
            yearMinimumDurations[year] = (year in yearMinimumDurations) ?
                Math.max(yearMinimumDurations[year], duration) : duration;
            
        });
        
    }
    
}

function clearMinimumDurations() {
    yearMinimumDurations = {};
}

function incrementTime() {
    
    // Increment time
    time++;
    
    // Check if there are callbacks
    // scheduled for this year
    if (time in yearCallbackSchedule) {
        
        // Run the scheduled callbacks
        yearCallbackSchedule[time].forEach(callback => callback(time));
        
        // Remove the callbacks
        delete yearCallbackSchedule[time];
        
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
        
        if ((time in yearMinimumDurations) && (yearMinimumDurations[time] > totalDuration)) {
            totalDuration = yearMinimumDurations[time];
        }
        delete yearMinimumDurations[time];
        
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
    
    clearSchedule();
    
    const dates = Array.from(messageMap.keys());
    scheduleCallback(dates, showMessage);
    setMinimumDuration(dates, 5000);
    
    mainAnimation();
    
}

function pauseMainAnimation() {
    
    mainAnimationPlaying = false;
    
    clearTimeout(mainAnimationTimeout);
    
    pauseGlobeAnimation();
    
}

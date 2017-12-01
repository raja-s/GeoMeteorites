'use strict';

/*
    Variables
*/

let mainAnimationPlaying = false;

let mainAnimationTimeout = -1;

/*
    Functions
*/

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
                time++;
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

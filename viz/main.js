
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
        
        const FILTERED_DATA = meteoriteData.filter(entry => entry.year.getFullYear() === time);
        
        console.log(time);
        
        FILTERED_DATA.forEach(meteorite => {
            dropMeteorite(meteorite.reclong, meteorite.reclat, meteorite.mass);
        });
        
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

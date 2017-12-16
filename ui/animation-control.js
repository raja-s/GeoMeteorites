'use strict';

/*
    Constants
*/

const ANIMATION_CONTROL = document.getElementById('animation-control');
const PLAY_BUTTON       = ANIMATION_CONTROL.children[0];
const PAUSE_BUTTON      = ANIMATION_CONTROL.children[1];

let playPauseState = true;

/*
    Functions
*/

ANIMATION_CONTROL.addEventListener('click', event => {
    
    if (playPauseState) {
        
        pauseMainAnimation();
        
        PLAY_BUTTON.style.setProperty('display', 'inline');
        PAUSE_BUTTON.style.setProperty('display', 'none');
        
    } else {
        
        resumeMainAnimation();
        
        PLAY_BUTTON.style.setProperty('display', 'none');
        PAUSE_BUTTON.style.setProperty('display', 'inline');
        
    }
    
    playPauseState = !playPauseState;
    
});

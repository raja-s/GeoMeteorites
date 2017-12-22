'use strict';

/*
    Constants
*/

const PLAY_PAUSE_CONTROL = document.getElementById('play-pause-control');
const RESTART_CONTROL    = document.getElementById('restart-control');
const PLAY_BUTTON        = PLAY_PAUSE_CONTROL.children[0];
const PAUSE_BUTTON       = PLAY_PAUSE_CONTROL.children[1];

// The state of the play/pause button
// true  -> Visualization is playing
// false -> Visualization is paused
let playPauseState = true;

/*
    Functions
*/

function play() {
    
    resumeMainAnimation();
    
    PLAY_BUTTON.style.setProperty('display', 'none');
    PAUSE_BUTTON.style.setProperty('display', 'inline');
    
    playPauseState = true;
    
}

function pause() {
    
    pauseMainAnimation();
    
    PLAY_BUTTON.style.setProperty('display', 'inline');
    PAUSE_BUTTON.style.setProperty('display', 'none');
    
    playPauseState = false;
    
}

/*
    Event Listeners
*/

PLAY_PAUSE_CONTROL.addEventListener('click', event => {
    
    playPauseState ? pause() : play();
    
});

RESTART_CONTROL.addEventListener('click', event => {
    
    clearMainAnimationTimeouts();
    explodeMeteoritesInMidAir();
    
    startMainAnimation();
    
    play();
    
});

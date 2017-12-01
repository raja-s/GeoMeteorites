'use strict';

/*
    Constants
*/

const MAP_MODE_SELECT = document.getElementById('mapMode');

const MAP_MODES = Object.freeze({
    THREE_D  : '3d',
    MERCATOR : 'mercator'
});

const START_ANIMATION_BUTTON = document.getElementById('startAnimationButton');

/*
    Functions
*/

function getMapMode() {
    return MAP_MODE_SELECT.value;
}

function setUpTypeAheadField() {
    const COUNTRY_LIST = countries.map(data => data.country);
    
    $('input#country-field').typeahead({
        source : (query, process) => process(COUNTRY_LIST)
    });
}

/*
    Event Listeners
*/

MAP_MODE_SELECT.addEventListener('change', event => {
    
    switch (getMapMode()) {
        
        case MAP_MODES.MERCATOR:
            switchVizToMercator();
            break;
        
        case MAP_MODES.THREE_D:
            switchVizTo3d();
            break;
        
    }
    
});

START_ANIMATION_BUTTON.addEventListener('click', event => {
    
    pauseMainAnimation();
    
    startMainAnimation();
    // setTimeout(startMainAnimation, 1000);
    
});

/*
    Execution
*/

for (let mode in MAP_MODES) {
    const OPTION = document.createElement('OPTION');
    
    OPTION.value = MAP_MODES[mode];
    OPTION.innerHTML = MAP_MODES[mode];
    
    MAP_MODE_SELECT.appendChild(OPTION);
}


/*
    Constants
*/

const MAP_MODE_SELECT = document.getElementById('mapMode');

const MAP_MODES = Object.freeze({
    THREE_D  : '3d',
    MERCATOR : 'mercator'
});

/*
    Functions
*/

function getMapMode() {
    return MAP_MODE_SELECT.value;
}

/*
    Execution
*/

for (let mode in MAP_MODES) {
    const OPTION = document.createElement('OPTION');
    
    OPTION.value = MAP_MODES[mode];
    OPTION.innerHTML = MAP_MODES[mode];
    
    MAP_MODE_SELECT.appendChild(OPTION);
}

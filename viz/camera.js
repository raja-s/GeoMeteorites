
/*
    Imports
*/

import { CUBIC_BEZIER_EASE_VALUES } from '../constants.js';
import { sphericalToCartesian } from '../utils.js';
import { CAMERA, cameraDistance } from './globe.js';

/*
    Code
*/

// TODO: Rename this function
function updateCameraZ() {
    let { x , y , z } = sphericalToCartesian(cameraDistance,
        CAMERA.rotation.y, CAMERA.rotation.x + (Math.PI / 2));
    CAMERA.position.set(x, y, z);
}

// TODO: Improve performance of this function
function moveCameraTo(long, lat, duration = 0) {
    
    // TODO: Check if long and lat are in bounds
    const PHI   = long * Math.PI / 180;
    const THETA = lat  * Math.PI / 180;
    
    if (duration === 0) {
        CAMERA.rotation.y = PHI;
        CAMERA.rotation.x = THETA;
        
        let { x , y , z } = sphericalToCartesian(cameraDistance, PHI, THETA + (Math.PI / 2));
        
        CAMERA.position.set(x, y, z);
        
        return;
    }
    
    const DIFF_PHI   = PHI   - CAMERA.rotation.y;
    const DIFF_THETA = THETA - CAMERA.rotation.x;
    
    const PHIS   = [];
    const THETAS = [];
    
    CUBIC_BEZIER_EASE_VALUES.forEach(value => {
        PHIS.push(CAMERA.rotation.y + value * DIFF_PHI);
        THETAS.push(CAMERA.rotation.x + value * DIFF_THETA);
    });
    
    function deltaT(i) {
        CAMERA.rotation.y = PHIS[i];
        CAMERA.rotation.x = THETAS[i];
        
        let { x , y , z } = sphericalToCartesian(cameraDistance, PHIS[i], THETAS[i] + (Math.PI / 2));
        
        CAMERA.position.set(x, y, z);
    }
    
    for (let i = 0 ; i < CUBIC_BEZIER_EASE_VALUES.length ; i++) {
        setTimeout(() => deltaT(i), duration * i / 100);
    }
    
}

window.moveCameraTo = moveCameraTo;

/*
    Exports
*/

export {
    updateCameraZ,
    moveCameraTo
};
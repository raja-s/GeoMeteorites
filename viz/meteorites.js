
/*
    Imports
*/

import { sphericalToCartesian } from '../utils.js';
import { RADIUS, addToScene, removeFromScene } from './globe.js';

/*
    Code
*/

const FALL_DURATION = 2400;

const METEORITES = [];

const METEORITE_GEOMETRY = new THREE.SphereGeometry(1, 7, 7);
const METEORITE_MATERIAL = new THREE.MeshBasicMaterial({ color : 0xffad5b });

function dropMeteorite(long, lat, mass) {
    
    let meteorite = new THREE.Mesh(METEORITE_GEOMETRY, METEORITE_MATERIAL);
    addToScene(meteorite);
    
    // let meteoriteLight = new THREE.PointLight(0xffad5b, 2, 1000);
    // addToScene(meteoriteLight);
    
    // TODO: Check long and lat
    const PHI   = THREE.Math.degToRad(long);
    const THETA = THREE.Math.degToRad(lat);
    const R     = RADIUS;
    
    const RANDOM_RADIUS = Math.PI / 3;
    
    const START_PHI   = PHI    + (Math.random() - 0.5) * RANDOM_RADIUS;
    const START_THETA = THETA  + (Math.random() - 0.5) * RANDOM_RADIUS;
    const START_R     = RADIUS + 200;
    
    let { x , y , z } = sphericalToCartesian(START_R, START_PHI, START_THETA + (Math.PI / 2));
    meteorite.position.set(x, y, z);
    // meteoriteLight.position.set(x, y, z);
    
    METEORITES.push(meteorite);
    
    const STEP_TIME  = 16;
    const STEP_PHI   = (PHI   - START_PHI)   * STEP_TIME / FALL_DURATION;
    const STEP_THETA = (THETA - START_THETA) * STEP_TIME / FALL_DURATION;
    const STEP_R     = (R     - START_R)     * STEP_TIME / FALL_DURATION;
    
    let j = 0;
    
    function delta() {
        let { x , y , z } = sphericalToCartesian(START_R + j * STEP_R,
            START_PHI + j * STEP_PHI, START_THETA + j * STEP_THETA + (Math.PI / 2));
        meteorite.position.set(x, y, z);
        j++;
    }
    
    for (let i = 0 ; i < FALL_DURATION ; i += STEP_TIME) {
        setTimeout(delta, i);
    }
    
    setTimeout(() => {
        removeFromScene(meteorite);
        meteorite.geometry.dispose();
        meteorite.material.dispose();
    }, FALL_DURATION);
    
}

function test() {
    for (let i = 0 ; i < 1000 ; i++) {
        let long = (Math.random() - 0.5) * 360;
        let lat = (Math.random() - 0.5) * 180;
        setTimeout(() => dropMeteorite(long, lat, 0), i * 100);
    }
}

window.test = test;
window.dropMeteorite = dropMeteorite;

/*
    Exports
*/

export {
    
    // Functions
    dropMeteorite
    
};

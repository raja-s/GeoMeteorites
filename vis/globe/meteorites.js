'use strict';

/*
    Constants
*/

const FALL_DURATION      = 2400;
const EXPLOSION_DURATION = 600;

const STEP_TIME  = 30;

const MAX_RANDOM_RADIUS = 2 * Math.PI / 3;

const METEORITE_GEOMETRY = new THREE.SphereGeometry(1, 7, 7);

const MATERIAL = new THREE.MeshLambertMaterial({
    color       : 0xffad5b,
    transparent : true
});

const EXPLOSION_GEOMETRY = new THREE.SphereGeometry(0, 16, 16);

/*
    Variables
*/

const METEORITES = [];
const EXPLOSIONS = [];

/*
    Functions
*/

/*

// Meteorite entry structure

{
    meteorite : THREE.Mesh,
    //light     : THREE.PointLight,
    ttl       : Number,
    mass      : Number,
    r         : Number,
    phi       : Number,
    theta     : Number,
    stepR     : Number,
    stepPhi   : Number,
    stepTheta : Number
}

// Explosion entry structure

{
    explosion   : THREE.Mesh,
    meteorite   : THREE.Mesh,
    ttl         : Number,
    stepSize    : Number,
    stepOpacity : Number
}

*/

function launchMeteorite(long, lat, mass) {
    
    const METEORITE = new THREE.Mesh(METEORITE_GEOMETRY, MATERIAL.clone());
    addToScene(METEORITE);
    
    // DANGER: Do you want to have your browser crash? Because
    //         that's how you have your browser crash!
    // const LIGHT = new THREE.PointLight(0xffad5b, 3, 150, 2);
    // addToScene(LIGHT);
    
    const TARGET_PHI   = THREE.Math.degToRad(long);
    const TARGET_THETA = THREE.Math.degToRad(lat);
    
    const START_R     = GLOBE_RADIUS + 200;
    const START_PHI   = TARGET_PHI   + (Math.random() - 0.5) * MAX_RANDOM_RADIUS;
    const START_THETA = TARGET_THETA + (Math.random() - 0.5) * MAX_RANDOM_RADIUS;
    
    let { x , y , z } = sphericalToCartesian(START_R, START_PHI, START_THETA);
    
    METEORITE.position.set();
    
    const TTL = parseInt(60 * FALL_DURATION / SECOND);
    
    METEORITES.push({
        meteorite : METEORITE,
        // light     : LIGHT,
        ttl       : TTL,
        mass      : mass,
        r         : START_R,
        phi       : START_PHI,
        theta     : START_THETA,
        stepR     : (GLOBE_RADIUS - START_R)     / TTL,
        stepPhi   : (TARGET_PHI   - START_PHI)   / TTL,
        stepTheta : (TARGET_THETA - START_THETA) / TTL
    });
    
}

function explodeMeteorite(i) {
    
    const ENTRY = METEORITES.splice(i, 1)[0];
    
    const EXPLOSION = new THREE.Mesh(EXPLOSION_GEOMETRY, MATERIAL.clone());
    addToScene(EXPLOSION);
    
    EXPLOSION.position.copy(ENTRY.meteorite.position);
    
    const TTL = parseInt(60 * EXPLOSION_DURATION / SECOND);
    
    EXPLOSIONS.push({
        explosion   : EXPLOSION,
        meteorite   : ENTRY.meteorite,
        ttl         : TTL,
        stepSize    : Math.log(ENTRY.mass) / TTL,
        stepOpacity : 1 / TTL
    });
    
}

function explodeMeteoritesInMidAir() {
    
    for (let i = 0 ; i < METEORITES.length ; i++) {
        explodeMeteorite(i);
    }
    
}

function updateMeteorites() {
    
    const REMOVABLES = [];
    
    for (let i = 0 ; i < METEORITES.length ; ) {
        
        const ENTRY = METEORITES[i];
        
        if (ENTRY.ttl === 0) {
            
            explodeMeteorite(i);
            
            // removeFromScene(ENTRY.light);
            
        } else {
            
            ENTRY.r     += ENTRY.stepR;
            ENTRY.phi   += ENTRY.stepPhi;
            ENTRY.theta += ENTRY.stepTheta;
            
            let { x , y , z } = sphericalToCartesian(ENTRY.r, ENTRY.phi, ENTRY.theta);
            ENTRY.meteorite.position.set(x, y, z);
            // ENTRY.light.position.set(x, y, z);
            
            ENTRY.ttl--;
            i++;
            
        }
        
    }
    
    for (let i = 0 ; i < EXPLOSIONS.length ; ) {
        
        const ENTRY = EXPLOSIONS[i];
        
        if (ENTRY.ttl === 0) {
            
            EXPLOSIONS.splice(i, 1);
            
            REMOVABLES.push(ENTRY.meteorite, ENTRY.explosion);
            
        } else {
            
            ENTRY.explosion.scale.addScalar(ENTRY.stepSize);
            ENTRY.explosion.material.opacity -= ENTRY.stepOpacity;
            ENTRY.meteorite.material.opacity -= ENTRY.stepOpacity;
            
            ENTRY.ttl--;
            i++;
            
        }
        
    }
    
    removeBatchFromScene(REMOVABLES);
    
    REMOVABLES.forEach(object => {
        object.geometry.dispose();
        object.material.dispose();
    });
    
}

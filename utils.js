'use strict';

function modulo(a, n) {
    return ((a % n) + n) % n;
}

function clamp(value, min, max) {
    return (value <= min) ? min : (value >= max) ? max : value;
}

function sphericalToCartesian(r, phi, theta) {
    let COS_THETA = Math.cos(theta);
    return {
        x : r * COS_THETA * Math.sin(phi),
        y : r * Math.sin(theta),
        z : r * COS_THETA * Math.cos(phi)
    };
}

function cartesianToSpherical(x, y, z) {
    const R    = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    const R_XZ = Math.sqrt(R ** 2 - y ** 2);
    return {
        r     : R,
        phi   : Math.acos(z / R_XZ) * Math.sign(x),
        theta : Math.asin(y / R)
    };
}

function sphericalToGeographical(phi, theta) {
    return {
        long : phi   * 180 / Math.PI,
        lat  : theta * 180 / Math.PI
    };
}

/**
 * Removes all the children of an HTML element.
 */
function removeChildren(element) {
    // Keep removing the first child of the
    // element until there are no more children
    while (element.hasChildNodes()) {   
        element.removeChild(element.firstChild);
    }
}

function limitedIntegerTicks(max, limit) {
    
    const RATIO = max / (limit - 1);
    
    const TICK_STEP = (Math.floor(RATIO) === RATIO) ? RATIO + 1 : Math.ceil(RATIO);
    
    const MAX = TICK_STEP * limit;
    
    const TICKS = [];
    
    for (let tick = 0 ; tick < MAX ; tick += TICK_STEP) {
        TICKS.push(tick);
        if (tick > max) {
            break;
        }
    }
    
    return TICKS;
    
}

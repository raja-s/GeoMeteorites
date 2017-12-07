'use strict';

function modulo(a, n) {
    return ((a % n) + n) % n;
}

function clamp(value, min, max) {
    return (value <= min) ? min : (value >= max) ? max : value;
}

function sphericalToCartesian(r, phi, theta) {
    let cosTheta = Math.cos(theta);
    return {
        x : r * cosTheta * Math.sin(phi),
        y : r * Math.sin(theta),
        z : r * cosTheta * Math.cos(phi)
    };
}

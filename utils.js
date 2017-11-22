
function modulo(a, n) {
    return ((a % n) + n) % n;
}

function clamp(value, min, max) {
    return (value <= min) ? min : (value >= max) ? max : value;
}

function sphericalToCartesian(r, phi, theta) {
    let sinTheta = Math.sin(theta);
    return {
        x : r * sinTheta * Math.sin(phi),
        y : r * Math.cos(theta),
        z : r * sinTheta * Math.cos(phi)
    };
}

/*
    Exports
*/

export {
    modulo,
    clamp,
    sphericalToCartesian
};

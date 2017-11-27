
/*
    Imports
*/

import { updateCameraZ, moveCameraTo } from './camera.js';
import { modulo, clamp } from '../utils.js';

/*
    Constants & Variables
*/

// Canvas dimensions
let height = window.innerHeight * 0.8;
let width  = window.innerWidth;

const RADIUS = 60;

// Scene
const SCENE = new THREE.Scene();

// Light
const AMBIANT_LIGHT = new THREE.AmbientLight(0xffffff, 1);

// Camera
const FOV = 35;

const CAMERA = new THREE.PerspectiveCamera(FOV, width / height, 1, 1000);

const CAMERA_BOUNDS = Object.freeze({
    MIN : RADIUS + 20,
    MAX : 500
});

// Renderer
const RENDERER = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

let cameraDistance = 240;

let graticule, mesh;

let animateGlobe = true;

/*
    Code
*/

SCENE.add(AMBIANT_LIGHT);

CAMERA.rotation.order = 'YXZ';
CAMERA.translateZ(cameraDistance);

RENDERER.setPixelRatio(window.devicePixelRatio);
RENDERER.setSize(width, height);
document.getElementById("mapArea").appendChild(RENDERER.domElement);

let sphere = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 32, 32),
    new THREE.MeshLambertMaterial({ color : 0xffffff }));
SCENE.add(sphere);

// let circle = new THREE.Mesh(new THREE.CircleGeometry(RADIUS, 32),
//     new THREE.MeshBasicMaterial({ color : 0x00ff00 }));
// SCENE.add(circle);

d3.json("https://unpkg.com/world-atlas@1/world/50m.json", function(error, topology) {
    
    if (error) {
        throw error;
    }
    
    graticule = wireframe(graticule10(), new THREE.LineBasicMaterial({color: 0xeeeeee}));
    mesh = wireframe(topojson.mesh(topology, topology.objects.countries),
        new THREE.LineBasicMaterial({color: 0xaaaaaa}));
    
    SCENE.add(graticule);
    SCENE.add(mesh);
    
    graticule.rotateX(- Math.PI / 2);
    mesh.rotateX(- Math.PI / 2);
    
    graticule.rotateZ(- Math.PI / 2);
    mesh.rotateZ(- Math.PI / 2);
    
    renderLoop();
    // d3.timer(t => render());
    
});

function vertex(point) {
    let lambda = point[0] * Math.PI / 180,
        phi = point[1] * Math.PI / 180,
        cosPhi = Math.cos(phi);
    return new THREE.Vector3(
        RADIUS * cosPhi * Math.cos(lambda),
        RADIUS * cosPhi * Math.sin(lambda),
        RADIUS * Math.sin(phi)
    );
}

function wireframe(multilinestring, material) {
    let geometry = new THREE.Geometry();
    multilinestring.coordinates.forEach(line =>
        d3.pairs(line.map(vertex), (a, b) => geometry.vertices.push(a, b)));
    return new THREE.LineSegments(geometry, material);
}

function graticule10() {
    let eps = 1e-6,
        x1 = 180, x0 = -x1, y1 = 80, y0 = -y1, dx = 10, dy = 10,
        X1 = 180, X0 = -X1, Y1 = 90, Y0 = -Y1, DX = 90, DY = 360,
        x = graticuleX(y0, y1, 2.5), y = graticuleY(x0, x1, 2.5),
        X = graticuleX(Y0, Y1, 2.5), Y = graticuleY(X0, X1, 2.5);
    
    function graticuleX(y0, y1, dy) {
        let yRange = d3.range(y0, y1 - eps, dy).concat(y1);
        return x => yRange.map(y => [ x , y ]);
    }
    
    function graticuleY(x0, x1, dx) {
        let xRange = d3.range(x0, x1 - eps, dx).concat(x1);
        return y => xRange.map(x => [ x , y ]);
    }
    
    return {
        type: "MultiLineString",
        coordinates: d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X)
            .concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y))
            .concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(x => Math.abs(x % DX) > eps).map(x))
            .concat(d3.range(Math.ceil(y0 / dy) * dy, y1 + eps, dy).filter(y => Math.abs(y % DY) > eps).map(y))
    };
}

function addToScene(object) {
    SCENE.add(object);
}

function removeFromScene(object) {
    // TODO: Check if need to do more work here
    SCENE.remove(object);
}

function render() {
    RENDERER.render(SCENE, CAMERA);
}

function renderLoop() {
    
    requestAnimationFrame(renderLoop);
    
    if (animateGlobe) {
        
        const LONG = modulo(THREE.Math.radToDeg(CAMERA.rotation.y) + 0.1 + 180, 360) - 180;
        const LAT = - Math.sin(THREE.Math.degToRad(LONG)) * 30;
        
        moveCameraTo(LONG, LAT);
        
    }
    
    render();
    
}

document.getElementById('mapArea').children[0].onmousewheel = event => {
    
    const SIGNED_SQRT = Math.sign(event.wheelDelta) * Math.sqrt(Math.abs(event.wheelDelta));
    
    cameraDistance -= SIGNED_SQRT;
    
    if (cameraDistance < CAMERA_BOUNDS.MIN) {
        cameraDistance = CAMERA_BOUNDS.MIN;
    } else if (cameraDistance > CAMERA_BOUNDS.MAX) {
        cameraDistance = CAMERA_BOUNDS.MAX;
    }
    updateCameraZ(cameraDistance);
    
    render();
    
};

document.getElementById('mapArea').children[0].onmousemove = event => {
    
    if (event.buttons === 1) {
        
        animateGlobe = false;
        
        const DELTA_PHI   = - event.movementX;
        const DELTA_THETA = - event.movementY;
        
        const FACTOR = ((cameraDistance / CAMERA_BOUNDS.MAX) ** 2) * 0.5;
        
        const LONG = modulo(THREE.Math.radToDeg(CAMERA.rotation.y) + DELTA_PHI * FACTOR + 180, 360) - 180;
        const LAT  = clamp(THREE.Math.radToDeg(CAMERA.rotation.x) + DELTA_THETA * FACTOR, -90, 90);
        
        moveCameraTo(LONG, LAT);
        
    }
    
};

window.addEventListener('resize', event => {
    
    height = window.innerHeight * 0.8;
    width  = window.innerWidth;
    
    RENDERER.setSize(width, height);
    
    CAMERA.aspect = width / height;
    
    CAMERA.updateProjectionMatrix();
    
});

/*
    Exports
*/

export {
    
    // Constants
    CAMERA,
    RADIUS,
    
    // Variables
    cameraDistance,
    
    // Functions
    addToScene,
    removeFromScene
    
};

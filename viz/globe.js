'use strict';

/*
    Constants & Variables
*/

// Canvas dimensions
let globeCanvasHeight = window.innerHeight * 0.8;
let globeCanvasWidth  = window.innerWidth;

const GLOBE_RADIUS = 60;

// Scene
const SCENE = new THREE.Scene();

// Lights
// const AMBIANT_LIGHT = new THREE.AmbientLight(0x01021e, 1);
// const POINT_LIGHT   = new THREE.PointLight(0x01021e, 1, 1000, 2);
const AMBIANT_LIGHT = new THREE.AmbientLight(0xffffff, 1.2);
const POINT_LIGHT   = new THREE.PointLight(0xffffff, 0.5, 0, 2);
POINT_LIGHT.position.set(-40, 40, 300);

// Camera
const FOV = 35;

const CAMERA = new THREE.PerspectiveCamera(FOV, globeCanvasWidth / globeCanvasHeight, 1, 1000);

const CAMERA_BOUNDS = Object.freeze({
    MIN : GLOBE_RADIUS + 20,
    MAX : 500
});

// Renderer
const RENDERER = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

const TEXTURE_LOADER = new THREE.TextureLoader();

let cameraDistance = 240;

let mapGraticule, mapMesh;

let animateGlobe = true;
let allowGlobeNavigation = true;

/*
    Code
*/

SCENE.add(AMBIANT_LIGHT);
SCENE.add(POINT_LIGHT);

CAMERA.rotation.order = 'YXZ';
CAMERA.translateZ(cameraDistance);

RENDERER.setPixelRatio(window.devicePixelRatio);
RENDERER.setSize(globeCanvasWidth, globeCanvasHeight);
document.getElementById("mapArea").appendChild(RENDERER.domElement);

let sphere = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS, 128, 128),
    // new THREE.MeshLambertMaterial({ color : 0xffffff })
    new THREE.MeshPhongMaterial({
        // color       : 0xffffff,
        map         : TEXTURE_LOADER.load('res/texture-w8192-h4096-q100.jpg'),
        bumpMap     : TEXTURE_LOADER.load('res/elevation-w8192-h4096.jpg'),
        specularMap : TEXTURE_LOADER.load('res/specular-map-w2048-h1024.png'),
        bumpScale   : 0.5
    })
);
sphere.rotateY(- Math.PI / 2);
addToScene(sphere);

// let circle = new THREE.Mesh(new THREE.CircleGeometry(GLOBE_RADIUS, 32),
//     new THREE.MeshBasicMaterial({ color : 0x00ff00 }));
// SCENE.add(circle);


let topology;



d3.json("https://unpkg.com/world-atlas@1/world/50m.json", function(error, topology2) {

    if (error) {
        throw error;
    }
    
    topology = topology2;
    
    mapGraticule = wireframe3d(graticule10(), new THREE.LineBasicMaterial({
        color     : 0x11122e
    }));
    mapMesh = wireframe3d(
        topojson.mesh(topology2, topology2.objects.countries),
        new THREE.LineBasicMaterial({
            color     : 0x11122e
        })
    );

    // addToScene(mapMesh);
    addToScene(mapGraticule);

    mapGraticule.rotateX(- Math.PI / 2);
    mapMesh.rotateX(- Math.PI / 2);

    mapGraticule.rotateZ(- Math.PI / 2);
    mapMesh.rotateZ(- Math.PI / 2);
    
    renderLoop();

});

function coord2d(point) {
    return new THREE.Vector3(point[0], point[1], 0);
}

function coord3d(point) {
    let lambda = point[0] * Math.PI / 180;
    let phi    = point[1] * Math.PI / 180;
    let cosPhi = Math.cos(phi);
    return new THREE.Vector3(
        GLOBE_RADIUS * cosPhi * Math.cos(lambda),
        GLOBE_RADIUS * cosPhi * Math.sin(lambda),
        GLOBE_RADIUS * Math.sin(phi)
    );
}

function globe2map(lineSegments, multilinestring2d) {
    
    let geometry2d = new THREE.Geometry();
    
    multilinestring2d.coordinates.forEach(line =>
        d3.pairs(line.map(coord2d), (a, b) => geometry2d.vertices.push(a, b)));
    
    lineSegments.geometry.verticesNeedUpdate = true;
    
    for (let i = 0, j = 0 ; j < geometry2d.vertices.length ; j += 2) {
        
        let vertex     = lineSegments.geometry.vertices[i];
        let nextVertex = lineSegments.geometry.vertices[i + 1];
        
        let vertex2d     = geometry2d.vertices[j];
        let nextVertex2d = geometry2d.vertices[j + 1];
        
        let nextX = nextVertex2d.x;
        
        if ((vertex2d.x * nextVertex2d.x < 0) && (Math.abs(vertex2d.x)>90)) {
            lineSegments.geometry.vertices.splice(i, 2);
        } else {
            vertex.set(vertex2d.x, vertex2d.y, vertex2d.z);
            nextVertex.set(nextVertex2d.x, nextVertex2d.y, nextVertex2d.z);
            i += 2;
        }
        
    }
    
}

function wireframe3d(multilinestring, material) {
    let geometry = new THREE.Geometry();
    multilinestring.coordinates.forEach(line =>
        d3.pairs(line.map(coord3d), (a, b) => geometry.vertices.push(a, b)));
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
        type: 'MultiLineString',
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

function switchVizToMercator() {
    pauseGlobeAnimation();
    allowGlobeNavigation = false;
    
    moveCameraTo(0, 0, 1500).then(() => {
        removeFromScene(sphere);
        
        mapGraticule.rotation.set(0, 0, 0);
        mapMesh.rotation.set(0, 0, 0);
        
        globe2map(mapGraticule, graticule10());
        globe2map(mapMesh, topojson.mesh(topology, topology.objects.countries));
        
    });
}

function switchVizTo3d() {
    resumeMainAnimation();
    allowGlobeNavigation = true;
}

function pauseGlobeAnimation() {
    animateGlobe = false;
}

function resumeGlobeAnimation() {
    animateGlobe = true;
}

function render() {
    RENDERER.render(SCENE, CAMERA);
}

function renderLoop() {

    requestAnimationFrame(renderLoop);

    if (animateGlobe) {

        const LONG = modulo(THREE.Math.radToDeg(CAMERA.rotation.y) + 0.1 + 180, 360) - 180;
        const LAT  = Math.sin(THREE.Math.degToRad(LONG)) * 30;

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

    if ((event.buttons === 1) && allowGlobeNavigation) {

        pauseGlobeAnimation();

        const DELTA_PHI   = - event.movementX;
        const DELTA_THETA = event.movementY;

        const FACTOR = ((cameraDistance / CAMERA_BOUNDS.MAX) ** 2) * 0.5;

        const LONG = modulo(THREE.Math.radToDeg(CAMERA.rotation.y) + DELTA_PHI * FACTOR + 180, 360) - 180;
        const LAT  = clamp(THREE.Math.radToDeg(- CAMERA.rotation.x) + DELTA_THETA * FACTOR, -90, 90);
        
        moveCameraTo(LONG, LAT);

    }

};



window.addEventListener('resize', event => {

    globeCanvasHeight = window.innerHeight * 0.8;
    globeCanvasWidth  = window.innerWidth;

    RENDERER.setSize(globeCanvasWidth, globeCanvasHeight);

    CAMERA.aspect = globeCanvasWidth / globeCanvasHeight;

    CAMERA.updateProjectionMatrix();

});

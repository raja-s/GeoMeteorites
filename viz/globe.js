
/*
    Constants & Variables
*/

// Canvas dimensions
let globeCanvasHeight = window.innerHeight * 0.8;
let globeCanvasWidth  = window.innerWidth;

const GLOBE_RADIUS = 60;

// Scene
const SCENE = new THREE.Scene();

// Light
const AMBIANT_LIGHT = new THREE.AmbientLight(0xffffff, 1);

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

let cameraDistance = 240;

let graticule3d, mesh3d;

let animateGlobe = true;

/*
    Code
*/

SCENE.add(AMBIANT_LIGHT);

CAMERA.rotation.order = 'YXZ';
CAMERA.translateZ(cameraDistance);

RENDERER.setPixelRatio(window.devicePixelRatio);
RENDERER.setSize(globeCanvasWidth, globeCanvasHeight);
document.getElementById("mapArea").appendChild(RENDERER.domElement);

let sphere = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32),
    new THREE.MeshLambertMaterial({ color : 0xffffff }));
SCENE.add(sphere);

// let circle = new THREE.Mesh(new THREE.CircleGeometry(GLOBE_RADIUS, 32),
//     new THREE.MeshBasicMaterial({ color : 0x00ff00 }));
// SCENE.add(circle);






d3.json("https://unpkg.com/world-atlas@1/world/50m.json", function(error, topology) {

    if (error) {
        throw error;
    }

    // let modeMap = document.getElementById("mapMode");
    //
    // let mapSelected = modeMap.options[modeMap.selectedIndex].value;


    graticule3d = wireframe3d(graticule10(), new THREE.LineBasicMaterial({color: 0xeeeeee}));
    mesh3d = wireframe3d(topojson.mesh(topology, topology.objects.countries),
        new THREE.LineBasicMaterial({color: 0xaaaaaa}));

        addToScene(sphere);
        addToScene(mesh3d);
        addToScene(graticule3d);

    graticule3d.rotateX(- Math.PI / 2);
    mesh3d.rotateX(- Math.PI / 2);

    graticule3d.rotateZ(- Math.PI / 2);
    mesh3d.rotateZ(- Math.PI / 2);





// if (mapSelected=='mercator') {
//       removeFromScene(sphere);
//       globe2map(json2dto3d(topojson.mesh(topology, topology.objects.countries)),topojson.mesh(topology, topology.objects.countries),new THREE.LineBasicMaterial({color: 0xaaaaaa}));
//       renderLoop();
//
// }


      renderLoop();


});



function coord3d(point) {
    let lambda = point[0] * Math.PI / 180,
        phi = point[1] * Math.PI / 180,
        cosPhi = Math.cos(phi);
    return new THREE.Vector3(
        GLOBE_RADIUS * cosPhi * Math.cos(lambda),
        GLOBE_RADIUS * cosPhi * Math.sin(lambda),
        GLOBE_RADIUS * Math.sin(phi)
    );
}

function coord2d(point) {
    let lon = point[0]*Math.PI/180 ,
        lat = point[0]*Math.PI/180 ,
        z = 0;
        //z = 0;
    return new THREE.Vector3(
      lon,
      lat,
      z

    );
}

//
// function json2dto3d(multilinestring) {
//
//     multilinestring.coordinates.forEach(line =>d3.pairs(line.map(coord3d)));
//
//     return multilinestring;
//
// }




// function globe2map(multilinestring3d,multilinestring2d,material) {
//     let geometry2d = new THREE.Geometry();
//     let geometry3d = new THREE.Geometry();
//
//
//     multilinestring2d.coordinates.forEach(line =>
//         d3.pairs(line.map(coord2d), (a, b) => geometry2d.vertices.push(a, b)));
//
//     multilinestring3d.coordinates.forEach(line =>
//             d3.pairs(line.map(coord3d), (a, b) => geometry3d.vertices.push(a, b)));
//
//       for (let i=0;i<geometry3d.vertices.length;i++) {
//         geometry3d.vertices[i].x = geometry2d.vertices[i].x;
//         geometry3d.vertices[i].y = geometry2d.vertices[i].y;
//         geometry3d.vertices[i].z = geometry2d.vertices[i].z;
//         geometry3d.dynamic = true;
//         geometry3d.verticesNeedUpdate = true;
//
//         return new THREE.LineSegments(geometry3d,material);
//     }
//
//
//
// }




function wireframe3d(multilinestring, material) {
    let geometry = new THREE.Geometry();
    multilinestring.coordinates.forEach(line =>
        d3.pairs(line.map(coord3d), (a, b) => geometry.vertices.push(a, b)));
    return new THREE.LineSegments(geometry, material);
}

function wireframe2d(multilinestring, material) {
    let geometry = new THREE.Geometry();
    multilinestring.coordinates.forEach(line =>
        d3.pairs(line.map(coord2d), (a, b) => geometry.vertices.push(a, b)));
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

    globeCanvasHeight = window.innerHeight * 0.8;
    globeCanvasWidth  = window.innerWidth;

    RENDERER.setSize(globeCanvasWidth, globeCanvasHeight);

    CAMERA.aspect = globeCanvasWidth / globeCanvasHeight;

    CAMERA.updateProjectionMatrix();

});

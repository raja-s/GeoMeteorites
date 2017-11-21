
//Define height and width
let height = window.innerHeight*0.8,
width = window.innerWidth;


let radius = 228;

//New scene
let scene = new THREE.Scene();

//New camera
let camera = new THREE.PerspectiveCamera(35,width/height,1,2000);

//New renderer
let renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

let graticule,
mesh;


//Position of the camera
camera.position.z = 800;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
document.getElementById("mapArea").appendChild(renderer.domElement);


let sphere = new THREE.Mesh(new THREE.SphereGeometry(radius,32,32),
    new THREE.MeshBasicMaterial({color:0xffffff}));
scene.add(sphere);

// let circle = new THREE.Mesh(new THREE.CircleGeometry(radius, 32),
//     new THREE.MeshBasicMaterial({ color : 0x00ff00 }));
// scene.add(circle);

d3.json("https://unpkg.com/world-atlas@1/world/50m.json", function(error, topology) {
    
    if (error) {
        throw error;
    }
    
    graticule = wireframe(graticule10(), new THREE.LineBasicMaterial({color: 0xeeeeee}));
    mesh = wireframe(topojson.mesh(topology, topology.objects.countries),
        new THREE.LineBasicMaterial({color: 0xaaaaaa}));
    
    scene.add(graticule);
    scene.add(mesh);
    
    graticule.rotation.x = - Math.PI / 2;
    mesh.rotation.x      = - Math.PI / 2;
    
    graticule.rotation.z = - Math.PI / 2;
    mesh.rotation.z      = - Math.PI / 2;
    
    renderer.render(scene, camera);
    
});

// Converts a point [longitude, latitude] in degrees to a THREE.Vector3.
function vertex(point) {
    let lambda = point[0] * Math.PI / 180,
        phi = point[1] * Math.PI / 180,
        cosPhi = Math.cos(phi);
    return new THREE.Vector3(
        radius * cosPhi * Math.cos(lambda),
        radius * cosPhi * Math.sin(lambda),
        radius * Math.sin(phi)
    );
}

// Converts a GeoJSON MultiLineString in spherical coordinates to a THREE.LineSegments.
function wireframe(multilinestring, material) {
    let geometry = new THREE.Geometry();
    multilinestring.coordinates.forEach(line =>
        d3.pairs(line.map(vertex), (a, b) => geometry.vertices.push(a, b)));
    return new THREE.LineSegments(geometry, material);
}

// See https://github.com/d3/d3-geo/issues/95
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

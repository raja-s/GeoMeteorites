function getTimeRange() {
    const svg = document.getElementById("timeline");
    const totalWidth = svg.width.baseVal.value - 60; // margin
    const group = svg.children[1].children[2].children[1];
    const startX = group.x.baseVal.value;
    const rangeWidth = group.width.baseVal.value;
    const endX = startX + rangeWidth;
    const startYear = 860 + startX / totalWidth * (2016 - 860);
    const endYear = 860 + endX / totalWidth * (2016 - 860);
    return [parseInt(startYear), parseInt(endYear)];
}

document.getElementById("startButton").onclick = function() {

    let tmpMapMode = document.getElementById("mapMode")
    let mapMode = tmpMapMode.options[tmpMapMode.selectedIndex].value;
    let country = document.getElementById("country").value;
    let minMass = document.getElementById("minMass").value;
    let maxMass = document.getElementById("maxMass").value;
    let [startYear, endYear] = getTimeRange();
    let speedFactor = document.getElementById("speedFactor").value;

};


//----------------------------------Globe-----------------------------------------------


//Define height and width
let height2 = window.innerHeight*0.8,
width2 = window.innerWidth;


let radius = 228;

//New scene
let scene = new THREE.Scene();

//New camera
let camera = new THREE.PerspectiveCamera(35,width2/height2,1,1000);

//New renderer
let renderer = new THREE.WebGLRenderer({alpha: true});

let graticule,
mesh;


//Position of the camera
camera.position.z = 800;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width2, height2);
document.getElementById("mapArea").appendChild(renderer.domElement);


let sphere = new THREE.Mesh(new THREE.SphereGeometry(radius,32,32),new THREE.MeshBasicMaterial({color:0xffffff}));
scene.add(sphere);


d3.json("https://unpkg.com/world-atlas@1/world/50m.json", function(error, topology) {
  if (error) throw error;
  scene.add(graticule = wireframe(graticule10(), new THREE.LineBasicMaterial({color: 0xaaaaaa})));
  scene.add(mesh = wireframe(topojson.mesh(topology, topology.objects.countries), new THREE.LineBasicMaterial({color: 0xff0000})));
  //d3.timer(function(t) {
    graticule.rotation.x =  -Math.PI / 2;
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = -Math.PI/2;
  graticule.rotation.z = -Math.PI/2;
  // graticule.rotation.x = mesh.rotation.x = Math.sin(t / 11000) * Math.PI / 3 - Math.PI / 2;
  //   graticule.rotation.z = mesh.rotation.z = t / 10000;
    renderer.render(scene, camera);
//});
});

// Converts a point [longitude, latitude] in degrees to a THREE.Vector3.
function vertex(point) {
  var lambda = point[0] * Math.PI / 180,
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
  var geometry = new THREE.Geometry();
  multilinestring.coordinates.forEach(function(line) {
    d3.pairs(line.map(vertex), function(a, b) {
      geometry.vertices.push(a, b);
    });
  });
  return new THREE.LineSegments(geometry, material);
}

// See https://github.com/d3/d3-geo/issues/95
function graticule10() {
  var epsilon = 1e-6,
      x1 = 180, x0 = -x1, y1 = 80, y0 = -y1, dx = 10, dy = 10,
      X1 = 180, X0 = -X1, Y1 = 90, Y0 = -Y1, DX = 90, DY = 360,
      x = graticuleX(y0, y1, 2.5), y = graticuleY(x0, x1, 2.5),
      X = graticuleX(Y0, Y1, 2.5), Y = graticuleY(X0, X1, 2.5);

  function graticuleX(y0, y1, dy) {
    var y = d3.range(y0, y1 - epsilon, dy).concat(y1);
    return function(x) { return y.map(function(y) { return [x, y]; }); };
  }

  function graticuleY(x0, x1, dx) {
    var x = d3.range(x0, x1 - epsilon, dx).concat(x1);
    return function(y) { return x.map(function(x) { return [x, y]; }); };
  }

  return {
    type: "MultiLineString",
    coordinates: d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X)
        .concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y))
        .concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) { return Math.abs(x % DX) > epsilon; }).map(x))
        .concat(d3.range(Math.ceil(y0 / dy) * dy, y1 + epsilon, dy).filter(function(y) { return Math.abs(y % DY) > epsilon; }).map(y))
  };
}

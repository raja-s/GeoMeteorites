
//----------------5 Biggest Mass-------------------------------------


// Canvas dimensions
let heightStat =document.getElementById('statistics').offsetWidth;
let widthStat  = document.getElementById('statistics').offsetWidth;
// SCENE
const SCENEstat = new THREE.Scene();

// Light
const AMBIANT_LIGHTstat = new THREE.AmbientLight(0xffffff, 1);

// CAMERA
let FOVstat = 10000;



const GLOBE_RADIUSstat = 60;
//On mouse over, change color of geometry
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();


const CAMERAstat = new THREE.PerspectiveCamera(FOVstat, heightStat / widthStat, 1, 1000);


// Renderer
// const RENDERER = new THREE.WebGLRenderer({
//     alpha: true,
//     antialias: true
// });

const RENDERERstat = new THREE.WebGLRenderer( { alpha: true } );


RENDERERstat.setPixelRatio(window.devicePixelRatio);
RENDERERstat.setSize(heightStat, widthStat);
document.getElementById("5BiggestMass").appendChild(RENDERERstat.domElement);

let CAMERADistanceStat = 70;




CAMERAstat.translateZ(CAMERADistanceStat);


createMeteorite(6.00,38,-35,0);
createMeteorite(5.82,15,-35,0);
createMeteorite(5.00,-5,-35,0);
createMeteorite(3.00,-25,-35,0);
createMeteorite(2.8,-45,-35,0);




function createMeteorite(size,x,y,z) {



  let geometry = new THREE.DodecahedronGeometry(size, 1);
  geometry.vertices.forEach(function(v){
    v.x += (Math.random());
    v.y += (Math.random());
    v.z += (Math.random());
  })
  let material = new THREE.MeshBasicMaterial({
                  color: 0xaaaaaa,
                  wireframe: true,
                  wireframeLinewidth: 0.3
              });

  let mesh = new THREE.Mesh(geometry,material);
  mesh.position.set(x, y, z);


  SCENEstat.add(mesh);
  //RENDERER.render(SCENE, CAMERA);
  renderStat();
  //document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}


function renderStat() {

  requestAnimationFrame(renderStat);
  RENDERERstat.render(SCENEstat, CAMERAstat);
}





//----------------Mean mass by country-------------------------------------



//---------------Frequency by element-------------------------------------

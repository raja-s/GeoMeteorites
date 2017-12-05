
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





//----------------Mass distribution-------------------------------------

d3.csv(GD_SERVER_ADDRESS, function(data) {


  let massFound = new Array();
  let massFell = new Array();
  let i;


  let found = data.filter(data => data.fall === 'Found');
  let fell = data.filter(data=>data.fall==='Fell' );


  let t = d3.transition()
            .duration(1000)
            .ease(d3.easeLinear);

//&& data.year>=t1 && data.year<=t2 && data.cid==countryid);






found.forEach(function(element,i) {
  massFound[i] = Math.log(element.mass);

});

fell.forEach(function(element,i) {
massFell[i] = Math.log(element.mass);

});



//console.log(mass.length);


let formatCount = d3.format(",.0f");

let svg = d3.select('#massdistrib');

let margin = {top:10,right:30,bottom:30,left:30};


let divMass = document.getElementById('#MassDistribution');


let width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let  x = d3.scaleLinear()
        .rangeRound([0, width])
        .domain([0,d3.max(massFell)]);

let bins1 = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(40))
        (massFound);


let bins2 = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(40))
        (massFell);



// var line = d3.line()
//                   .x(function(d) { return x((d.x0 + d.x1)/2); })
//                   .y(function(d) { return y(d.length); })
//                   .curve(d3.curveCatmullRom.alpha(0.5));

let  y = d3.scaleLinear()
               .domain([0, d3.max(bins1, function(d) {
                 return d.length;
               })])
               .range([height, 0]);


let bar1 = g.selectAll(".bar1")
                       .data(bins1)
                       .enter().append("g")
                       .attr("class", "bar1")
                       .attr("transform", function(d) {
                         return "translate(" + x(d.x0) + "," + y(d.length) + ")";
                       });

let bar2 = g.selectAll(".bar2")
            .data(bins2)
          .enter().append("g")
          .attr("class", "bar2")
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";});




bar1.append("rect")
     .attr("x", 0.5)
     .attr("width", x(bins1[0].x1) - x(bins1[0].x0) - 1)
     .transition(t)
      .attr("height", function(d) {return height - y(d.length);});

bar2.append("rect")
           .attr("x", 0.5)
           .attr("width", x(bins2[0].x1) - x(bins2[0].x0) - 1)
           .transition(t)
            .attr("height", function(d) {return height - y(d.length);});


let legend = svg.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(" + (width - 245) + "," + 40 + ")")
                    .selectAll("g")
                    .data(["massFell", "massFound"])
                    .enter().append("g");

legend.append("text")
                    .attr("y", function(d, i) {
                      return i * 30 + 5;
                    })
                    .attr("x", 200)
                    .text(function(d) {
                      return d;
                    });

                  legend.append("rect")
                    .attr("y", function(d, i) {
                      return i * 30 - 8;
                    })
                    .attr("x", 167)
                    .attr("width", 20)
                    .attr("height", 20)
                    .attr("fill", function(d) {
                      if (d == "massFound") {
                        return 'brown';
                      } else {
                        return 'orange';
                      }
                    });




  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));



});



//---------------Frequency by element-------------------------------------

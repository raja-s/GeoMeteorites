
//----------------5 Biggest Mass-------------------------------------


// Canvas dimensions
// let heightStat =document.getElementById('statistics').offsetWidth;
// let widthStat  = document.getElementById('statistics').offsetWidth;
// // SCENE
// const SCENEstat = new THREE.Scene();
//
// // Light
// const AMBIANT_LIGHTstat = new THREE.AmbientLight(0xffffff, 1);
//
// // CAMERA
// let FOVstat = 10000;
//
//
//
// const GLOBE_RADIUSstat = 60;
// //On mouse over, change color of geometry
// let raycaster = new THREE.Raycaster();
// let mouse = new THREE.Vector2();
//
//
// const CAMERAstat = new THREE.PerspectiveCamera(FOVstat, heightStat / widthStat, 1, 1000);
//
//
// // Renderer
// // const RENDERER = new THREE.WebGLRenderer({
// //     alpha: true,
// //     antialias: true
// // });
//
// const RENDERERstat = new THREE.WebGLRenderer( { alpha: true } );
//
//
// RENDERERstat.setPixelRatio(window.devicePixelRatio);
// RENDERERstat.setSize(heightStat, widthStat);
// document.getElementById('5BiggestMass').appendChild(RENDERERstat.domElement);
//
// let CAMERADistanceStat = 70;
//
//
//
//
// CAMERAstat.translateZ(CAMERADistanceStat);
//
//
// createMeteorite(6.00,38,-35,0);
// createMeteorite(5.82,15,-35,0);
// createMeteorite(5.00,-5,-35,0);
// createMeteorite(3.00,-25,-35,0);
// createMeteorite(2.8,-45,-35,0);
//
//
//
//
// function createMeteorite(size,x,y,z) {
//
//
//
//   let geometry = new THREE.DodecahedronGeometry(size, 1);
//   geometry.vertices.forEach(function(v){
//     v.x += (Math.random());
//     v.y += (Math.random());
//     v.z += (Math.random());
//   });
//   let material = new THREE.MeshBasicMaterial({
//                   color: 0xaaaaaa,
//                   wireframe: true,
//                   wireframeLinewidth: 0.3
//               });
//
//   let mesh = new THREE.Mesh(geometry,material);
//   mesh.position.set(x, y, z);
//
//
//   SCENEstat.add(mesh);
//   //RENDERER.render(SCENE, CAMERA);
//   renderStat();
//   //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
//
// }
//
//
// function renderStat() {
//
//   requestAnimationFrame(renderStat);
//   RENDERERstat.render(SCENEstat, CAMERAstat);
// }
//
//



//----------------Mass distribution-------------------------------------

d3.csv(GD_SERVER_ADDRESS, function(data) {


let t = d3.transition()
            .duration(1000)
            .ease(d3.easeLinear);


let mass = new Array();
let i;
data.forEach(function(element,i){
mass[i] = Math.log(element.mass);
});



let svg = d3.select('#massdistrib');

let margin = {top:20,right:30,bottom:30,left:30};


let width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom,
        g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');



let  y = d3.scaleLinear()
        .rangeRound([0,height])
        .domain([0,d3.max(mass)]);

let bins1 = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(40))
        (mass);



let  x = d3.scaleLinear()
                       .domain([0, d3.max(bins1, function(d) {
                         return d.length;
                       })])
                       .range([0,width]);



let bar1 = g.selectAll('.bar1')
                       .data(bins1)
                       .enter().append('g')
                       .attr('class', 'bar1')
                       .attr('transform', function(d) {
                         return 'translate(0,' + y(d.x0) + ')';
                       });



bar1.append('rect')
     .attr('x', 0.5)
     .attr('height',y(bins1[0].x1) - y(bins1[0].x0) +2)
     .transition(t)
     .attr('width', function(d) {return x(d.length);});


  g.append('g')
    .attr('class', 'axis axis--x')
  //  .attr('transform', `translate(0,${height})`)
    .call(d3.axisLeft(y));

  g.append('g')
      .attr('class', 'axis axis--y')
  //    .attr('transform', `translate(0,${height})`)
      .call(d3.axisTop(x).ticks(5))




    g.append('text')
    .attr('transform','rotate(-90)')
    .attr('y', 0 - margin.left -.5)
    .attr('x',0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('log(Mass) [gr]');


    // text label for the y
//------------------------------------------------------------------------------
//---------------Meteorites classification--------------------------------------
//------------------------------------------------------------------------------.

const typeIron = 'Iron';
const typeStonyIron = 'StonyIron';
const typeStony = 'Stony';


d3.csv(GD_SERVER_ADDRESS+'?groupByCountry',function(groupByCountry){

const cidStored = groupByCountry.filter(d=>parseInt(d.totalMass)>500000).filter(d=>d.country!=='_').map(d=>d.country);


//Store only 34 country
let dataFinal = data.filter(d=>cidStored.find(a=>d.country===a));

d3.csv(GD_SERVER_ADDRESS+'?countries',function(error,countryData) {
  if (error) throw error;

const countryFinal = countryData.filter(d=>cidStored.find(a=>d.country===a));

console.log(countryFinal);

  dataFinal.forEach(function(e){
    if (typeof e === 'object'){
      e['CountryName'] = countryData.filter(d=>d.country===e.country).map(d=>d.name)[0];
    }

  });


//----------------Iron Meteorites-----------------------------------------------

let ironMeteorites = dataFinal.filter(function (el) {
  let classMeteorites = el.recclass;
  return classMeteorites.includes('Iron') ||
         classMeteorites.includes('Relict iron');
});


ironMeteorites.forEach(function(e){
  if (typeof e === 'object' ){
    e['Type'] = typeIron;
  }
});



//----------------Stony meteorites----------------------------------------------
let stonyMeteorites = dataFinal.filter(function (el) {
  let classMeteorites = el.recclass;
  return classMeteorites.startsWith('A') ||
         classMeteorites.startsWith('L') ||
         classMeteorites.startsWith('C') ||
         classMeteorites.startsWith('E') ||
         classMeteorites.startsWith('B') ||
         classMeteorites.startsWith('D') ||
         classMeteorites.startsWith('F') ||
         classMeteorites.startsWith('H') ||
         classMeteorites.startsWith('K') ||
         classMeteorites.includes('Martian') ||
         classMeteorites.startsWith('O') ||
         classMeteorites.startsWith('R') &&
         !classMeteorites.includes('Relict iron') ||
         classMeteorites.startsWith('S') ||
         classMeteorites.startsWith('U') ||
         classMeteorites.startsWith('W')
  // return !classMeteorites.includes('Pallasite') ||
  //        !classMeteorites.includes('Mesosiderite') ||
  //        !classMeteorites.includes('Iron') ||
  //        !classMeteorites.includes('Relict iron');

});


stonyMeteorites.forEach(function(e){
  if (typeof e === 'object' ){
    e['Type'] = typeStony;
  }
});

//-----------------Stony-iron meteorites----------------------------------------
let stonyIronMeteorites = dataFinal.filter(function (el) {
  let classMeteorites = el.recclass;
  return classMeteorites.includes('Pallasite') ||
         classMeteorites.includes('Mesosiderite');

});

stonyIronMeteorites.forEach(function(e){
  if (typeof e === 'object' ){
    e['Type'] = typeStonyIron;
  }
});



//data classified
let dataClassified = [...stonyMeteorites,...stonyIronMeteorites,...ironMeteorites];


const color ={ Iron: '#2171b5', StonyIron:'brown', Stony:'green'};


let svg2=d3.select('#elementFrequency');
let g2 = svg2.append('g').attr('transform','translate(40,15)');
let bp=viz.bP()
	.data(dataClassified)
	.keyPrimary(d=>d.Type)
	.keySecondary(d=>d.CountryName)
	.value(d=>(d.mass))
  .width(200)
  .height(400)
	.min(2)
	.pad(3)
	.barSize(6)
	.orient('vertical')
  .edgeOpacity(.3)
	.fill(d=>color[d.primary]);

g2.call(bp);

//



g2.append('text').attr('x',-5).attr('y',-2).style('text-anchor','end').text('Type');
g2.append('text').attr('x', 205).attr('y',-2).style('text-anchor','start').text('Country');



//Add label countries flag
g2.selectAll('.mainBars').append('text').attr('class','label')
  		.attr('x',d=>(d.part=='primary'? -35: 5))
  		.attr('y',d=>+1)
  		.text(d=>d.key)
  		.attr('text-anchor',d=>(+d.part=='primary' ? 'end': 'start'));

//Add label percentage
g2.selectAll('.mainBars').append('text').attr('class','perc')
	.attr('x',d=>(d.part=='primary'? -35: 90))
	.attr('y',d=>(d.part=='primary'? 15: 1))
	.text(function(d){ return d3.format('0.1%')(+d.percent);})
	.attr('text-anchor',d=>(+d.part=='primary'? 'end': 'start'));


g2.selectAll('.mainBars')
	.on('mouseover',mouseover)
	.on('mouseout',mouseout);


function mouseover(d){
	bp.mouseover(d);
	g2.selectAll('.mainBars')
	.select('.perc')
	.text(function(d){ return d3.format('0.1%')(+d.percent)})
}
function mouseout(d){
	bp.mouseout(d);
	g2.selectAll('.mainBars')
		.select('.perc')
	.text(function(d){ return d3.format('0.1%')(+d.percent)})
}

});
  });
});

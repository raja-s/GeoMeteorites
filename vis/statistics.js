
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

function setUpBipartiteGraph() {

let t = d3.transition()
            .duration(1000)
            .ease(d3.easeLinear);

let formatCount = d3.format(".0f");


let mass = meteoriteData.map(d=>parseInt(Math.log(d.mass)));
//console.log(mass);

let svg = d3.select('#massdistrib');

let margin = {top:20,right:30,bottom:30,left:30};


let width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom,
        g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');



let  y = d3.scaleLinear()
        .range([0,height])
        .domain([0,d3.max(mass)]);

let bins1 = d3.histogram()
        .domain(y.domain())
        //.thresholds(y.ticks())
        (mass);

//console.log(bins1);


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
                         return 'translate('+margin.left+',' + y(d.x0) + ')';
                       });



bar1.append('rect')
     .attr('x', 0.5)
     .attr('height',y(bins1[0].x1) - y(bins1[0].x0) +2)
     .transition(t)
     .attr('width', function(d) {return x(d.length);});

bar1.append("text")
    .attr("dy", ".75em")
    .transition(t)
    .attr("x",function(d){return x(d.length)+15;})
    .attr("y",(y(bins1[0].x1) - y(bins1[0].x0))/3)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.length);})
    .style('fill','black');

  g.append('g')
    .attr('class', 'axis axis--y')
    .attr('transform', 'translate('+margin.left+',0)')
    .call(d3.axisLeft(y));

  // g.append('g')
  //     .attr('class', 'axis axis--y')
  // //    .attr('transform', `translate(0,${height})`)
  //     .call(d3.axisTop(x).ticks(5))




    g.append('text')
    .attr('transform','rotate(-90)')
    .attr('y', -10)
    .attr('x', -height/2)
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

//let othersCountries = groupByCountry.filter(d=>d.country!=='_' && (parseInt(d.totalMass)/(countries.filter(e=>e.country==d.country).map(e=>parseInt(e.area)/100)))<180).map(d=>parseInt(d.totalMass));
//let others = othersCountries.reduce((pv, cv) => pv+cv, 0);
let countryStored = groupByCountry.filter(d=>d.country!=='_' && (parseInt(d.totalMass)/(countries.filter(e=>e.country==d.country).map(e=>parseInt(e.area)/100)))>180).map(d=>d.country);


//countryStored.push(others);
//console.log(countryStored);

//Store only 34 country
let dataFinal = meteoriteData.filter(d=>countryStored.find(a=>d.country===a));

  dataFinal.forEach(function(e){
    if (typeof e === 'object'){
      e['CountryName'] = countries.filter(d=>d.country===e.country).map(d=>d.name)[0];
    }

  });

//----------------Iron Meteorites-----------------------------------------------

let ironMeteorites = dataFinal.filter(e=>e.recclass.includes('Iron') || e.recclass.includes('Relict iron'));

ironMeteorites.forEach(function(e){
  if (typeof e === 'object' ){
    e['Type'] = typeIron;
  }
});
//console.log(ironMeteorites);


//----------------Stony meteorites----------------------------------------------
const CLASSES_TO_KEEP = ['A', 'L', 'C', 'E', 'B', 'D', 'F', 'H', 'K', 'O', 'R', 'S', 'U', 'W'];

let stonyMeteorites = dataFinal.filter(e=> CLASSES_TO_KEEP.includes(e.recclass[0]) || e.recclass.includes('Martian') && !e.recclass.includes('Relict iron'));
//console.log(stonyMeteorites);

stonyMeteorites.forEach(function(e){
  if (typeof e === 'object' ){
    e['Type'] = typeStony;
  }
});

//-----------------Stony-iron meteorites----------------------------------------
let stonyIronMeteorites = dataFinal.filter(e=>e.recclass.includes('Pallasite') || e.recclass.includes('Mesosiderite'));


stonyIronMeteorites.forEach(function(e){
  if (typeof e === 'object' ){
    e['Type'] = typeStonyIron;
  }
});
//console.log(stonyIronMeteorites);


//data classified
let dataClassified = [...stonyMeteorites,...stonyIronMeteorites,...ironMeteorites];
//console.log(dataClassified);

const color ={ Iron: '#2171b5', StonyIron:'brown', Stony:'green'};


let svg2=d3.select('#elementFrequency');
let g2 = svg2.append('g').attr('transform','translate(40,15)');
let bp=viz.bP()
	.data(dataClassified)
	.keyPrimary(d=>d.Type)
	.keySecondary(d=>d.CountryName)
	.value(d=>parseInt(d.mass))
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
	.attr('x',d=>(d.part=='primary'? -35: 65))
	.attr('y',d=>(d.part=='primary'? 15: 1))
	.text(function(d){ return d3.format('0.1%')(+d.percent);})
	.attr('text-anchor',d=>(+d.part=='primary'? 'end': 'start'));


g2.selectAll('.mainBars')
	.on('mousemove',mousemove)
	.on('mouseout',mouseout);

let bpActivated = false;

function mousemove(d){
    const SQRT = d3.event.movementX ** 2 + d3.event.movementY ** 2;
    if ((SQRT <= 4) && !bpActivated) {
        bpActivated = true;
	    bp.mouseover(d);
    	g2.selectAll('.mainBars')
    	.select('.perc')
    	.text(function(d){ return d3.format('0.1%')(+d.percent)});
    }
}

function mouseout(d){
    bpActivated = false;
	bp.mouseout(d);
	g2.selectAll('.mainBars')
		.select('.perc')
	.text(function(d){ return d3.format('0.1%')(+d.percent)});
}

});

}

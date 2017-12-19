'use strict';

/*
    Constants
*/

const LEFT_PANE_DIMENSIONS = Object.freeze({
    HEIGHT : window.innerHeight * 0.6,
    WIDTH  : window.innerWidth  * 0.3
});

const MASS_DIST_MARGINS = Object.freeze({
    
    TOP    : 20,
    BOTTOM : 20,
    
    LEFT   : 30,
    RIGHT  : 25
    
});

const MASS_DIST_DIMENSIONS = Object.freeze({
    
    HEIGHT : (LEFT_PANE_DIMENSIONS.HEIGHT / 2) - MASS_DIST_MARGINS.TOP  - MASS_DIST_MARGINS.BOTTOM,
    WIDTH  : LEFT_PANE_DIMENSIONS.WIDTH        - MASS_DIST_MARGINS.LEFT - MASS_DIST_MARGINS.RIGHT
    
});

const BP_MARGINS = Object.freeze({

    TOP    : 20,
    BOTTOM : 20,

    LEFT   : LEFT_PANE_DIMENSIONS.WIDTH * 0.12,
    RIGHT  : LEFT_PANE_DIMENSIONS.WIDTH * 0.3

});

const BP_DIMENSIONS = Object.freeze({

    HEIGHT : LEFT_PANE_DIMENSIONS.HEIGHT - BP_MARGINS.TOP  - BP_MARGINS.BOTTOM,
    WIDTH  : LEFT_PANE_DIMENSIONS.WIDTH  - BP_MARGINS.LEFT - BP_MARGINS.RIGHT,

    BAR    : 6

});

const COUNTRY_STATS_CONTAINER = document.getElementById('country-stats-container');
const CLASS_STATS_CONTAINER = document.getElementById('class-stats-container');

/*
    Functions
*/

//------------------------------------------------------------------------------
//------------------------Mass distribution-------------------------------------
//------------------------------------------------------------------------------

function setUpCountryStatistics(countryCode) {

    //Remove previous country if present
    removeChildren(document.getElementById('country-name'));
    removeChildren(document.getElementById('mass-dist-chart'));
    removeChildren(document.getElementById('biggestMeteorite'));

    //Filter data by country selected
    let countryData = meteoriteData.filter(d=>d.country===countryCode);

    //Get the country name from countries
    document.getElementById('country-name').innerHTML =
        countries.find(d=>d.country === countryCode).name;


    let t = d3.transition()
                .duration(1000)
                    .ease(d3.easeLinear);

    let formatCount = d3.format(".0f");

    // let masses  = countryData.map(d => Math.log(parseFloat(d.mass)));
    let massLogs = countryData.map(d => Math.floor(Math.log(parseFloat(d.mass) + 1)));

    // Calculate the average mass
    let averageMass = massLogs.reduce((a, b) => a + b, 0) / massLogs.length;

    let massDistData = [];
    
    massLogs.forEach(massLog => {
        
        const ENTRY = massDistData.find(entry => entry.massLog === massLog);
        
        if (ENTRY === undefined) {
            massDistData.push({
                massLog   : massLog,
                frequency : 1
            });
        } else {
            ENTRY.frequency++;
        }
        
    });
    
    massDistData.sort((d1, d2) =>
        (d1.massLog < d2.massLog) ? -1 : (d1.massLog > d2.massLog) ? 1 : 0);

    let x = d3.scaleLinear()
                   .domain(d3.extent(massLogs))
                    .range([0, MASS_DIST_DIMENSIONS.WIDTH]);

    let  y = d3.scaleLinear()
                    .domain([0, d3.max(massDistData, d => d.frequency)])
                     .range([MASS_DIST_DIMENSIONS.HEIGHT, 0]);

    const CHART_SVG = d3.select('#mass-dist-chart')
                          .attr('height', LEFT_PANE_DIMENSIONS.HEIGHT / 2)
                          .attr('width' , LEFT_PANE_DIMENSIONS.WIDTH);

    const CHART =
        CHART_SVG.append('g')
                   .attr('height', MASS_DIST_DIMENSIONS.HEIGHT)
                   .attr('width' , MASS_DIST_DIMENSIONS.WIDTH)
                   .attr('transform', `translate(${MASS_DIST_MARGINS.LEFT}, ${MASS_DIST_MARGINS.TOP})`);

    const LINE = d3.line()
                  .curve(d3.curveCatmullRom)
                      .x(d => x(d.massLog))
                      .y(d => y(d.frequency));

    console.log(massDistData);

    CHART.append('path')
          .datum(massDistData)
           .attr('fill', 'none')
        //   .attr('stroke', 'steelblue')
           .attr('stroke-linejoin', 'round')
           .attr('stroke-linecap', 'round')
           .attr('stroke-width', 2)
           .attr('d', LINE);

    CHART.append('g')
        .attr('class', 'axes x-axes')
        .attr('transform', `translate(0, ${MASS_DIST_DIMENSIONS.HEIGHT})`)
        .call(d3.axisBottom(x).ticks(8));

    CHART.append('g')
           .attr('class', 'axes y-axes')
           .call(d3.axisLeft(y).ticks(5, 'd'));

//Biggest mass
// Canvas dimensions
let heightStat = 150;
let widthStat  = 400;

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
const RENDERER = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

const RENDERERstat = new THREE.WebGLRenderer( { alpha: true } );


RENDERERstat.setPixelRatio(window.devicePixelRatio);
RENDERERstat.setSize(heightStat, widthStat);
document.getElementById('biggestMeteorite').appendChild(RENDERERstat.domElement);

let CAMERADistanceStat = 70;

CAMERAstat.translateZ(CAMERADistanceStat);


let biggestMass = Math.max.apply(Math,countryData.map(d=>parseInt(d.mass)));
let biggestMassSize = Math.log(biggestMass);
//console.log(biggestMass);

let biggestMassName = countryData.filter(d=>parseInt(d.mass)==biggestMass).map(d=>d.name)[0];
let biggestMassYear = countryData.filter(d=>parseInt(d.mass)==biggestMass).map(d=>(d.year).getFullYear())[0];




//console.log(averageMass);

//console.log(biggestMassCountry);

//Create the biggest meteorite (call createMeteorite() function)
let mesh = createMeteorite(biggestMassSize,0,-35,0);


//Function that creates a dodecahedron geometry with random vertices
function createMeteorite(size,x,y,z) {

  let geometry = new THREE.DodecahedronGeometry(size, 1);
  geometry.vertices.forEach(function(v){
    v.x += (Math.random());
    v.y += (Math.random());
    v.z += (Math.random());
  });
  let material = new THREE.MeshBasicMaterial({
                  color: 0xaaaaaa,
                  wireframe: true,
                  wireframeLinewidth: 0.3
              });

  let mesh = new THREE.Mesh(geometry,material);
  mesh.position.set(x, y, z);

  return mesh;
}

SCENEstat.add(mesh);
//RENDERER.render(SCENE, CAMERA);
renderStat();
//document.addEventListener( 'mousemove', onDocumentMouseMove, false );

//Render function
function renderStat(){
    requestAnimationFrame(renderStat);
    mesh.rotation.y +=  Math.PI/360;
    RENDERERstat.render(SCENEstat, CAMERAstat);
}

//Add text next to the biggest mass
let parName = document.createElement('p');
let parYear = document.createElement('p');
let parCountry = document.createElement('p');
let parMass = document.createElement('p');
let parAverageMass = document.createElement('p');
let nameMet = document.createTextNode('Name: '+ biggestMassName);
let yearMet = document.createTextNode('Year: '+ biggestMassYear);
let massMet = document.createTextNode('Mass: '+biggestMass+'g')
let averageMassMet = document.createTextNode('Average Mass: '+averageMass+'g');

let title = document.createElement('h4');
let titleText = document.createTextNode('The biggest meteorite');

let titleDiv = document.createElement('div');
titleDiv.id = 'textBiggest';

title.appendChild(titleText);
titleDiv.appendChild(title);

parName.appendChild(nameMet);
parYear.appendChild(yearMet);
parMass.appendChild(massMet);
parAverageMass.appendChild(averageMassMet);

let biggesttext = document.createElement('div');
//let otherStat = document.createElement('div');
//otherStat.style.display='inline-block';

biggesttext.id = 'nameMeteorite';
biggesttext.appendChild(parName);
biggesttext.appendChild(parYear);
biggesttext.appendChild(parMass);
//otherStat.appendChild(parAverageMass);

document.getElementById('biggestMeteorite').appendChild(biggesttext);
document.getElementById('biggestMeteorite').appendChild(titleDiv);
//document.getElementById('biggestMeteorite').appendChild(otherStat);

}


function setUpBipartiteGraph() {

//------------------------------------------------------------------------------
//---------------Meteorites classification--------------------------------------
//------------------------------------------------------------------------------.

const typeIron = 'Iron';
const typeStonyIron = 'StonyIron';
const typeStony = 'Stony';


d3.csv(GD_SERVER_ADDRESS+'?groupByCountry',function(groupByCountry){

//let countryStored = groupByCountry.filter(d=>d.country!=='_' && (parseInt(d.totalMass)/(countries.filter(e=>e.country==d.country).map(e=>parseInt(e.area))))>2).map(d=>d.country);
//console.log(countryStored);
let dataFinal=meteoriteData.filter(d=>d.country!=='_');
//let condition = groupByCountry.map(f=>parseFloat(f.totalMass)/(countries.filter(d=>d.country==f.country).map(d=>parseInt(d.area))));
//console.log(condition);

//Country name or others
dataFinal.forEach(e=>e.CountryName=(groupByCountry.filter(f=>f.country==e.country).map(f=>parseFloat(f.totalMass)/(countries.filter(d=>d.country==f.country).map(d=>parseInt(d.area))))>1) && e.country!=='_' ?
                                                    countries.filter(d=>d.country===e.country).map(d=>d.name)[0]:'Others');
//Density [gr/km2]
dataFinal.forEach(e=>e.Density=parseFloat(e.mass)/(countries.filter(d=>d.country==e.country).map(d=>parseInt(d.area))));




//----------------Iron Meteorites-----------------------------------------------
let ironMeteorites = dataFinal.filter(e=>e.recclass.includes('Iron') || e.recclass.includes('Relict iron'));
ironMeteorites.forEach(e=>e.Type=typeIron);


//----------------Stony meteorites----------------------------------------------
const CLASSES_TO_KEEP = ['A', 'L', 'C', 'E', 'B', 'D', 'F', 'H', 'K', 'O', 'R', 'S', 'U', 'W'];

let stonyMeteorites = dataFinal.filter(e=> CLASSES_TO_KEEP.includes(e.recclass[0]) || e.recclass.includes('Martian') && !e.recclass.includes('Relict iron'));
stonyMeteorites.forEach(e=>e.Type=typeStony);
//console.log(stonyMeteorites);

//-----------------Stony-iron meteorites----------------------------------------
let stonyIronMeteorites = dataFinal.filter(e=>e.recclass.includes('Pallasite') || e.recclass.includes('Mesosiderite'));
stonyIronMeteorites.forEach(e=>e.Type=typeStonyIron);
//console.log(stonyIronMeteorites);

//data classified
let dataClassified = [...stonyMeteorites,...stonyIronMeteorites,...ironMeteorites];
//console.log(dataClassified);

const COLOR = Object.freeze({
    Iron      : '#2171b5',
    StonyIron : 'brown',
    Stony     : 'green'
});

const CLASS_STATS = d3.select('#class-stats')
                        .attr('height', LEFT_PANE_DIMENSIONS.HEIGHT)
                        .attr('width' , LEFT_PANE_DIMENSIONS.WIDTH);

const GROUP = CLASS_STATS.append('g')
                           .attr('transform', `translate(${BP_MARGINS.LEFT}, ${BP_MARGINS.TOP})`);

let bp=viz.bP()
	.data(dataClassified)
	.keyPrimary(d=>d.Type)
	.keySecondary(d=>d.CountryName)
	.value(d=>d.Density)
  .width(BP_DIMENSIONS.WIDTH)
  .height(BP_DIMENSIONS.HEIGHT)
	.min(0)
	.pad(3)
	.barSize(BP_DIMENSIONS.BAR)
	.orient('vertical')
  .edgeOpacity(0.3)
	.fill(d=>COLOR[d.primary]);

GROUP.call(bp);

//

GROUP.append('text')
       .attr('x', - BP_DIMENSIONS.BAR)
       .attr('y', -2)
       .attr('text-anchor','end')
       .text('Type');

GROUP.append('text')
       .attr('x', BP_DIMENSIONS.WIDTH + BP_DIMENSIONS.BAR)
       .attr('y', -2)
       .attr('text-anchor','start')
       .text('Country');

//Add label countries flag
GROUP.selectAll('.mainBars')
        .append('text')
        .attr('class', 'label')
  		.attr('x', d=>(d.part=='primary' ? - BP_DIMENSIONS.BAR : BP_DIMENSIONS.BAR))
  		.attr('y', 1)
  		.text(d => d.key)
  		.attr('text-anchor',d=>(d.part=='primary' ? 'end': 'start'));

//Add label percentage
GROUP.selectAll('.mainBars')
     .append('text')
     .attr('class', 'perc')
	   .attr('x',d=>(d.part=='primary' ? - BP_DIMENSIONS.BAR : 115))
	   .attr('y',d=>(d.part=='primary' ? 15 : 1))
	   .text(d => d3.format('0.1%')(+d.percent))
	.attr('text-anchor', 'end');


GROUP.selectAll('.mainBars')
	.on('mousemove',mousemove)
	.on('mouseout',mouseout);

//console.log(bp);

let bpActivated = false;

function mousemove(d){
    const SQRT = d3.event.movementX ** 2 + d3.event.movementY ** 2;
    if ((SQRT <= 4) && !bpActivated) {
        bpActivated = true;
	    bp.mouseover(d);
    	GROUP.selectAll('.mainBars')
    	.select('.perc')
    	.text(function(d){ return d3.format('0.1%')(+d.percent)});
    }
}

function mouseout(d){
    bpActivated = false;
	bp.mouseout(d);
	GROUP.selectAll('.mainBars')
		.select('.perc')
	.text(function(d){ return d3.format('0.1%')(+d.percent)});
}

});

}

function showClassStatistics() {
    
    COUNTRY_STATS_CONTAINER.dataset.hidden = '';
    setTimeout(() => {
        delete CLASS_STATS_CONTAINER.dataset.hidden;
    }, 300);
    
}

function showCountryStatistics(countryCode) {
    
    COUNTRY_STATS_CONTAINER.dataset.hidden = '';
    CLASS_STATS_CONTAINER.dataset.hidden = '';
    setTimeout(() => {
        setUpCountryStatistics(countryCode);
        delete COUNTRY_STATS_CONTAINER.dataset.hidden;
    }, 300);
    
}

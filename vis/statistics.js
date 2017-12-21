'use strict';

/*
    Constants
*/

const LEFT_PANE_DIMENSIONS = Object.freeze({
    HEIGHT : window.innerHeight * 0.6,
    WIDTH  : window.innerWidth  * 0.3
});

const MASS_DIST_MARGINS = Object.freeze({
    
    TOP    : LEFT_PANE_DIMENSIONS.HEIGHT * 0.05,
    BOTTOM : LEFT_PANE_DIMENSIONS.HEIGHT * 0.05,
    
    LEFT   : LEFT_PANE_DIMENSIONS.WIDTH * 0.1,
    RIGHT  : LEFT_PANE_DIMENSIONS.WIDTH * 0.08
    
});

const MASS_DIST_DIMENSIONS = Object.freeze({
    
    HEIGHT : (LEFT_PANE_DIMENSIONS.HEIGHT / 2) - MASS_DIST_MARGINS.TOP  - MASS_DIST_MARGINS.BOTTOM,
    WIDTH  : LEFT_PANE_DIMENSIONS.WIDTH        - MASS_DIST_MARGINS.LEFT - MASS_DIST_MARGINS.RIGHT
    
});

const BP_MARGINS = Object.freeze({

    TOP    : LEFT_PANE_DIMENSIONS.HEIGHT * 0.08,
    BOTTOM : LEFT_PANE_DIMENSIONS.HEIGHT * 0.05,

    LEFT   : LEFT_PANE_DIMENSIONS.WIDTH * 0.12,
    RIGHT  : LEFT_PANE_DIMENSIONS.WIDTH * 0.32

});

const BP_DIMENSIONS = Object.freeze({

    HEIGHT : LEFT_PANE_DIMENSIONS.HEIGHT - BP_MARGINS.TOP  - BP_MARGINS.BOTTOM,
    WIDTH  : LEFT_PANE_DIMENSIONS.WIDTH  - BP_MARGINS.LEFT - BP_MARGINS.RIGHT,

    BAR    : 6

});

const COUNTRY_STATS_CONTAINER    = document.getElementById('country-stats-container');
const CLASS_STATS_CONTAINER      = document.getElementById('class-stats-container');

const COUNTRY_STATS_NO_DATA_TEXT = document.getElementById('country-stats-no-data-text');
const COUNTRY_STATS_BACK_BUTTON  = document.getElementById('country-stats-back-button');
const COUNTRY_STATS_COUNTRY      = document.getElementById('country-stats-country-name');
const COUNTRY_STATS_CHART        = document.getElementById('mass-dist-chart');
const HEAVIEST_METEORITE_NAME    = document.getElementById('heaviest-meteorite-name');
const HEAVIEST_METEORITE_YEAR    = document.getElementById('heaviest-meteorite-year');
const HEAVIEST_METEORITE_MASS    = document.getElementById('heaviest-meteorite-mass');

const HEAVIEST_METEORITE_VIS_HEIGHT = LEFT_PANE_DIMENSIONS.WIDTH * 0.3;
const HEAVIEST_METEORITE_VIS_WIDTH  = HEAVIEST_METEORITE_VIS_HEIGHT;

const BACK_BUTTON_SIZE = LEFT_PANE_DIMENSIONS.WIDTH * 0.1;

const HEAVIEST_METEORITE_MESH_MIN_SCALE = 0.0001;

/*
    Variables
*/

let heaviestMeteoriteMeshTargetScale = HEAVIEST_METEORITE_MESH_MIN_SCALE;

/*
    D3 code
*/

const MASS_DIST_TRANSITION = d3.transition()
                                 .duration(1000);

let xCountryMassDist = d3.scaleLinear()
                               .range([0, MASS_DIST_DIMENSIONS.WIDTH]);

let yCountryMassDist = d3.scalePoint()
                              .range([MASS_DIST_DIMENSIONS.HEIGHT, 0]);

const MASS_DIST_CHART_SVG = d3.select(COUNTRY_STATS_CHART)
                      .attr('height', LEFT_PANE_DIMENSIONS.HEIGHT / 2)
                      .attr('width' , LEFT_PANE_DIMENSIONS.WIDTH);

const MASS_DIST_CHART =
    MASS_DIST_CHART_SVG.append('g')
                         .attr('height', MASS_DIST_DIMENSIONS.HEIGHT)
                         .attr('width' , MASS_DIST_DIMENSIONS.WIDTH)
                         .attr('transform',
                            `translate(${MASS_DIST_MARGINS.LEFT}, ${MASS_DIST_MARGINS.TOP})`);

const MASS_DIST_PATH =
    MASS_DIST_CHART.append('path')
                     .attr('fill', 'none')
                     .attr('stroke-linejoin', 'round')
                     .attr('stroke-linecap', 'round')
                     .attr('stroke-width', 2);

const MASS_DIST_X_AXIS =
    MASS_DIST_CHART.append('g')
                     .attr('class', 'axes x-axes')
                     .attr('transform', `translate(0, ${MASS_DIST_DIMENSIONS.HEIGHT})`);

const MASS_DIST_Y_AXIS =
    MASS_DIST_CHART.append('g')
                     .attr('class', 'axes y-axes');

/*
    Three.js code
*/

// Scene
const HEAVIEST_METEORITE_SCENE = new THREE.Scene();
    
// Camera
const HEAVIEST_METEORITE_CAMERA = new THREE.PerspectiveCamera(
    35, HEAVIEST_METEORITE_VIS_HEIGHT / HEAVIEST_METEORITE_VIS_WIDTH, 20, 40);

HEAVIEST_METEORITE_CAMERA.translateZ(30);

// Renderer
const HEAVIEST_METEORITE_RENDERER = new THREE.WebGLRenderer({
    alpha     : true,
    antialias : true
});

HEAVIEST_METEORITE_RENDERER.setPixelRatio(window.devicePixelRatio);
HEAVIEST_METEORITE_RENDERER.setSize(HEAVIEST_METEORITE_VIS_HEIGHT, HEAVIEST_METEORITE_VIS_WIDTH);

COUNTRY_STATS_CONTAINER.appendChild(HEAVIEST_METEORITE_RENDERER.domElement);

const HEAVIEST_METEORITE_MESH = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1, 1),
    new THREE.MeshBasicMaterial({
        color              : 0xaaaaaa,
        wireframe          : true,
        wireframeLinewidth : 0.3
    })
);

HEAVIEST_METEORITE_MESH.position.set(0, 0, 0);
HEAVIEST_METEORITE_MESH.scale.setScalar(HEAVIEST_METEORITE_MESH_MIN_SCALE);

HEAVIEST_METEORITE_SCENE.add(HEAVIEST_METEORITE_MESH);

heaviestMeteoriteAnimationLoop();

/*
    Functions
*/

function randomizeHeaviestMeteorite() {
    
    HEAVIEST_METEORITE_MESH.geometry.vertices.forEach(v =>
        v.multiplyScalar(Math.random() * 0.2 + 0.8));
    
    HEAVIEST_METEORITE_MESH.geometry.verticesNeedUpdate = true;
    
}

function heaviestMeteoriteAnimationLoop() {
    
    requestAnimationFrame(heaviestMeteoriteAnimationLoop);
    
    if (HEAVIEST_METEORITE_MESH.scale.x !== heaviestMeteoriteMeshTargetScale) {
        
        const DIFFERENCE = heaviestMeteoriteMeshTargetScale - HEAVIEST_METEORITE_MESH.scale.x;
        
        HEAVIEST_METEORITE_MESH.scale.setScalar((Math.abs(DIFFERENCE) < 0.001) ?
            heaviestMeteoriteMeshTargetScale : HEAVIEST_METEORITE_MESH.scale.x + (DIFFERENCE * 0.2));
        
    }
    
    HEAVIEST_METEORITE_MESH.rotation.y =
        modulo(HEAVIEST_METEORITE_MESH.rotation.y + 0.01, 2 * Math.PI);
    
    HEAVIEST_METEORITE_RENDERER.render(HEAVIEST_METEORITE_SCENE, HEAVIEST_METEORITE_CAMERA);
    
}

//------------------------------------------------------------------------------
//------------------------Mass distribution-------------------------------------
//------------------------------------------------------------------------------

function setUpCountryStatistics(countryCode) {

    //Filter data by country selected
    let countryData = meteoriteData.filter(d=>d.country===countryCode);

    //Get the country name from countries
    COUNTRY_STATS_COUNTRY.innerHTML = countries.find(d=>d.country === countryCode).name;

    let formatCount = d3.format('.0f');

    // let massLogs = countryData.map(d => Math.floor(10 * Math.log10(d.mass + 1)) * 0.1);
    let massLogs = countryData.map(d => Math.floor(Math.log10(d.mass + 1)));

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

    const MAX_FREQUENCY = d3.max(massDistData, d => d.frequency);
    const Y_DOMAIN = [];
    for (let i = 0 ; i <= MAX_FREQUENCY + 1 ; i++) {
        Y_DOMAIN.push(i);
    }

    xCountryMassDist.domain((massDistData.length === 1) ?
        [0, 2 * d3.max(massLogs)] : d3.extent(massDistData, d => d.massLog));
    yCountryMassDist.domain(Y_DOMAIN);

    const LINE = d3.line()
                  .curve(d3.curveCatmullRom)
                      .x(d => xCountryMassDist(d.massLog))
                      .y(d => yCountryMassDist(d.frequency));

    MASS_DIST_PATH.datum(massDistData)
             .transition(MASS_DIST_TRANSITION)
                   .attr('d', LINE);

    MASS_DIST_X_AXIS.transition(MASS_DIST_TRANSITION)
                          .call(d3.axisBottom(xCountryMassDist)/*.tickFormat(d3.format('d'))*/);

    MASS_DIST_Y_AXIS.transition(MASS_DIST_TRANSITION)
                          .call(d3.axisLeft(yCountryMassDist)
                            .tickValues(limitedIntegerTicks(MAX_FREQUENCY, 6)));

    const HEAVIEST_METEORITE = countryData.reduce((d1, d2) =>
        (d1.mass > d2.mass) ? d1 : d2, { mass : -1 });

    HEAVIEST_METEORITE_NAME.innerHTML = `Name: ${HEAVIEST_METEORITE.name}`;
    HEAVIEST_METEORITE_YEAR.innerHTML = `Year: ${HEAVIEST_METEORITE.year.getFullYear()}`;
    HEAVIEST_METEORITE_MASS.innerHTML = `Mass: ${HEAVIEST_METEORITE.mass}g`;
    
    HEAVIEST_METEORITE_MESH.geometry = new THREE.DodecahedronGeometry(1, 1);
    
    heaviestMeteoriteMeshTargetScale = Math.log10(HEAVIEST_METEORITE.mass + 1);
    randomizeHeaviestMeteorite();
    
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

// TODO: Move styling to CSS

GROUP.append('text')
       .attr('x', - BP_DIMENSIONS.BAR)
       .attr('y', - BP_MARGINS.TOP * 0.4)
       .attr('text-anchor','end')
       .attr('alignment-baseline','middle')
       .text('Type');

GROUP.append('text')
       .attr('x', BP_DIMENSIONS.WIDTH + BP_DIMENSIONS.BAR)
       .attr('y', - BP_MARGINS.TOP * 0.4)
       .attr('text-anchor','start')
       .attr('alignment-baseline','middle')
       .text('Country');

//Add label countries flag
GROUP.selectAll('.mainBars')
        .append('text')
        .attr('class', 'label')
  		.attr('x', d => (d.part === 'primary') ? - BP_DIMENSIONS.BAR : BP_DIMENSIONS.BAR)
  		.attr('y', d => (d.part === 'primary') ? -2 : 0)
  		.text(d => d.key)
  		.attr('text-anchor', d => (d.part === 'primary') ? 'end': 'start')
  		.attr('alignment-baseline', d => (d.part === 'primary') ? 'baseline' : 'middle');

//Add label percentage
GROUP.selectAll('.mainBars')
     .append('text')
     .attr('class', 'perc')
	   .attr('x',d => (d.part === 'primary') ? - BP_DIMENSIONS.BAR : 115)
	   .attr('y',d => (d.part === 'primary') ? 2 : 0)
	   .text(d => d3.format('0.1%')(+d.percent))
	.attr('text-anchor', 'end')
	.attr('alignment-baseline', d => (d.part === 'primary') ? 'hanging' : 'middle');


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
    
    COUNTRY_STATS_NO_DATA_TEXT.dataset.hidden = '';
    COUNTRY_STATS_CONTAINER.dataset.hidden = '';
    setTimeout(() => {
        delete CLASS_STATS_CONTAINER.dataset.hidden;
    }, 300);
    
}

function showCountryStatistics(countryCode) {
    
    const COUNTRY_WITH_DATA = meteoriteData.some(entry => entry.country === countryCode);
    
    CLASS_STATS_CONTAINER.dataset.hidden = '';
    
    if (COUNTRY_WITH_DATA) {
        
        COUNTRY_STATS_NO_DATA_TEXT.dataset.hidden = '';
        setTimeout(() => {
            setUpCountryStatistics(countryCode);
            delete COUNTRY_STATS_CONTAINER.dataset.hidden;
        }, ('hidden' in CLASS_STATS_CONTAINER.dataset) ? 0 : 300);
        
    } else {
        
        COUNTRY_STATS_CONTAINER.dataset.hidden = '';
        setTimeout(() => {
            delete COUNTRY_STATS_NO_DATA_TEXT.dataset.hidden;
        }, 300);
        
    }
    
}

/*
    Event Listeners
*/

COUNTRY_STATS_BACK_BUTTON.addEventListener('click', event => {
    
    backToGlobalView();
    
});

/*
    Execution
*/

COUNTRY_STATS_BACK_BUTTON.setAttribute('width' , BACK_BUTTON_SIZE);
COUNTRY_STATS_BACK_BUTTON.setAttribute('height', BACK_BUTTON_SIZE);

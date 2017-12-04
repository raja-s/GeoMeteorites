
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

// var mat = new THREE.MeshPhongMaterial();
// mat.map = new THREE.TextureLoader().load(
//          "frequencyByCountry.jpeg");
//
//
// // mat.transparent = true;
// // mat.side = THREE.DoubleSide;
// // mat.depthWrite = false;
// // mat.color = new THREE.Color(0xff0000);
// let sphere = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32),
//     mat);



    // new THREE.Mesh(
    //   new THREE.SphereGeometry(0.5, 32, 32),
    //   new THREE.MeshPhongMaterial({
    //     map: THREE.TextureLoader('frequency_by_country.jpeg')
    //       })
    // );


// SCENE.add(sphere);
//
// render();
//


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




//------------------------Create globe with statistics-------------------------


// let color_domain =[0, 33, 145,631, 2991,22097];
// let ext_color_domain = [0, 33, 145,631, 299122097]
// let legend_labels = ["< 33", "33+", "145+", "631+", "2991+"]
// let color = d3.scaleThreshold()
//   .domain(color_domain)
//   .range(['#f1eef6','#bdc9e1','#74a9cf','#2b8cbe','#045a8d']);
//



// let color = d3.scaleLinear()
//   .domain([0, 22097])
//   .clamp(true)
//   .range(['#f1eef6', '#045a8d']);
//
//
//
// //let mapLayer = g.append('g')
//     //.classed('map-layer', true);
//
// let width2=400;
// let height2=400;
//
//
// // let height2 = 700;
// // let width2 = 1000;
//
// let radius = height2 / 2 - 5,
//     scale = radius,
//     velocity = .02,
//     margin = { top: 300, right: 300, bottom: 60, left: 30 };
//
// let projection = d3.geoOrthographic()
//        .translate([width2 / 2, height2/2])
//        .scale(scale)
//        .clipAngle(90);
//
//
// let svg2 = d3.select("#FrequencyByCountry").append("svg")
//                .attr("align","center")
//                .attr("width", width2/2+ margin.left + margin.right)
//                .attr("height", height2+ margin.left + margin.right);
//
//
//
// let sphere2 = {type: 'Sphere'};
//
//
//
// // let drag = d3.drag()
// // 			.on("start", dragstarted)
// // 			.on("drag", dragged)
// // 			.on("end", dragended);
// //
// //
// //       svg2.call(drag);
//
//
// let path = d3.geoPath()
//              .projection(projection);
//
// let graticule2 = d3.geoGraticule();
//
// let grid = graticule2();
//
//
// d3.json('viz/geojson/world_meteorites.geojson', function(error, world) {
//      if (error) throw error;
// //
//   let countries2 = world.features;
//
//   //Add outer circle
//  let outerCircle = svg2
//          .append('path')
//            .datum(sphere2)
//            .attr('d', path)
//            .attr('fill', 'none')
//            .attr('stroke', 'grey')
//            .attr('stroke-width', 1);
//
//    //Add graticule
//  let gridlines = svg2.selectAll('.grid')
//                 .data([grid])
//                 .enter()
//                 .append('path')
//                 .attr('d', path)
//                 .attr('fill', 'none')
//                 .attr('stroke', 'grey')
//                 .attr('stroke-width', .5);
//
//
// //Add countries
//   let globe = svg2.selectAll('.countries')
//                 .data(countries2)
//                 .enter()
//                 .append('path')
//                 .attr('d', path)
//                 .attr("class","country")
//                 .attr('fill', fillColor)
//                 .attr('stroke', 'grey')
//                 .attr('stroke-width', 1)
//
//
// //Get Mean mass
// function meanMass(d) {
//   return d && d.properties ? d.properties.meanmass:0;
// }
//
//
// //Color depending on data
// function fillColor(d) {
//   return color(meanMass(d));
// }
//
//
//
//
//
// });
// //
//
//
//
//Adding legend for our Choropleth

  // let legend = svg2.selectAll(".legend")
  // .data(ext_color_domain)
  // .enter().append("g")
  // .attr("class", "legend");
  //
  // var ls_w = 20, ls_h = 20;
  //
  // legend.append("rect")
  // .attr("x", 20)
  // .attr("y", function(d, i){ return width2 - (i*ls_h) - 2*ls_h;})
  // .attr("width", ls_w)
  // .attr("height", ls_h)
  // .style("fill", function(d, i) { return color(d); })
  // .style("opacity", 0.8);
  //
  // legend.append("text")
  // .attr("x", 50)
  // .attr("y", function(d, i){ return width2 - (i*ls_h) - ls_h - 4;})
  // .text(function(d, i){ return legend_labels[i]; });

// let to_radians = Math.PI / 180;
// let to_degrees = 180 / Math.PI;
//
//
// // Helper function: cross product of two vectors v0&v1
// function cross(v0, v1) {
//     return [v0[1] * v1[2] - v0[2] * v1[1], v0[2] * v1[0] - v0[0] * v1[2], v0[0] * v1[1] - v0[1] * v1[0]];
// }
//
// //Helper function: dot product of two vectors v0&v1
// function dot(v0, v1) {
//     for (var i = 0, sum = 0; v0.length > i; ++i) sum += v0[i] * v1[i];
//     return sum;
// }
//
// // Helper function:
// // This function converts a [lon, lat] coordinates into a [x,y,z] coordinate
// // the [x, y, z] is Cartesian, with origin at lon/lat (0,0) center of the earth
// function lonlat2xyz( coord ){
//
// 	let lon = coord[0] * to_radians;
// 	let lat = coord[1] * to_radians;
//
// 	let x = Math.cos(lat) * Math.cos(lon);
//
// 	let y = Math.cos(lat) * Math.sin(lon);
//
// 	let z = Math.sin(lat);
//
// 	return [x, y, z];
// }
//
// function quaternion(v0, v1) {
//
// 	if (v0 && v1) {
//
// 	    var w = cross(v0, v1),  // vector pendicular to v0 & v1
// 	        w_len = Math.sqrt(dot(w, w)); // length of w
//
//         if (w_len == 0)
//         	return;
//
//         var theta = .5 * Math.acos(Math.max(-1, Math.min(1, dot(v0, v1)))),
//
// 	        qi  = w[2] * Math.sin(theta) / w_len;
// 	        qj  = - w[1] * Math.sin(theta) / w_len;
// 	        qk  = w[0]* Math.sin(theta) / w_len;
// 	        qr  = Math.cos(theta);
//
// 	    return theta && [qr, qi, qj, qk];
// 	}
// }
//
//
//
//
// function euler2quat(e) {
//
// 	if(!e) return;
//
//     let roll = .5 * e[0] * to_radians,
//         pitch = .5 * e[1] * to_radians,
//         yaw = .5 * e[2] * to_radians,
//
//         sr = Math.sin(roll),
//         cr = Math.cos(roll),
//         sp = Math.sin(pitch),
//         cp = Math.cos(pitch),
//         sy = Math.sin(yaw),
//         cy = Math.cos(yaw),
//
//         qi = sr*cp*cy - cr*sp*sy,
//         qj = cr*sp*cy + sr*cp*sy,
//         qk = cr*cp*sy - sr*sp*cy,
//         qr = cr*cp*cy + sr*sp*sy;
//
//     return [qr, qi, qj, qk];
// }
//
//
// function quatMultiply(q1, q2) {
// 	if(!q1 || !q2) return;
//
//     var a = q1[0],
//         b = q1[1],
//         c = q1[2],
//         d = q1[3],
//         e = q2[0],
//         f = q2[1],
//         g = q2[2],
//         h = q2[3];
//
//     return [
//      a*e - b*f - c*g - d*h,
//      b*e + a*f + c*h - d*g,
//      a*g - b*h + c*e + d*f,
//      a*h + b*g - c*f + d*e];
//
// }
//
// function quat2euler(t){
//
// 	if(!t) return;
//
// 	return [ Math.atan2(2 * (t[0] * t[1] + t[2] * t[3]), 1 - 2 * (t[1] * t[1] + t[2] * t[2])) * to_degrees,
// 			 Math.asin(Math.max(-1, Math.min(1, 2 * (t[0] * t[2] - t[3] * t[1])))) * to_degrees,
// 			 Math.atan2(2 * (t[0] * t[3] + t[1] * t[2]), 1 - 2 * (t[2] * t[2] + t[3] * t[3])) * to_degrees
// 			]
// }
//
//
//
//
// function eulerAngles(v0, v1, o0) {
//
// 	/*
// 		The math behind this:
// 		- first calculate the quaternion rotation between the two vectors, v0 & v1
// 		- then multiply this rotation onto the original rotation at v0
// 		- finally convert the resulted quat angle back to euler angles for d3 to rotate
// 	*/
//
// 	let t = quatMultiply( euler2quat(o0), quaternion(lonlat2xyz(v0), lonlat2xyz(v1) ) );
// 	return quat2euler(t);
// }










// let gpos0, o0;
//
// function dragstarted(){
//
// 	gpos0 = projection.invert(d3.mouse(this));
// 	o0 = projection.rotate();
//
// 	svg2.insert("path")
//              .datum({type: "Point", coordinates: gpos0})
//              .attr("class", "point")
//              .attr("d", path);
// }
//
// function dragged(){
//
// 	let gpos1 = projection.invert(d3.mouse(this));
//
// 	o0 = projection.rotate();
//
// 	let o1 = eulerAngles(gpos0, gpos1, o0);
// 	projection.rotate(o1);
//
// 	// svg.selectAll(".point")
// 	//  		.datum({type: "Point", coordinates: gpos1});
//   svg2.selectAll("path").attr("d", path);
//
// }
//
// function dragended(){
// 	svg2.selectAll(".point").remove();
// }
//


















//----------------Mean mass by country-------------------------------------


//
// //Define barchart margins
// let margin = {top: 20, right: 40, bottom: 70, left: 80};
// let chartwidth = 600 - margin.left - margin.right;
// let chartheight = 600 - margin.top - margin.bottom;
//
//
// let svg= d3.select('#FrequencyByCountry');
//
// let g = svg.append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// //Define scales
// let y = d3.scaleBand()
//           .range([chartheight,0]);
//
//
//
// let x = d3.scaleLinear()
//                 .range([0,chartwidth]);
//
//
//
//
// d3.csv("states.csv", function(error, data) {
//  if(error) throw error;
//
//     data.forEach(function(d) {
//         d.Country = d.Country;
//         d.Population = +d.Population;
// });
//       	//define domains based on data
//       	x.domain([0, d3.max(data, function(d) { return d.Population; })]);
//       	y.domain(data.map(function(d) { return d.Country; }));
//
//         //Define axis
//         let xAxis = d3.axisBottom(x);
//         let yAxis = d3.axisLeft(y);
//
//       	//append x axis to svg
//       	g.append("g")
//       		.attr("class", "x-axis")
//       		.attr("transform", "translate(0," + chartheight + ")")
//       		.call(xAxis)
//       		.append("text")
//       		.attr("y", 30)
//       		.attr("x", 650)
//       		.attr("dy", "0.5em")
//       		.style("fill", "black")
//       		.text("Mass [gr]");
//
//       	//append y axis to svg
//       	g.append("g")
//       		.attr("class", "y-axis")
//       		.call(yAxis);
//
//       	//append rects to svg based on data
//       	g.selectAll(".bar")
//       		.data(data)
//       		.enter()
//       		.append("rect")
//       		.attr("class", "bar")
//       		.attr("x", 0)
//       		.attr("y", function(d) { return y(d.Country); })
//           .attr('height',y.bandwidth())
//       		.attr("width", function(d) { return x(d.Population); })
//       		.style("fill", "brown");
//
//
//     });
//



//---------------Frequency by element-------------------------------------

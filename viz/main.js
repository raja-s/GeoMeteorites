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
let width2 = document.getElementById("mapArea").clientWidth,
    height2 = document.getElementById("mapArea").clientHeight;

//Define radius and scale of the globe
let radius = height2 / 2 - 10,
    scale = radius;

//Define projection of the globe
let projection = d3.geoOrthographic()
    .translate([width2 / 2, height2 / 2])
    .scale(scale)
    .clipAngle(90); //Where to clip


//Append svg to div mapArea
let svg2 = d3.select("#mapArea").append("svg")
        .attr("width", width2)
        .attr("height", height2);

//Define sphere and graticule
let sphere = {type: 'Sphere'},
graticule = d3.geoGraticule();

//Path
let path = d3.geoPath()
    .projection(projection);

//Name the graticule as grid (called when we create gridlines)
let grid = graticule();




//Get the json file with countries + rotation + circle around globe + graticule
let url = "https://unpkg.com/world-atlas@1/world/110m.json";

    d3.json(url, function(error, world) {
      if (error) throw error;

    //Get countries
    let countries = topojson.feature(world, world.objects.countries);

    //Add outer circle
    let outerCircle = svg2
          .append('path')
            .datum(sphere)
            .attr('d', path)
            .attr('fill', 'none')
            .attr('stroke', 'grey')
            .attr('stroke-width', 1);

    //Add graticule
    let gridlines = svg2.selectAll('.grid')
                  .data([grid])
                  .enter()
                .append('path')
                  .attr('d', path)
                  .attr('fill', 'none')
                  .attr('stroke', 'grey')
                  .attr('stroke-width', .5);

    //Add countries
    let globe = svg2.selectAll('.countries')
                  .data([countries])
                  .enter()
                .append('path')
                  .attr('d', path)
                  .attr("class","country")
                  .attr('fill', 'black')
                  .attr('stroke', 'white')
                  .attr('stroke-width', 1)


        //Rotate
        rotation();


});

// Rotation variables
let time = Date.now(),
rotate = [0, 0],
velocity = [.009, -0];


function rotation(){
   d3.timer(function() {

      // DeltaT
      let dt = Date.now() - time;

      // Get the new position from modified projection function
      projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);

      // Update countries position
      svg2.selectAll("path").attr("d", path);
   });

}

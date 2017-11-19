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

var width2 = document.getElementById("mapArea").clientWidth,
    height2 = document.getElementById("mapArea").clientHeight;

var radius = height2 / 2 - 10,
    scale = radius,
    velocity = .01;

var projection = d3.geoOrthographic()
    .translate([width2 / 2, height2 / 2])
    .scale(scale)
    .clipAngle(90);



var canvas = d3.select("#mapArea").append("canvas")
    .attr("width", width2)
    .attr("height", height2)
    .attr("fill","white");

var context2 = canvas.node().getContext("2d");

var path = d3.geoPath()
    .projection(projection)
    .context(context2);


var graticule = d3.geoGraticule();


//Get the json file with countries + rotation + circle around globe + graticule
var url = "https://unpkg.com/world-atlas@1/world/110m.json";

    d3.json(url, function(error, world) {
      if (error) throw error;

      //Get countries
      var countries = topojson.feature(world, world.objects.countries);


      d3.timer(function(elapsed) {




        //Remove rectangles of movements
        context2.clearRect(0, 0, width2, height2);

        //Rotation
        projection.rotate([velocity * elapsed, 0]);

        //Add countries
        context2.beginPath();
        path(countries);
        context2.strokeStyle = "white";
        context2.lineWidth = .3;
        context2.fill();
        context2.stroke();

        //Add circle aaround the globe
        context2.beginPath();
        context2.arc(width2 / 2, height2 / 2, radius, 0, 2 * Math.PI, true);
        context2.strokeStyle = "black";
        context2.lineWidth = 2.5;
        context2.stroke();

        //Add graticule
        context2.beginPath();
        path(graticule());
        context2.strokeStyle = "grey";
        context2.lineWidth = .3;
        context2.stroke();



      });
    });

    d3.select(self.frameElement).style("height", height2 + "%");

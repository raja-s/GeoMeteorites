
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

    let tmpMapMode = document.getElementById("mapMode");
    let mapMode = tmpMapMode.options[tmpMapMode.selectedIndex].value;
    let country = document.getElementById("country").value;
    let minMass = document.getElementById("minMass").value;
    let maxMass = document.getElementById("maxMass").value;
    let [startYear, endYear] = getTimeRange();
    let speedFactor = document.getElementById("speedFactor").value;

};

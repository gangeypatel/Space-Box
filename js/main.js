var dataArr = []
var newArray = []
var secondArray = []
var margin = { top: 40, right: 40, bottom: 40, left: 40 }
var width = 1000 - margin.left - margin.right
var height = 1000 - margin.top - margin.bottom;
var svg, x, y, xaxis, yaxis, zaxis;
var color = d3.scaleOrdinal().domain([1, 2, 3, 4]).range(["#619CFF", "#FDB863", "#F8766D", "#00BA38"]);
var size, Tooltip, Block;
var checkbox = document.getElementById("checkbox");
document.addEventListener('DOMContentLoaded', function () {

    Promise.all([d3.csv('data/cleaned_5250.csv')]).then(function (value) {
        dataArr = value[0];
        datawrangforearth();
        isChecked();

    })
});

function datawrangforearth() {

    const groupedPlanets = dataArr.reduce((groups, dataArr) => {
        const planetType = dataArr.planet_type;
        if (!groups[planetType]) {
            groups[planetType] = [];
        }
        groups[planetType].push(dataArr);
        return groups;
    }, {});
    Object.entries(groupedPlanets).forEach(d => {
        var dv = d[1].filter(obj => obj.mass_wrt === 'Earth');
        if(d[1].length > 5){
            secondArray.push([d[0], dv.slice(0,30)]);
        }
        
    });

    console.log(secondArray);

    const group1Objects = dataArr.filter(obj => obj.planet_type === 'Gas Giant' && obj.mass_wrt === 'Earth').slice(0, 30);
    const group2Objects = dataArr.filter(obj => obj.planet_type === 'Neptune-like' && obj.mass_wrt === 'Earth').slice(0, 30);
    const group3Objects = dataArr.filter(obj => obj.planet_type === 'Super Earth' && obj.mass_wrt === 'Earth').slice(0, 30);
    const group4Objects = dataArr.filter(obj => obj.planet_type === 'Terrestrial' && obj.mass_wrt === 'Earth').slice(0, 30);

    newArray = [...group1Objects, ...group2Objects, ...group3Objects, ...group4Objects];
    console.log(newArray);

}

function svgandaxis() {
    d3.selectAll(".datablock").remove();
    svg = d3.selectAll("#svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    x = d3.scaleOrdinal()
        .range([100, 300, 500, 700])
        .domain([1, 2, 3, 4, 5]);

    size = d3.scaleLinear()
        .domain([0, 35])
        .range([10, 45]);

    Tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .style("z-index", 1)
        .attr("class", "tooltip")
        .style("background-color", "#14213d")
        .style("color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("position", "absolute")
        .style("width", "120px")

    xaxis = d3.scaleLinear().domain([0, 100]).range([0, width]);
    yaxis = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    zaxis = d3.scaleLinear().domain([0, 20]).range([4, 40]);

    svgforlegends = d3.selectAll("#infoblock").append("svg").attr("class", "datablock")

    svgforlegends.append("circle")
        .attr("cx", 10)
        .attr("cy", 40)
        .attr("r", 9)
        .style("fill", "#619CFF")
        .style("stroke", "black")

    svgforlegends.append("circle")
        .attr("cx", 10)
        .attr("cy", 80)
        .attr("r", 9)
        .style("fill", "#FDB863")
        .style("stroke", "black")

    svgforlegends.append("circle")
        .attr("cx", 10)
        .attr("cy", 120)
        .attr("r", 9)
        .style("fill", "#F8766D")
        .style("stroke", "black")

    svgforlegends.append("circle")
        .attr("cx", 10)
        .attr("cy", 160)
        .attr("r", 9)
        .style("fill", "#00BA38")
        .style("stroke", "black")

    svgforlegends.append("text").attr("x", 40).attr("y", 40).text("Gas Giant planets").style("font-size", "18px").attr("alignment-baseline", "middle").style("fill", "white")
    svgforlegends.append("text").attr("x", 40).attr("y", 80).text("Neptune-like planets").style("font-size", "18px").attr("alignment-baseline", "middle").style("fill", "white")
    svgforlegends.append("text").attr("x", 40).attr("y", 120).text("Super Earth planets").style("font-size", "18px").attr("alignment-baseline", "middle").style("fill", "white")
    svgforlegends.append("text").attr("x", 40).attr("y", 160).text("Terrestrial planets").style("font-size", "18px").attr("alignment-baseline", "middle").style("fill", "white")

    svgforlegends.append("div").text("Yo")

}

function drawfirstchart() {

    color = d3.scaleOrdinal()
        .domain([1, 2, 3, 4])
        .range(["#619CFF", "#FDB863", "#F8766D", "#00BA38"]);
    d3.selectAll(".datablock").remove();
    svgandaxis();
    d3.selectAll(".types").remove();
    d3.selectAll(".ttypes").remove();
    const node = svg
        .selectAll("circle")
        .data(newArray)
        .enter()
        .append("circle")
        .attr("class", "circles")
        .attr("r", function (d) { return (size(d['mass_multiplier'] * 2)) })
        .attr("cx", width)
        .attr("cy", height / 2)
        .style("fill", function (d) { return color(d['planet_type']) })
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 4)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        )
        .on("click", function (event, d) {
            d3.selectAll(".circles").style("opacity", 0);
            d3.select(this).transition().duration(200)
                .attr("r", function (d) { return (size(d['mass_multiplier'] * 4)) })
                .style("fill-opacity", 1)
                .attr("stroke", "black")
                .attr("left", width / 2)
                .attr("top", height / 2)
                .style("opacity", 1)
                .style("z-index", 1);
            
            Tooltip.style("opacity", 1).style("width", "400px").style("background-color", "#a8dadc").style("color", "#1d3557")
                .html("Hi , My name is " + "<u>" + d['name'] + "</u>" + " and I am from the family of <u>" + d['planet_type'] + " </u> planets ," +
                    " I am <u>" + d['distance'] + "</u> lightyears far from earth." +
                    " and my mass is <u>" + d['mass_multiplier'] + "</u> times that of <u>" + d['mass_wrt'] + "</u>. my orbital radius is <u>" + d['orbital_radius'] + "</u> and my orbital period is <u>" + d['orbital_period'] + "</u> days. NASA found me on <u>" + d['discovery_year'] + " </u>. See you guys soon!.")
        })

        .on("mouseover", function (event, d) {
            d3.select(this).transition().duration(1000).attr("r", function (d) { return (size(d['mass_multiplier'] * 2)) });
            d3.select(this).attr("stroke", "black");
            Tooltip.style("opacity", 1).style("width", "120px")
                .html('<u>' + "click me" + '</u>' + "<br>")

        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition().duration(200)
                .attr("r", function (d) { return (size(d['mass_multiplier'] * 2)) })
                .style("fill", function (d) { return color(d['planet_type']) })
                .style("fill-opacity", 0.8);
            Tooltip
                .style("background-color", "#14213d")
                .style("color", "white").style("opacity", 0);
            d3.selectAll(".circles").style("opacity", 1).attr("stroke", "black");

        })
        .on("mousemove", function (event, d) {
            d3.select(this).style("fill", function (d) { return color(d['planet_type']) })
            Tooltip
                .style("left", (event.x + 10) + "px")
                .style("top", (event.y) + "px")
    
        })

    var simulation = d3.forceSimulation()
        .force("x", d3.forceX().strength(0.1).x(function (d) { return x(width / 2) }))
        .force("y", d3.forceY().strength(0.1).y(width / 2))
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) 
        .force("charge", d3.forceManyBody().strength(.1))
        .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (size(d['mass_multiplier'] * 2)) + 10 }).iterations(1)) // Force that avoids circle overlapping


    simulation
        .nodes(newArray)
        .on("tick", function (d) {
            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
        });


    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
        Tooltip.style("opacity", 0)
    }
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
        Tooltip.style("opacity", 0)
    }
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
        Tooltip.style("opacity", 0)
    }
}

function drawsecondchart() {
    color = d3.scaleOrdinal()
        .domain([1, 2, 3, 4])
        .range(["#619CFF", "#FDB863", "#F8766D", "#00BA38"]);

    svgandaxis();
    d3.selectAll(".circles").remove();
    d3.selectAll(".ttypes").remove();
    var node = svg
        .selectAll("circle")
        .data(secondArray)
        .enter()
        .append("circle")
        .attr("class", "types")
        .attr("r", 80)
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", function (d) { return color(d[0]) })
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 4)
        .call(d3.drag() 
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("click", function (event, d) {
            d3.select(this).transition().duration(1000)
                .attr("r", height)
                .attr("z-index", 1)
                .style("fill-opacity", 0)
                .attr("left", width / 2)
                .attr("top", height / 2)
                .style("opacity", 1);
            d3.selectAll(".types").attr("z-index", -4)

            d3.selectAll(".types").remove();

            Tooltip.style("opacity", 0);
            thirdchart(d);
        })
        .on("mouseout", function (event, d) {

            d3.select(this).transition().duration(1000)
                .attr("r", 80)
                .style("fill", function (d) { return color(d[0]) })
                .style("fill-opacity", 0.8)
                .style("stroke", "black");
            Tooltip.style("opacity", 0);
            d3.selectAll(".types").style("opacity", 1).attr("stroke", "black");
            d3.selectAll("#xAxis").remove();
            d3.selectAll("#yAxis").remove();
            d3.selectAll(".bubbles").remove();

        })
        .on("mouseover", function (event, d) {
            d3.select(this).transition().duration(1000).attr("r", 80 * 1.5);
            d3.select(this).attr("stroke", "black");
           

        })
        .on("mousemove", function (event, d) {
            Tooltip.style("left", (event.x + 20) + "px")
                .style("top", (event.y) + "px")
        });

    
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX().strength(0.5).x(function (d) { return x(d[0]) }))
        .force("y", d3.forceY().strength(0.1).y(height / 2))
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) 
        .force("charge", d3.forceManyBody().strength(1)) 
        .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (d[0]) + 15 }).iterations(1)) 
    simulation
        .nodes(secondArray)
        .on("tick", function (d) {
            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
        });

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
        d3.select(".tooltip").style("opacity", 0);
    }
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    }

}
function isChecked() {

    var div = document.getElementById("instructions");
    if (!checkbox.checked) {
        d3.selectAll("#xAxis").remove();
        d3.selectAll("#yAxis").remove();
        d3.selectAll(".bubbles").remove();
        d3.selectAll(".types").remove();
        drawsecondchart();
        div.innerHTML = "<ul><li>Click on the toggle upwards to see the graph planetwise or Catagorywise. </li><li>In this graph, there are 4 catagories, click on any catagory and a bubble chart would pop up!</li><li>The <u>bubble chart</u> shows planets of the same type, Y axis shows the <u>year in which planet was founded</u>, X axis the <u>distance from earth</u> & size is based on the <u>stellar magnitude of the planet</u></li><li>To exit bubble chart, click on Reset graph button</li><li>Play all you like!!!</li></ul> ";
    }
    else {
        d3.selectAll("#xAxis").remove();
        d3.selectAll("#yAxis").remove();
        d3.selectAll(".bubbles").remove();
        d3.selectAll(".types").remove();
        drawfirstchart();
        div.innerHTML = "<ul><li>Click on the toggle upwards to see the graph planetwise or Catagorywise. </li><li>In this graph, radius is based upon mass of the planet</li><li>Click on any planet and it will give you its introdution.</li><li>Play all you like!!!</ul>";
    }
}

function thirdchart(arr) {

    var modifiedarr = [];
    arr[1].forEach(d => {
        modifiedarr.push([d['name'], parseFloat(d['distance']), parseInt(d['discovery_year']), parseFloat(d['stellar_magnitude']), arr[0]])
    })

    const maxDistance = getMaxAtIndex(modifiedarr, 1);
    const maxYear = getMaxAtIndex(modifiedarr, 2);
    const minYear = getMinAtIndex(modifiedarr, 2);

    //console.log(modifiedarr);
    d3.selectAll("#xAxis").remove();
    d3.selectAll("#yAxis").remove();
    d3.selectAll(".bubbles").remove();

    svgandaxis();

    xaxis.domain([0, maxDistance + 100])
    yaxis.domain([minYear - 2, maxYear + 6])

    svg.append("g")
        .attr("id", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .transition().duration(1000)
        .call(d3.axisBottom(xaxis));

    svg.append("g").attr("id", "yAxis")
        .transition().duration(1000)
        .call(d3.axisLeft(yaxis));

    bubbles = svg
        .selectAll("circle")
        .data(modifiedarr)
        .enter()
        .append("circle")
        .transition().duration(1000)
        .attr("class", "bubbles")
        .attr("cx", function (d) { return xaxis(d[1]); })
        .attr("cy", function (d) { return yaxis(d[2]); })
        .attr("r", function (d) { return zaxis(d[3]); })
        .style("fill", function (d) { return color(d[4]); })
        .style("fill-opacity", 0.8)
        .style("stroke", "black")

    bubbles = svg
        .selectAll("text.ttypes")
        .data(modifiedarr)
        .enter()
        .append("text")
        .transition().duration(1000)
        .attr("class", "ttypes")
        .attr("x", function (d) { return xaxis(d[1]) - 40; })
        .attr("y", function (d) { return yaxis(d[2]) + zaxis(d[3]) + 10 })
        .text(function (d) { return d[0]; })
        .style("fill", "white")
        .style("font-size", 10)
        .style("font-weight", "normal")
        .style("font-family", "sans-serif")

}


function getMaxAtIndex(arrays, index) {
    let max = arrays[0][index];
    for (let i = 1; i < arrays.length; i++) {
        if (arrays[i][index] > max) {
            max = arrays[i][index];
        }
    }
    return max;
}
function getMinAtIndex(arrays, index) {
    let min = arrays[0][index];
    for (let i = 1; i < arrays.length; i++) {
        if (arrays[i][index] < min) {
            min = arrays[i][index];
        }
    }
    return min;
}

function buttonisclicked() {

    if (!checkbox.checked) {

        d3.selectAll("#xAxis").remove();
        d3.selectAll("#yAxis").remove();
        d3.selectAll(".bubbles").remove();
        d3.selectAll(".types").remove();
        d3.selectAll(".ttypes").remove();
        drawsecondchart();
    }
    else {
        d3.selectAll(".circles").remove();
        drawfirstchart();
    }
}

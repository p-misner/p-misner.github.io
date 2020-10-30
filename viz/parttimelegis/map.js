// import {legend} from "@d3/color-legend"
// topojson = require("topojson-client@3")
// d3 = require("d3@5")

var margin = {top: 20, left: 20, right: 20, bottom:20};
var height = 600 - margin.top - margin.bottom;
var width = 1000- margin.left - margin.right;
var svg = d3.select("#map")
	.attr("viewBox", [0, 0, width + margin.right + margin.left, height+ margin.top + margin.bottom])
	.style("background-color", "none");
var div = d3.select("body").append("div")
	.attr("class", "tooltip map")
	.style("opacity", 1);

//variables for heatmap
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
years = ['2019', '2018','2017', '2016', '2015', '2014'];
states = ['Alaska', 'Alabama', 'Arkansas', 'Arizona', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Iowa', 'Idaho', 'Illinois', 'Indiana', 'Kansas', 'Kentucky', 'Louisiana', 'Massachusetts', 'Maryland', 'Maine', 'Michigan', 'Minnesota', 'Missouri', 'Mississippi', 'Montana', 'North Carolina', 'North Dakota', 'Nebraska', 'New Hampshire', 'New Jersey', 'New Mexico', 'Nevada', 'New York', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Virginia', 'Vermont', 'Washington', 'Wisconsin', 'West Virginia', 'Wyoming'];

//variables for heatmap tooltip
var hheight = 120;
var hwidth = 200;
var hmargin = {top: 20, left: 40, right: 20, bottom:20};



var htooltip = d3.select("#htooltip")
	.append("div")
	.style("opacity", 0)
	.attr("class", "tooltip")
	.style("background-color", "white")
	.style("border", "solid")
	.style("border-width", "2px")
	.style("border-radius", "5px")
	.style("padding", "5px");
var mouseover = function(d) {
	htooltip.style("opacity", 1);
}
var mousemove = function(d) {
	htooltip
	  .html("Number of Days Legislative Meets: " + d.Value)
	  .style("left", (d3.event.pageX -20) + "px")
	  .style("top", (d3.event.pageY +15) + "px");
}
var mouseleave = function(d) {
	htooltip.style("opacity", 0);
}

//intialize map
var map = d3.map();

//scales
var myColor = d3.scaleLinear().domain([1,2,3]) 	//color scale for the map
  .range(["#043691", "#707173", "#f5ca0a"]);
var colorScale = d3.scaleLinear() //color scale for heatmap
		.range(["white", "darkblue"])
		.domain([0,31]);

var x = d3.scaleBand()
			.range([0, hwidth])
			.domain(months)
			.padding(0.1);
var y = d3.scaleBand()
			.range([0, hheight-20])
			.domain(years)
			.padding(0.1);

//loading in data
var files = ["https://raw.githubusercontent.com/p-misner/100daysofvisualization/master/viz004/data/states-albers-10m.json", "./data/stateterm.json","./data/legislativesessions.csv" ];
var promises = [
	d3.json(files[0]),
	d3.json(files[1], d=>{
	}),
	d3.csv(files[2])
];

files.forEach(function(url,i) {
	if(i == 2){
		promises.push(d3.csv(url));
	} else {
		promises.push(d3.json(url));
	}
    
});

Promise.all(promises).then(function([values, statedata,heatdata]){
	statedata.forEach(d =>{
		map.set(d.states,d.mort)
	})
	//set up for heatmaps



	//state areas
	svg.append("g")
	.selectAll("path")
	.data(topojson.feature(values, values.objects.states).features)
	.join("path")
		.attr("fill", d=> {return myColor(map.get(d.properties.name))})
		.attr("id",d => {return d.properties.name.replace(/\s/g, '')})
		.attr("d", d3.geoPath())
		// .attr("class", "state")
		.on("mouseover", d=>{
			d3.select(`#${d.properties.name.replace(/\s/g, '')}`).style("opacity", 0.8);
			div.transition()
				.duration(200)
				.style("opacity", 0.99);
			div.html(`<h3> ${d.properties.name}</h3><h4> ${returnTerm(map.get(d.properties.name))} Legislature</h4><p class="heatholder">When Legislature is in Session </p><svg id="holder"></svg>`)
				.style("left", (d3.event.pageX +15 ) +"px")
				.style("top", (d3.event.pageY +15 )+"px")
				.style("box-shadow", "10px 10px 5px rgba(0,0,0,0.2)")
				.style("text-align", "center");

			drawHeatmap(d.properties.name);
		})
		.on("mousemove",()=> {
			div.style("left", (d3.event.pageX + 15 ) +"px")
				.style("top", (d3.event.pageY +15 )+"px")
		})
		.on("mouseout", d =>{
			d3.select(`#${d.properties.name.replace(/\s/g, '')}`).style("opacity", 1);

			div.transition()
				.duration(200)
				.style("opacity", 0);
			d3.selectAll("#holder").remove("svg");
		});

	//state boundaries
	var oldpath = svg.append("path")
      .datum(topojson.mesh(values, values.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "#ffffff")
      .attr("stroke-linejoin", "round")
      .attr("d", d3.geoPath());

     function drawHeatmap(state){
		// var row = 5;
		// var col = 18;
		// var ix = i%row ;
		// var iy = Math.floor(i/row) ;
		//building scales
		
		d3.select("#holder").append("g")
			.attr("transform","translate("+(hmargin.left)+","+(110)+")")
			.call(d3.axisBottom(x).tickValues(months).tickFormat((d)=>{return d.slice(0,1)}));

		

		//adding squares
		d3.select("#holder").selectAll()
			.data(heatdata.filter(d=>{return d["State"] == state}))
			.enter()
			.append("rect")
				.attr("x", d=>{return (hmargin.left+x(d["Month"]))})
				.attr("y", d=>{return 10+y(d["Year"])})
				.attr("width", x.bandwidth())
				.attr("height", y.bandwidth())
				.style("fill", d=>{return colorScale(d["Value"])})
				.style("stroke","rgba(0,0,0,0.5)" )
				.style("opacity", 0.9)
				.on("mouseover", mouseover)
				.on("mousemove", mousemove)
				.on("mouseleave", mouseleave);
		// labels
		d3.select("#holder").append("g")
			.attr("transform","translate("+(hmargin.left)+","+(10)+")")
			.call(d3.axisLeft(y).ticks(5).tickValues(years).tickFormat((d=>{return d.slice(0,4)})));
		
		// d3.select("#holder").append("text")
		// 	.text(`${state}`)
		// 	.attr("x", hwidth )
		// 	.attr("y", hmargin.top)
		// 	.style("text-anchor","middle")
		// 	.style("font-family", "sans-serif");

	}

}).catch((err) => console.log(err));


function returnTerm(num){
	switch(parseInt(num)){
		case 1:
			return "Full-Time";
			break;
		case 2:
			return "Hybrid";
			break;
		case 3:
			return "Part-Time";
			break;
	}

}

/* 

LEGEND
*/

	 	

var legend = d3.select("#legend")
	.style("width", "600px")
	.style("height", "100px")
	.style("margin-bottom", "10px")
	.append("g")
	.attr('class', 'circles');
legend.append("rect")
	 	.attr("width", 25)
	 	.attr("height", 25)
	 	.attr("y", 15)
	 	.attr("x", 120)
	 	.attr("fill", "#043691");
legend.append("text")
	 	.attr("x",150)
	 	.attr("y", 33)
	 	.text("Full Time Legislature")
	 	.attr("fill", "black")
	 	.style('font-size', '14px');
legend.append("rect")
	 	.attr("width", 25)
	 	.attr("height", 25)
	 	.attr("y", 15)
	 	.attr("x", 310)
	 	.attr("fill", "#707173");
legend.append("text")
	 	.attr("x", 340)
	 	.attr("y", 33)
	 	.text("Hybrid")
	 	.attr("fill", "black")
	 	.style('font-size', '14px');
legend.append("rect")
	 	.attr("width", 25)
	 	.attr("height", 25)
	 	.attr("y", 55)
	 	.attr("x", 120)
	 	.attr("fill", "#f5ca0a");
legend.append("text")
	 	.attr("x", 150)
	 	.attr("y", 73)
	 	.text("Part-Time Legislature")
	 	.attr("fill", "black")
	 	.style('font-size', '14px');






		
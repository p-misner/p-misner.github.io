var hmargin = {top: 50, left: 40, right: 20, bottom:20};
var hheight = 1200 - hmargin.top - hmargin.bottom;
var hwidth = 1200- hmargin.left - hmargin.right;

var hsvg= d3.select("#heatmap")
	.attr("viewBox", [0, 0, hwidth + hmargin.right +hmargin.left, hheight+ hmargin.top + hmargin.bottom])
	.style("background-color", "none");
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
years = ['2019', '2018','2017', '2016', '2015', '2014']
states = ['Alaska', 'Alabama', 'Arkansas', 'Arizona', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Iowa', 'Idaho', 'Illinois', 'Indiana', 'Kansas', 'Kentucky', 'Louisiana', 'Massachusetts', 'Maryland', 'Maine', 'Michigan', 'Minnesota', 'Missouri', 'Mississippi', 'Montana', 'North Carolina', 'North Dakota', 'Nebraska', 'New Hampshire', 'New Jersey', 'New Mexico', 'Nevada', 'New York', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Virginia', 'Vermont', 'Washington', 'Wisconsin', 'West Virginia', 'Wyoming']


// create a tooltip
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
	  .style("left", (d3.event.pageX) + "px")
	  .style("top", (d3.event.pageY -15) + "px");
}
var mouseleave = function(d) {
	htooltip.style("opacity", 0);
}


d3.csv("./data/legislativesessions.csv").then(function(data){
	
	//color scale
	var colorScale = d3.scaleLinear()
		.range(["white", "darkblue"])
		.domain([0,31]);
	
	for (let k=0; k < states.length; k++){
		drawHeatmap(states[k], k);

	}

	function drawHeatmap(state, i){
		var row = 5;
		var col = 18;
		var ix = i%row ;
		var iy = Math.floor(i/row) ;
		//building scales
		var x = d3.scaleBand()
			.range([0, hwidth/(row+1.25)])
			.domain(months)
			.padding(0.1);
		hsvg.append("g")
			.attr("transform","translate("+(hmargin.left + ix*hwidth/row)+","+((iy+1)*hmargin.top+((iy+1)*hheight/col))+")")
			.call(d3.axisBottom(x).tickValues(months).tickFormat((d)=>{return d.slice(0,1)}));

		var y = d3.scaleBand()
				.range([0, hheight/col])
				.domain(years)
				.padding(0.1);
		hsvg.append("g")
			.attr("transform","translate("+(hmargin.left + ix*hwidth/row)+","+((iy+1)*hmargin.top + iy*hheight/col)+")")
			.call(d3.axisLeft(y).ticks(5).tickValues(years).tickFormat((d=>{return d.slice(0,4)})));

		//adding squares
		hsvg.selectAll()
			.data(data.filter(d=>{return d["State"] == state}))
			.enter()
			.append("rect")
				.attr("x", d=>{return (hmargin.left+ix*hwidth/row+x(d["Month"]))})
				.attr("y", d=>{return (iy+1)*hmargin.top+iy*hheight/col+y(d["Year"])})
				.attr("width", x.bandwidth())
				.attr("height", y.bandwidth())
				.style("fill", d=>{return colorScale(d["Value"])})
				.style("stroke","rgba(0,0,0,0.5)" )
				.style("opacity", 0.9)
				.on("mouseover", mouseover)
				.on("mousemove", mousemove)
				.on("mouseleave", mouseleave);
		//labels
		hsvg.append("text")
			.text(`${state}`)
			.attr("x", hwidth/10 + ix*hwidth/row)
			.attr("y", (iy+0.8)*hmargin.top+iy*hheight/col )
			.style("text-anchor","middle")
			.style("font-family", "sans-serif");

	}
	

	

});





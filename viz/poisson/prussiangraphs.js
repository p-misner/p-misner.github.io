var margin = {top: 60, right:30, bottom: 40, left:40},
	width = 660 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;


//graph creation
var svg3 = d3.select("#densityv2")
	.append("svg")
	.attr("width", 1.3*width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate("+margin.left+","+margin.top+")");

d3.csv("https://raw.githubusercontent.com/p-misner/100daysofvisualization/master/viz001/kickdata.csv", function(data){

	//X scale
	let years = [];
	for(let i=1874; i<1894; i++){
		years.push((i+1).toString())
	}

	// var x = d3.scaleBand()
	// 	.domain(years)
	// 	.range([0, 1.3*width]);
	var x = d3.scaleLinear()
		.domain([75,94])
		.range([0, 1.3*width]);

	//X Axis
	svg3.append("g")
		.attr("transform","translate(0,"+ (height -margin.bottom)+")")
		.call(d3.axisBottom(x).ticks(years.length));
	//Y Scale
	var y = d3.scaleLinear()
		.domain([0,5])
		.range([(height/(data.length)),0]);
	var y2 = d3.scaleLinear()
		.domain([0,14])
		.range([(height ),0]);
	//Y Axis 
	svg3.append("g")
		.attr("transform","translate(0,"+-margin.bottom+")")
		.call(d3.axisLeft(y2).ticks(14).tickSize(1));
	// axis labels
	svg3.append("text")
		.attr("transform","rotate(-90)")
		.attr("y",-20)
		.attr("x",-width/2 -25)
		.text("Army Corps Number")
		.style("fill","black");
	svg3.append("text")
		.attr("transform","translate("+width+","+1.1*height +")")
		.attr("y",-20)
		.attr("x",-width/2 -25)
		.text("Year (1875-1894)");
	svg3.append("text")
		.attr("transform","translate("+width+","+0+")")
		.attr("y",-30)
		.attr("x",-2*width/3 - 30)
		.text("Density Chart of Prussian Soldier Deaths");
	// Creating Densities
	var keys = d3.keys(data[0]).filter(word => word != "Corps");
	console.log(data.length);
	

	for(let j = 0; j < data.length; j++){
		let matrix = [];
		for(let i = 0; i < keys.length; i++){
			matrix.push([parseInt(keys[i]), parseInt(data[j][parseInt(keys[i])])])
		}
		var lineFunction = d3.line()
				.x(d => {return x(d[0])})
				.y(d => {return y(d[1]) -margin.bottom+(height/14)*(j)})
				.curve(d3.curveCardinal.tension(0.4));
		var areaColor = d3.scaleLinear()
			.domain([0,13])
			.range(["orange","blue"]);

		svg3.append("path")
			.attr("d", lineFunction(matrix))
			.attr("fill", "none")
			.attr("stroke", d => {return areaColor(parseInt(j))})
			.attr("stroke-width", 1.5);
		var area = d3.area()
			.x(d => {return x(d[0])})
			.y0(y(0)-margin.bottom+(height/14)*j)

			.y1(d => {return y(d[1]) -margin.bottom+ (height/14)*(j)})
			.curve(d3.curveCardinal.tension(0.4));
		
		// console.log(matrix);
		svg3.append("path")
			.data(matrix)
			.attr("class","area")
			.attr("d", area(matrix))
				.attr("fill", d => {return areaColor(parseInt(j))})
				.attr("opacity","0.8");
	}
});




// Compute Kernel Density Estimation
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}


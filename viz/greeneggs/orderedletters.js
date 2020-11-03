
var margin = {top: 30, right: 90, bottom: 40, left: 20},
    width = 700 - margin.left - margin.right,
    height = 290 - margin.top - margin.bottom;

var svg = d3.select("#words")
	.style("display", "block")
	.style("margin", "auto");
var letters = svg
	.attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
	.style("background-color","transparent");
var myColor = d3.scaleLinear().domain([1,84])
  .range(["#faa278", "#0d851d"])

d3.json("./data/wordcount.json").then(function(data){
	let  cols = 5;
	let col_margin = 0;
	let col_width = parseInt((width - col_margin*cols)/cols);
	let rows = 11;


	svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("text")
      .attr("x", function (d, i) { return 10+140*calcCol(i) } )
      .attr("y", function (d, i) { return 20+24*calcRow(i); } )
      // .attr("r", function (d) { return 5; } )
      .style("fill", d=> {
        return myColor(d.Value)
      })
      .style("opacity", "1")
      .style('font-size', "24px")
      .attr("stroke", "black")
      .attr("stroke-width", "0.2px")
   //    .append("text")
   //    .attr("x",function (d, i) { return 40+50*calcCol(i) }  )
 		// .attr("y", function (d, i) { return 20+15*calcRow(i); } )
 		//  .attr("dy", ".35em")
 		//  .style("fill", "red")
    .text(function(d) { return d.Word });
	function calcCol(index){
		return (Math.floor(index/(rows)))
		}
	function calcRow(index){
		return index%rows;
	}
	});


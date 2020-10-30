var margin = {top: 80, left: 200, right: 20, bottom:0};
var height = 500 - margin.top - margin.bottom;
var width = 800- margin.left - margin.right;

var ssvg= d3.select("#scatter")
	.attr("viewBox", [0, 0, width + margin.right + margin.left, height+ margin.top + margin.bottom])
	.style("background-color", "rgba(0,0,0,0)");

// window.addEventListener('resize', setViewBox);
// function setViewBox(){
// 	var viewbox = document.querySelector('svg').getAttribute('viewBox');
// 	console.log(viewbox);
// }

var sdiv = d3.select("body").append("div")
	.attr("class", "tooltip scatter")
	.style("opacity", 1);

var staff = true;

d3.csv("./data/table.csv").then(function(data){
	ssvg.append("g")
		.attr("transform","translate("+margin.left+","+margin.top+")");
	
	var days_col = [];
	data.forEach((d,i)=>{
		days_col[i] = +d['Days in session 2019']
	});
	var staff_col=[];
	data.forEach((d,i)=>{
		staff_col[i] = +d['Staff Size (2015)']
	});
	var salary_col=[];
	data.forEach((d,i)=>{
		salary_col[i] = +d['Salary']
	});

	// X axis
	var x = d3.scaleLinear()
		.domain([0, d3.max(days_col)])
		.range([0, 2*width/3]);
	ssvg.append("g")
        .attr("class", "x")
		.attr("transform", "translate("+margin.left+","+height+")")
		.call(d3.axisBottom(x));

	//Y Axis
	var y = d3.scaleLinear()
		.domain([0, d3.max(staff_col)])
		.range([height-margin.top, 0]);

	ssvg.append("g")
        .attr("class", "y")
		.attr("transform", "translate("+margin.left+","+margin.top+")")
		.call(d3.axisLeft(y));
	
	//add label for axis
	ssvg.append("text")
		.attr("id","yaxis")
		.attr("transform", "rotate(-90)")
		.attr("y", 150)
		.attr("x", 0- height/2 -20)
		.style("text-anchor","middle")
		.text("Staff Size (people)")
		.style("font-family", "Helvetica");
	ssvg.append("text")
		.attr("transform", "translate("+(margin.left+width/3)+","+(height+margin.top/2)+")")
		
		.style("text-anchor","middle")
		.text("Days in Session")
		.style("font-family", "Helvetica");
		


	// color scale
	var pointColor = d3.scaleOrdinal()
		.domain(["Full-Time", "Hybrid","Part-Time"])
		.range(["#043691", "#707173", "#f5ca0a"]);

		ssvg.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("class","dots")
			.attr("cx", d=>{return x(d['Days in session 2019'])+margin.left  })
			.attr("cy", d=> {return y(parseInt(d['Staff Size (2015)'].replace(",","")))+margin.top})
			.attr("r",2)
			.style("fill","black")
			.style("opacity",0);

		ssvg.append("g")
			.attr("font-family", "sans-serif")
      		.attr("font-size", 12)
			.selectAll("text")
    		.data(data)
    		.join("text")
			.attr("class","abbr")
      		.attr("dy", "0.35em")
			.attr("x", d=>{return x(d['Days in session 2019'])+margin.left +5 })
			.attr("y", d=> {return y(parseInt(d['Staff Size (2015)'].replace(",","")))+margin.top})
			.style("fill",d=>{return pointColor(d['Legislature Type'])})
			.text(d => {return d.Abbr})
			.style("cursor","pointer")
			.on("mouseover", function(d){
				d3.selectAll(".abbr")
					.style("opacity",0.2);
				d3.select(this)
			        .transition()
			        .duration(100)
			        .attr("font-size","14px")
					.style("opacity",1)
			        .text(d.State);
			})
			.on("mouseout", function(d){
				d3.select("#point").remove();
				d3.selectAll(".abbr")
					.style("opacity",1);
				d3.select(this)
				    .transition()
				    .duration(100)
					.attr("x", ()=>{return x(d['Days in session 2019'])+margin.left +5})
				    .text(d.Abbr)
				    .attr("font-size",12);
			});

			salarybtn = d3.select("#salarybtn")
				.on("click", changeSalary);
			staffbtn = d3.select("#staffbtn")
				.on("click", changeStaff);


		function changeSalary(){
			staff = false;
			//change scales
			y.domain([0, d3.max(salary_col)]).range([height-margin.top, 0]);
			d3.select("#yaxis").text("Yearly Salary ($)");
			//update circles
			ssvg.selectAll(".abbr")
				.data(data)
				.transition()
				.duration(1000)
				.attr("x", function(d){ return x(d['Days in session 2019'])+margin.left +5})
				.attr("y", function(d){
					return y(parseInt((d['Salary']).replace(",","")))+margin.top
				});
			ssvg.selectAll(".dots")
				.data(data)
				.transition()
				.duration(1000)
				.attr("cx", function(d){ return x(d['Days in session 2019'])+margin.left })
				.attr("cy", function(d){
					return y(parseInt((d['Salary']).replace(",","")))+margin.top
				});
			
            // Update Y Axis
            ssvg.select(".y")
                .transition()
                .duration(1000)
                .call(d3.axisLeft(y).tickFormat((d)=>{console.log(d); return `$${numberWithCommas(d)}`}));
		}
		function changeStaff(){
			staff = true;
			//change scales
			y.domain([0, d3.max(staff_col)]).range([height-margin.top, 0]);
			d3.select("#yaxis").text("Staff Size (people)");

			//update circles
			ssvg.selectAll(".abbr")
				.data(data)
				.transition()
				.duration(1000)
				.attr("x", function(d){
					return x(d['Days in session 2019'])+margin.left +5
				})
				.attr("y", function(d){
					return y(parseInt((d['Staff Size (2015)']).replace(",","")))+margin.top
				});
			ssvg.selectAll(".dots")
				.data(data)
				.transition()
				.duration(1000)
				.attr("cx", function(d){
					return x(d['Days in session 2019'])+margin.left })
				.attr("cy", function(d){
					return y(parseInt((d['Staff Size (2015)']).replace(",","")))+margin.top
				});

			

                // Update Y Axis
                ssvg.select(".y")
                    .transition()
                    .duration(1000)
                    .call(d3.axisLeft(y));
		}


});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}




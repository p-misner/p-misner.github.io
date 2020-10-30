var margin = {top: 20, left: 20, right: 20, bottom:20};
var height = 600 - margin.top - margin.bottom;
var width = 1200- margin.left - margin.right;

var tsvg= d3.select("#table")
	.attr("viewBox", [0, 0, width + margin.right + margin.left, height+ margin.top + margin.bottom])
	.style("background-color", "none");


	d3.csv("./data/table.csv")
	.then(function(data){
		var sortAscending = true;
		var expanded = true;
		var table = d3.select("#table").append("table");
		var titles = d3.keys(data[0]);
		var headers = table.append("thead").append("tr")
			.selectAll("th")
			.data(titles)
			.enter()
			.append("th")
			.text(d => {
				return d;
			})
			.on("click", d=>{
				headers.attr("class","header");
				if (sortAscending) {
					rows.sort(function(a,b){
						if (isNaN(parseInt(a[d]))){
							return b[d] <a[d];
						}
						else{
							return (parseInt(b[d]) - parseInt(a[d]))
						}

						// 
					});
					sortAscending = false;
					this.className ='aes';
				} else {
					rows.sort(function(a,b){
						if (isNaN(parseInt(a[d]))){
							return b[d] > a[d];
						}
						else{
							return parseInt(a[d]) - parseInt(b[d])

						}
						// return b[d] > a[d];
					});
					sortAscending = true;
					this.className = 'des';
				}
			});
		var rows = table.append("tbody")
			.selectAll("tr")
			.data(data.filter(d => {return d["Legislature Type"] == "Full-Time"}))
			.enter()
			.append("tr");
		// z =data([4, 8, 15, 16, 23, 42].filter(function(d){ return d < 10; }))

		rows.selectAll("td")
			.data(d=>{
				
				return titles.map(k =>{
					return{value: d[k], name: k}
				});
			})
			.enter()
			.append("td")
			.attr("data-th", d =>{return d.name})
			.text(d => d.value);
		tsvg.append("button")
			.attr("id","scatterbtn")
			.text("Click to Expand Rows")
			.attr("class", "tablebtn")
			.on("click", showAllRows);
			
		function showAllRows(d){
			d3.selectAll("tbody").remove();
			if (expanded){
				rows = table.append("tbody")
					.selectAll("tr")
					.data(data)
					.enter()
					.append("tr");
				d3.select("#scatterbtn").text("Click to Shrink Rows");
				expanded = false;
			}
			else {
				rows = table.append("tbody")
					.selectAll("tr")
					.data(data.filter(d => {return d["Legislature Type"] == "Full-Time"}))
					.enter()
					.append("tr");
				d3.select("#scatterbtn").text("Click to Expand Rows");
				expanded = true;
			}
			

			rows.selectAll("td")
				.data(d=>{
					
					return titles.map(k =>{
						return{value: d[k], name: k}
					});
				})
				.enter()
				.append("td")
				.attr("data-th", d =>{return d.name})
				.text(d => d.value);
		}

	}); 

function clickChange(d){
	headers.attr("class","header");
	if (sortAscending) {
		rows.sort(function(a,b){return b[d] <a[d]});
		sortAscending = false;
		this.className ='aes';
	} else {
		rows.sort(function(a,b){return b[d] > a[d]});
		sortAscending = true;
		this.className = 'des';
	}
}


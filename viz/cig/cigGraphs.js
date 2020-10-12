      //loading data
      var filename = "https://raw.githubusercontent.com/p-misner/100daysofvisualization/master/viz000/YRBSS_graphic/YRBSS_CigData.json";
      var width = 384;
      var height = 250;
      var margintop = 50;
console.log("run")

      //getting relevant data
      d3.json(filename, function(data) {setUp(data); controls(data);});

      function setUp(data) {
        var location = "National (States and DC)";

        var infosmk = [{"topicDesc":"Smokeless Tobacco Use (Youth)", "Response":"Current"}]
        var svg1 ="#smokeless";
        dataViz(data, location,infosmk, svg1);

        var svg2 = "#ciguse";
        var infocig = [{"topicDesc":"Cigarette Use (Youth)", "Response":"Frequent"}];
        dataViz(data, location, infocig, svg2);
      

      }
      function dataViz(data, location,info,svg) {
        var state = [];
        for(var i = 0; i < data.length;i++) {
          if ((data[i].LocationDesc == location)  && (data[i].TopicDesc == info[0].topicDesc)&& (data[i].Response == info[0].Response) && (data[i].Gender =="Overall"))  {
            state.push(data[i]);
          }
        }
        console.log(state);
          if (svg =="#smokeless"){
          d3.selectAll(svg).append("text")
          .attr("class","title")
          .attr("y", 20)
          .attr("x", 50)
          .text("Teen Smokeless Tobacco Use in "+ location)
        }
        else {
             d3.selectAll(svg).append("text")
          .attr("class","title")
          .attr("y", 20)
          .attr("x", 50)
          .text("Teen Cigarette Use in " + location )
        }

        stateGraph(state,svg);
      };

      function stateGraph(data,svg) {
        console.log(data)
        d3.selectAll(svg)
          .append("g")
          .attr("id", ""+data[0].LocationDesc +"")
          .attr("transform","translate(50,"+(50+margintop)+")")
          .selectAll("g")
          .data(data)
          .enter()
          .append("g")
          .attr("class","stateDP")
          .attr("transform", (d,i) => "translate(" + ((d.YEAR - 1993) * 17.4) + ", "+ (200 - (d.Data_Value*10))+")");

        //graphing data as points
        d3.selectAll("g.stateDP")
          .append("circle")
          .attr("r", 3);

        //graphing data as line
        var gen = d3.svg
              .line()
              .x(function(d){return (17.4*(d.YEAR - 1993))})
              .y(function(d){ return (200 - (d.Data_Value*10))});
        var lineGraph = d3.selectAll(svg).append("path")
              .attr("transform","translate(50,"+(50+margintop)+")")
              .attr("d", gen(data))
              .attr("stroke", "black")
              .attr("stroke-width", 2)
              .attr("fill", "none");


        //creating axis
        //var timeFormat = d3.time.format('%Y').parse;
        var x1 = d3.time.scale().range([0,width]);
        var yone = d3.scale.linear().range([height,0]);
        var x2 = x1.domain([new Date(1993),new Date(2015)]);
        var y2 = yone.domain([0,25]);

        var xAxis = d3.svg.axis().scale(x2)
                .orient("bottom")
                .tickFormat(d3.format("d"))
                .ticks(14)
                .tickSize(2);
        var yAxis = d3.svg.axis().scale(y2)
                .orient("left")
                .tickSize(2)
                .ticks(6);

        xAxis = d3.selectAll(svg).append("g")
          .attr("class", "xaxis" )
          .attr("transform", "translate(50," + (margintop + height) + ")")
          .call(xAxis)
          .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-65)" )
            .attr("dx",-10)
            .attr("dy", 5);

        yAxis = d3.selectAll(svg).append("g")
              .attr("class", "yaxis" )
              .attr("transform", "translate(50,"+margintop+")")
              .call(yAxis);


        //axis labels


        d3.selectAll("g.xaxis").append("text")
          .attr("class","label")
          .attr("y", 60)
          .attr("x", width/2.2)
          .text("year");
        d3.selectAll("g.yaxis").append("text")
          .attr("class", "label")
          .attr("x", -190)
          .attr("y", -30)
          .text("percent of students")
          .attr("transform","rotate(-90)");


        //graphing data as area
        var horiz = d3.scale.linear()
            .domain([1993, 2015])
            .range([0, width]);
        var vert = d3.scale.linear()
            .domain([0, 25])
            .range([height, 0]);
        var area = d3.svg.area()
            .x(function(d) { return horiz(d.YEAR); })
            .y0(height)
            .y1(function(d) { return vert(d.Data_Value); });

        d3.select(svg)
          .attr("width", width )
          .attr("height", height )
          .append("g")
          .append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area)
          .attr("transform", "translate(50,50)");

        //code below based on http://bl.ocks.org/d3noob/4433087
        d3.selectAll(svg).append("linearGradient")
          .attr("id", "temperature-gradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", 0).attr("y1", yone(0))
          .attr("x2", 0).attr("y2", yone(20))
          .selectAll("stop")
             .data([
              {offset: "0%", color: "yellowgreen"},
              {offset: "30%", color: "#c09441"},
              {offset: "100%", color: "red"}
              ])
            .enter().append("stop")
              .attr("offset", function(d) { return d.offset; })
              .attr("stop-color", function(d) { return d.color; });
      }
      function controls(data) {
        var statenames = [];
        for(var i = 0; i < data.length;i++) {
          if ((data[i].YEAR == "2013")&&(data[i].TopicDesc == "Cigarette Use (Youth)")&& (data[i].Response == "Frequent") && (data[i].Gender =="Overall"))  {
            statenames.push(data[i].LocationDesc);
          }
        }

        d3.select("#cigcontrols").insert("g")
          .attr("class", "title")
          .append("text")
          .text("Choose a State from the list below: ");
        d3.select("#cigcontrols")
          .selectAll("button")
          .data(statenames)
          .enter()
          .append("button")
          .attr("class", "buttons")
          .attr("id", (d,i) => {return d})
          .on("click", function() {
            buttonClick(this.id);
            })
          .html(d => d);

      }
      function buttonClick(id) {
        var location = id;
        var svg1 ="#smokeless"
        var infosmk = [{"topicDesc":"Smokeless Tobacco Use (Youth)", "Response":"Current"}]
        var svg2 = "#ciguse";
        var infocig = [{"topicDesc":"Cigarette Use (Youth)", "Response":"Frequent"}]

        d3.selectAll("svg").selectAll("*").remove();
        d3.json(filename, function(data) {dataViz(data, location,infosmk,svg1)});
        d3.json(filename, function(data) {dataViz(data, location,infocig,svg2)});



        //d3.json(filename, function(data) {dataViz(data, location)});

      }


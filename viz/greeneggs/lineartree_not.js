var treeDatal={
      "children": [
        {
          "children": [
            {
              "children": [
                {
                  "children": [
                    {
                      "children": [
                        {
                          "children": [
                            {
                              "name": "there",
                              "value": 1
                            }
                          ],
                          "name": "or",
                          "value": 1
                        }
                      ],
                      "name": "here",
                      "value": 1
                    },
                    {
                      "children": [
                        {
                          "children": [
                            {
                              "name": "house",
                              "value": 1
                            }
                          ],
                          "name": "a",
                          "value": 1
                        }
                      ],
                      "name": "in",
                      "value": 1
                    },
                    {
                      "children": [
                        {
                          "children": [
                            {
                              "name": "mouse",
                              "value": 1
                            }
                          ],
                          "name": "a",
                          "value": 1
                        }
                      ],
                      "name": "with",
                      "value": 1
                    }
                  ],
                  "name": "them",
                  "value": 3
                }
              ],
              "name": "like",
              "value": 3
            },
            {
              "children": [
                {
                  "children": [
                    {
                      "children": [
                        {
                          "children": [
                            {
                              "name": "box",
                              "value": 1
                            }
                          ],
                          "name": "a",
                          "value": 1
                        }
                      ],
                      "name": "in",
                      "value": 1
                    },
                    {
                      "children": [
                        {
                          "children": [
                            {
                              "name": "fox",
                              "value": 1
                            }
                          ],
                          "name": "a",
                          "value": 1
                        }
                      ],
                      "name": "with",
                      "value": 1
                    }
                  ],
                  "name": "them",
                  "value": 2
                }
              ],
              "name": "eat",
              "value": 3
            }
          ],
          "name": "you",
          "value": 9
        }
      ],
      "name": "Would",
      "value": 9
    }


// Set the dimensions and margins of the diagram
var margind = {top: 20, right: 90, bottom: 30, left: 90},
    widthd =800 - margind.left - margind.right,
    heightd = 500 - margind.top - margind.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var dsvg = d3.select("#lineartree")
    .attr("width", widthd + margind.right + margind.left)
    .attr("height", heightd + margind.top + margind.bottom)
  .append("g")
    .attr("transform", "translate("
          + margind.left + "," + margind.top + ")");
function rando(){
    expandd(root_l); 
    update(root_l);
}
function expandd(d){   
    var children = (d.children)?d.children:d._children;
    if (d._children) {        
        d.children = d._children;
        d._children = null;       
    }
    if(children)
      children.forEach(expandd);
}
var i = 0,
    duration = 750,
    root_l;
var logScale = d3.scaleLog()
  .domain([1, 70])
  .range([4, 23]);
var myColor = d3.scaleLinear().domain([1,84])
  .range(["#faa278", "#0d851d"])

// declares a tree layout and assigns the size
var treemapl = d3.tree().size([heightd, widthd]);

// Assigns parent, children, height, depth
root_l = d3.hierarchy(treeDatal, function(d) { return d.children; });
root_l.x0 = heightd ;
root_l.y0 = 0;

// Collapse after the second level
// root.children.forEach(collapse);
rando();
update(root_l);

// Collapse the node and all it's children
function collapse_l(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse_l)
    d.children = null
  }
}

function update(source) {

  // Assigns the x and y position for the nodes
  var treeDatal = treemapl(root_l);

  // Compute the new tree layout.
  var nodes_l = treeDatal.descendants(),
      links_l = treeDatal.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes_l.forEach(function(d){ d.y = d.depth * 100});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var noded = dsvg.selectAll('g.noded')
      .data(nodes_l, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnterd = noded.enter().append('g')
      .attr('class', 'noded')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', clickd);

  // Add Circle for the nodes
  nodeEnterd.append('circle')
      .attr('class', 'noded')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return myColor(d.data.value);
      })
       .style("opacity", function(d){
      	return d._children ? 0.5 : 1;
      });

  // Add labels for the nodes
  nodeEnterd.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
           return 10 + logScale(d.data.value);
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "start" : "start";
      })
      .text(function(d) { return d.data.name; });

  // UPDATE
  var nodeUpdated = nodeEnterd.merge(noded);

  // Transition to the proper position for the node
  nodeUpdated.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdated.select('circle.noded')
   .attr('r', d=> logScale(d.value))
    .style("fill", function(d) {
      	
          return myColor(d.data.value);

      })
    .style("opacity", function(d){
      	return d._children ? 0.5 : 1;
      })
    .attr('cursor', 'auto');


  // Remove any exiting nodes
  var nodeExitd = noded.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExitd.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExitd.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var linkd = dsvg.selectAll('path.linkd')
      .data(links_l, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnterd = linkd.enter().insert('path', "g")
      .attr("class", "linkd")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // UPDATE
  var linkUpdated = linkEnterd.merge(linkd);

  // Transition back to the parent element position
  linkUpdated.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExitd = linkd.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes_l.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  function clickd(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    update(d);
  }
 
}
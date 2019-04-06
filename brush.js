if(!d3.chart) d3.chart = {};

d3.chart.brush = function() {
  var margin = {top: 10, right: 50, bottom: 20, left: 400},
      width = 1200 - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom;

  var g;
  var data;
  var dispatch = d3.dispatch(chart, "filter");
  
  function chart(container) {
    g = container;

    g.append("g")
    .classed("xaxis", true)

    update();
  }
  chart.update = update;

  function update() {
    var maxCreated = 2017;
    var minCreated = 2007;

    var scale = d3.scale.linear()
    .domain([minCreated, maxCreated])
    .range([0, width/1.1])

    var brush = d3.svg.brush()
    brush.x(scale)
    brush(g)
    g.selectAll("rect").attr("height", height)
    g.selectAll(".background")
      .style({fill: "#fff", visibility: "visible"})
    g.selectAll(".extent")
      .style({fill: "#ddd", visibility: "visible"})
    g.selectAll(".resize rect")
      .style({fill: "#000", visibility: "visible"})


    var nest = d3.nest()
      .key(function(d){
        return d.year;
      })
      .sortKeys(d3.ascending)
      .rollup(function(leaves){
        return {
          countRevenue: d3.sum(leaves, function(d) {return (d.revenue)}),
        };
      })
      .entries(data)
      console.log(nest);
    
    var hScale = d3.scale.linear()
    .domain([0, d3.max(nest, function(d) {return d.values.countRevenue})])
    .range([0, height]);

    var tooltip = d3.select("#testPart")
    .append("div")
    .style("position", "absolute")
    // .style("z-index", "10")
    .style("visibility", "hidden")
    .text("tooltip");

    var rects = g.selectAll("rect.events")
    .data(data)
    rects.enter()
    .append("rect").classed("events", true)
    rects.attr({
      x: function(d) { return scale(d.year);},
      y: 0,
      width: 10,
      height: function(d) {
        var filtered = nest.filter(function(t) {
          return (Number(t.key) === d.year);
        });
        return hScale(filtered[0].values.countRevenue);
      }
    }).style("pointer-events", "none")
    .style("fill", function(d) {  return "green" })
      // .style("fill", function(d) {  return d.color })
      

    rects.exit().remove()


    brush.on("brushend", function() {
      var ext = brush.extent()
      var filtered = data.filter(function(d) {
        return (d.year >= ext[0] && d.year <= ext[1])
      })

      console.log(filtered);
      g.selectAll("rect.events")
      .style("stroke", "")
      
      g.selectAll("rect.events")
      .data(filtered, function(d) { return d.year })
      .style({
        stroke: "#999"
      })

      //emit filtered data
      dispatch.filter(filtered)

    })


    var axis = d3.svg.axis()
    .scale(scale)
    .orient("bottom")
    .ticks(10)
    // .tickValues([(extent[0]).toString(), (extent[0] + (extent[1] - extent[0])/2).toString() , (extent[1]).toString()])
    // .tickFormat(d3.time.format("%Y"))

    var agroup = g.append("g")
    agroup.attr("transform", "translate(" + [0, height] + ")")
    axis(agroup)
    agroup.selectAll("path")
      .style({ fill: "none", stroke: "#000"})
    agroup.selectAll("line")
      .style({ stroke: "#000"})
  }
  // -----------------------------------------
  

  // chart.highlight = function(data) {
  //   console.log(data);
  //   var rects = g.selectAll("rect.events")
  //   .style("stroke", "")
  //   .style("stroke-width", "")

  //   rects.data(data, function(d) { return d.year })
  //   .style("stroke", "black")
  //   .style("stroke-width", 1)
  // }

  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }

  chart.width = function(value) {
    if(!arguments.length) return width;
    width = value;
    return chart;
  }
  chart.height = function(value) {
    if(!arguments.length) return height;
    height = value;
    return chart;
  }

  return d3.rebind(chart, dispatch, "on");
}
if(!d3.chart)
 d3.chart = {};

var industryIDs = [
  "advertisingAndMarketing",
  "businessProductsAndServices",
  "computerHardware",
  "construction",
  "consumerProductsAndServices",
  "education",
  "energy",
  "engineering",
  "environmentalServices",
  "financialServices",
  "foodAndBeverage",
  "governmentServices",
  "health",
  "humanResources",
  "iTServices",
  "logisticsAndTransportation",
  "manufacturing",
  "media",
  "realEstate",
  "retail",
  "security",
  "software",
  "telecommunications",
  'travelAndHospitality'
  ];

d3.chart.bar = function() {
  var margin = {top: 60, right: 100, bottom: 20, left: 80},
  width = 1000 - margin.left - margin.right,
  height = 370 - margin.top - margin.bottom;
  var g;
  var data;
  // var width = 800;
  // var height = 500;
  // var cx = 200; //margin

  // var dispatch = d3.dispatch(chart, "hover");
  var dispatch = d3.dispatch(chart, "filter");

  function chart(container) {
    g = container;

    g.append("g")
    .classed("xaxis", true)

    g.append("g")
    .classed("yaxis", true)

    update();
  }
  chart.update = update;
    
  function update() {
      var nest = d3.nest()
      .key(function(d){
        return d.industry;
      })
      .sortKeys(d3.ascending)
      .rollup(function(leaves){
        return {
          countRevenue: d3.sum(leaves, function(d) {return (d.revenue)}),
          countWorkers: d3.sum(leaves, function(d) {return (d.workers)}),
        };
      })
      .entries(data)
      console.log(nest);
    //x axis
      // var maxCreated = d3.max(data, function(d) { return d.year });
      // var minCreated = d3.min(data, function(d) { return d.year });
      // console.log(maxCreated);
      // console.log(minCreated);

      // var createdScale = d3.scale.linear()
      // .domain([minCreated, maxCreated])
      // .range([cx, width])
      scale = 10000000000;

      var xScale = d3.scale.linear()
      .domain([0, d3.max(nest, function(d) { return d.values.countRevenue / scale })])
      .range([0, width / 2])

  

      var xAxis = d3.svg.axis()
      .scale(xScale)
      .ticks(5)
      .orient("bottom")
      // .tickFormat(d3.time.format("%Y"))
      
      // createdScale.domain(industryIDs.map(function(d) { return d; }));

      var xg = g.select(".xaxis")
      .classed("axis", true)
      .classed("xaxis", true)
      .attr("transform", "translate(" + [0, height] + ")")
      .transition()
      .call(xAxis)

      // [0,height]
      // [cx - 5,0]

      //y axis

      var yScale = d3.scale.ordinal()
      .rangeRoundBands([height, 0], 0.6)
      
      var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(5)
      .orient("left")

      yScale.domain(nest.map(function(d) { return d.key; }));

      
      var yg = g.select(".yaxis")
      .classed("axis", true)
      .classed("yaxis", true)
      // .attr("transform", "translate(" + [, 0] + ")")
      .transition()
      .call(yAxis)

      //size
      var commentScale = d3.scale.linear()
      .domain(nest.map(function(d) { return d.values.countWorkers; }))
      .range([5, 15])

      
    var bars = g.selectAll(".bar")
    // .data(nest.sort(function(a, b) { return - (b.revenue - a.revenue) / scale; }))
    .data(nest);

    bars.enter()
    .append("rect")
  
    var tooltip = d3.select("#testPart")
    .append("div")
    .style("position", "absolute")
    // .style("z-index", "10")
    .style("visibility", "hidden")
    .text("tooltip");
    
    bars
    .transition()
    .attr("class", "bar")
    .attr("x", function(d,i) { return 5; })
    .attr("y", function(d,i) { return yScale(d.key); })
    .attr("width", function(d) { return xScale(d.values.countRevenue/ scale); }) 
    .attr("height", function(d) { return 20; })
      .style("fill", function(d) {  return "brown" })
      .style("opacity", .5)


    bars.exit().remove()
    
    bars.on("mouseover", function(d) {
      d3.select(this).style("stroke", "black")
      console.log(d.revenue);
      tooltip.text("Total Revenue: " + d.values.countRevenue
                    + "\nTotal Worksers: " + d.values.countWorkers);
      return tooltip.style("visibility", "visible");
      // dispatch.hover([d])
    })

    bars.on("mousemove", function(d) {
      return tooltip.style("top",
    (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })

    bars.on("mouseout", function(d) {
      d3.select(this).style("stroke", "");
      return tooltip.style("visibility", "hidden");
      // dispatch.hover([])
    })

    bars.on("click", function(t) {
      var filtered = data.filter(function(d) {
        return (d.industry === t.key);
      })
      dispatch.filter(filtered);
    })

  }
  // -------------------------------------


    
  //highlights elements being hovered elsewhere
    chart.highlight = function(data) {
    var bars = g.selectAll(".bar")
    .style("stroke", "")
    .style("stroke-width", "")

        bars.data(data, function(d) { return d.industry })
    .style("stroke", "red")
    .style("stroke-width", 5)
  }

  //combination getter and setter for the data attribute of the global chart variable
  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }
    
  //combination getter and setter for the width attribute of the global chart variable

  chart.width = function(value) {
    if(!arguments.length) return width;
    width = value;
    return chart;
  }
    
  //combination getter and setter for the height attribute of the global chart variable
  chart.height = function(value) {
    if(!arguments.length) return height;
    height = value;
    return chart;
  }

  return d3.rebind(chart, dispatch, "on");
}
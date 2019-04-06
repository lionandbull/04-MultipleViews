// import {advertisingAndMarketing} from "./dataByIndustry.js"
// import {businessProductsAndServices} from "./dataByIndustry.js"
// import {computerHardware} from "./dataByIndustry.js"
// import {construction} from "./dataByIndustry.js"
// import {consumerProductsAndServices} from "./dataByIndustry.js"
// import {education} from "./dataByIndustry.js"
// import {energy} from "./dataByIndustry.js"
// import {engineering} from "./dataByIndustry.js"
// import {environmentalServices} from "./dataByIndustry.js"
// import {financialServices} from "./dataByIndustry.js"
// import {foodAndBeverage} from "./dataByIndustry.js"
// import {governmentServices} from "./dataByIndustry.js"
// import {health} from "./dataByIndustry.js"
// import {humanResources} from "./dataByIndustry.js"
// import {iTServices} from "./dataByIndustry.js"
// import {logisticsAndTransportation} from "./dataByIndustry.js"
// import {manufacturing} from "./dataByIndustry.js"
// import {media} from "./dataByIndustry.js"
// import {realEstate} from "./dataByIndustry.js"
// import {retail} from "./dataByIndustry.js"
// import {security} from "./dataByIndustry.js"
// import {software} from "./dataByIndustry.js"
// import {telecommunications} from "./dataByIndustry.js"
// import {travelAndHospitality} from "./dataByIndustry.js"
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
// var industryIDs = [
//   advertisingAndMarketing,
//   businessProductsAndServices,
//   computerHardware,
//   construction,
//   consumerProductsAndServices,
//   education,
//   energy,
//   engineering,
//   environmentalServices,
//   financialServices,
//   foodAndBeverage,
//   governmentServices,
//   health,
//   humanResources,
//   iTServices,
//   logisticsAndTransportation,
//   manufacturing,
//   media,
//   realEstate,
//   retail,
//   security,
//   software,
//   telecommunications,
//   travelAndHospitality
//   ];

if(!d3.chart) d3.chart = {};

d3.chart.symbol_map = function(data) {
  function getRatio(side) {
      return (( margin[side] / width ) * 100 + 1) + "%";
  }

  var data = data, pro
      margin = {left: 10, top: 10, right: 10, bottom: 10},
      width = 1080 - margin.left - margin.right,
      height = 680 - margin.top - margin.bottom,
      marginRatio = {
          left: getRatio("left"),
          top: getRatio("top"),
          right: getRatio("right"),
          bottom: getRatio("bottom")
      };

  var svg_map = d3.select("div#map")
      .append("div")
      .attr("id", "svg-container")
      .append("svg")
      .style("padding", marginRatio.top + " " + marginRatio.right + " " + marginRatio.bottom + " " + marginRatio.left)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + ( width + margin.left + margin.right  ) + " " + ( height + margin.top + margin.bottom ))
      .attr("id", "svg-content-responsive")
      .attr("class", "graph-svg-placeholder");

  // add base map

  var projection = d3.geo.albersUsa()
      .scale(1400)
      .translate([width / 2, height / 2]);

  var path = d3.geo.path()
      .projection(projection);

  var g = svg_map.append("g")
      .style("stroke-width", "1px");

  d3.json("./us.json", function (error, us) {
      if (error) throw error;
      g.selectAll("path")
          .data(topojson.feature(us, us.objects.states).features)
          .enter().append("path")
          .attr("d", path)
          .attr("class", "feature");
      g.append("path")
          .datum(topojson.mesh(us, us.objects.states, function (a, b) {
              return a !== b;
          }))
          .attr("class", "mesh")
          .attr("d", path);
  });

  // initialize data, default industry: Advertising & Marketing
  var property = "revenue", 
      industry = "advertisingAndMarketing",
      year = 2007;
      // data = industry.filter(function(item){
      //  return item.year === year;
      // });
      // var data = [];
      // for (var i = 20; i < industryIDs.length; i++) {
      //   data = data.concat(industryIDs[i]);
      // }
      // data = industry.filter(function(item){
      //  return item.year === 2008;
      // });

  var location = svg_map.append("g");
  // var dispatch = d3.dispatch(chart, "hover");
  var dispatch = d3.dispatch(chart, "filter");
    
    
  function chart(container) {
    g = container;
    updateMap();
  }
  chart.update = updateMap;

  function updateMap(data){
    data.forEach(function (d) {
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
    });

    var formatNumber = d3.format(",.0f");

    var maxProperty = Math.max.apply(Math, data.map(function (data) {
        return data[property];
    }));

    var radius = d3.scale.sqrt()
        .domain([0, maxProperty])
        .range([1.5, 35]);

    d3.selectAll(".bubble").remove();
    d3.selectAll(".legend").remove();
    
    location = svg_map.append("g")
                .attr("class", "bubble");
    
    var symbols = location
        .selectAll("circle")
        .data(data.sort(function (a, b) {
            return b[property] - a[property];
        }))

        symbols
        .enter()
        .append("circle")

        symbols
        .attr("r", function (d) {
            return radius(d[property]);
        })
        .attr("transform", function (d) {
            var location_ = [];
            location_.push(d.longitude);
            location_.push(d.latitude);
            var proLocation = projection(location_);
            if (!proLocation) proLocation = [867.169335964292, 190.40024748993005];
            return "translate(" + proLocation + ")";
        })
        .append("title")
        .text(function(d) { return d.city + ", " + d.state
                    + "\nIndustry: " + d.industry
                    + "\nYear: " + d.year 
                    + "\nRevenue: " + formatNumber(d.revenue)
                    + "\nHeadcount: " + formatNumber(d.workers);
        });


    var legend = svg_map.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - 50) + "," + (height - 20) + ")")
        .selectAll("g")
        .data([maxProperty / 6, maxProperty / 2, maxProperty])
        .enter().append("g");

    legend.append("circle")
        .attr("cy", function (d) {
            return -radius(d);
        })
        .attr("r", radius);

    legend.append("text")
        .attr("y", function (d) {
            return -2 * radius(d);
        })
        .attr("dy", "1.3em")
        .text(d3.format(".1s"));

      symbols.exit().remove();
    // svg_map.append("g")
    //     .attr("class", "bubble")
    //     .selectAll("circle")
    //     .data(data.sort(function (a, b) {
    //         return b[property] - a[property];
    //     })).exit().remove();


    // symbols.on("mouseover", function(d) {
    //   d3.select(this).style("stroke", "black")
    //   dispatch.hover([d])
    // })

    // symbols.on("mouseout", function(d) {
    //   d3.select(this).style("stroke", "")
    //   dispatch.hover([])
    // })

    symbols.on("click", function(t) {
      var filtered = data.filter(function(d) {
        return (d.city === t.city);
      })
      dispatch.filter(filtered);
    })


  }

  updateMap(data, property);

  

  chart.highlight = function(data) {
      var symbols = g.selectAll("circle.symbol")
      .style("stroke", "")
      .style("stroke-width", "")

      symbols.data(data, key)
      .style("stroke", "black")
      .style("stroke-width", 3)
  }
    
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
    
   var key = function(d) {
        return d.id;
   };

  return d3.rebind(chart, dispatch, "on");
}
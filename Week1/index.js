import "../node_modules/d3/dist/d3.min.js";

let circle = d3.selectAll("circle");
let h1 = d3.selectAll("h1");

circle.style("fill", "steelblue");
circle.attr("r", 30).attr("cx", function() { return Math.random() * 360;})

h1.style("fill", "steelblue");
h1.attr("cx",function(){return Math.random() * 360})


// python -m SimpleHTTPServer
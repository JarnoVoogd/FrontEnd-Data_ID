// import "/d3/dist/d3.min";
import "../../node_modules/d3/dist/d3.min.js";

// import fetch from "node-fetch";

// Creating an array to push data to
let allFetches = [];
let somPerSoort = {};
let personenData = [];
let barChartData = [];

// This function fetches data from SWAPI and seperates the .json part
function fetchPeople(id) {
  const url = `https://swapi.dev/api/people/${id}/`;
  return fetch(url).then(response => response.json());
}

// Variable I use to count the amount of errors in the data
// This was necessary because of 0 < 5 amount of errors in the API data
let endFetch = 0;

// for loop that loops through the data collected by 'fetchPeople' as long as
// it encounters less than 5 errors
for (let i = 0; endFetch < 5; i++) {
  await fetchPeople(i).then(persoon => {
    if (!persoon.detail) {
      allFetches.push(persoon);
    } else {
      endFetch++;
    }
  });
}

// Here make a promise of all my fetches(or all the data I fetched), which i saved in an array named allFetches.
// Within .then i do a few things, first I let a forLoop loop through all the data.
// While looping it checks for "eye_color" and only saves the data connected to "eye_color".
// This data is pushed to an empty array named "personenData".
// After this I clean up the data by replacing ", " with "-" (blue, gray -> blue-gray)
// And I replace "unknown" with "silver", for some reason this data was corrupted
Promise.all(allFetches).then(allePersonen => {
  for (let i = 0; i < allePersonen.length; i++) {
    personenData.push(allePersonen[i]["eye_color"]);
    personenData[i] = personenData[i]
      .replace(", ", "-")
      .replace("unknown", "silver");
  }
  // Here I use a ForEach to run through somPerSoort and add up each type of eye color.
  personenData.forEach(i => {
    somPerSoort[i] = (somPerSoort[i] || 0) + 1;
  });
  // Here I use Object.keys to select all keys in my array somPerSoort
  // with the keys selected I can map them and name them key for now.
  // After this I make "test" return an object, in this object I
  // use the name "key" to call for the saved keys  
  const test = Object.keys(somPerSoort) (key => {
    return { color: key, amount: somPerSoort[key] };

  });
  testF(test);
});

// In this function I first replace anything thats in barChartData with the data given as parameter
// After this I run function "Update" which I need for my D3 visualisation to work  
function testF(data) {
  // console.log(data)
  barChartData = data;
  update(barChartData);
  console.log(barChartData)
  // deedrie();
}

// These are just "styling" constantes I use to create and define attributes etc.
const margin = { top: 40, bottom: 10, left: 120, right: 20 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Creates sources <svg> element
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

// Group used to enforce margin
const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Scales setup
const xscale = d3.scaleLinear().range([0, width]);
const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1);

// Axis setup
const xaxis = d3.axisTop().scale(xscale);
const g_xaxis = g.append("g").attr("class", "x axis");
const yaxis = d3.axisLeft().scale(yscale);
const g_yaxis = g.append("g").attr("class", "y axis");


function update(new_data) {
  //update the scales
  xscale.domain([0, d3.max(new_data, d => d.amount)]);
  yscale.domain(new_data.map(d => d.color));
  //render the axis
  g_xaxis.transition().call(xaxis);
  g_yaxis.transition().call(yaxis);

  // Render the chart with new data

  // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
  const rect = g
    .selectAll("rect")
    .data(new_data, d => d.color)
    .join(
      // ENTER
      // new elements
      enter => {
        const rect_enter = enter.append("rect").attr("x", 0);
        rect_enter.append("title");
        return rect_enter;
      },
      // UPDATE
      // update existing elements
      update => update,
      // EXIT
      // elements that aren't associated with data
      exit => exit.remove()
    );

  // ENTER + UPDATE
  // both old and new elements
  rect
    .transition()
    .attr("height", yscale.bandwidth())
    .attr("width", d => xscale(d.amount))
    .attr("y", d => yscale(d.color));

  rect.select("title").text(d => d.color);
}

d3.select("#filter-allColors").on("change", function () {
  // This will be triggered when the user selects or unselects the checkbox

  const filtered_data = barChartData.map(d => d)
    update(filtered_data); // Update the chart with all the data we have
  }
);

d3.select("#filter-humanColors").on("change", function () {
  
    const filtered_data = barChartData.filter(d => d.color === "blue" || d.color === "brown" || d.color === "hazel" || d.color === "blue-gray");

    update(filtered_data); // Update the chart with the filtered data

    console.log(filtered_data)
  
});

d3.select("#filter-extraterrestrialColors").on("change", function () {
  
    const filtered_data = barChartData.filter(d => d.color === "yellow" || d.color === "red" || d.color === "black" || d.color === "orange" || d.color === "pink" || d.color === "silver" || d.color === "gold" || d.color === "green-yellow" || d.color === "white");

    update(filtered_data); // Update the chart with the filtered data
  



});


// d3.selectAll('input[type="checkbox"]').on("change", function () {
//   // This will be triggered when the user selects or unselects the checkbox
//   let waarde = this.value
//   const checked = d3.select(this).property("checked");
//   if (checked === true) {
//     // Checkbox was just checked

//     // Keep only data element whose country is US
//     const filtered_data = barChartData.filter(d => d.color === waarde);

//     update(filtered_data); // Update the chart with the filtered data
//   } else {
//     // Checkbox was just unchecked
//     update(barChartData); // Update the chart with all the data we have
//   }
// });

// d3.selectAll('input[type="checkbox"]').on("change", function () {
//   let waarde = this.value;
//   console.log(waarde);
//   const filtered_data = barChartData.filter(d => d.color === waarde);
//   update(filtered_data); // Update the chart with the filtered data
// });

function deedrie() {}
// let circle = d3.selectAll("circle");
// let h1 = d3.selectAll("h1");

// circle.style("fill", "steelblue");
// circle.attr("r", 30).attr("cx", function() { return Math.random() * 360;})

// h1.style("fill", "steelblue");
// h1.attr("cx",function(){return Math.random() * 360})

// `python -m SimpleHTTPServer




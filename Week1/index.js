// import "/d3/dist/d3.min";
// import "../../node_modules/d3/dist/d3.min.js";

// import fetch from "node-fetch";

// Creating an array/object to push data to
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
  const test = Object.keys(somPerSoort).map(key => {
    return { color: key, amount: somPerSoort[key] };
  });
  testF(test);
});

// In this function I first replace anything thats in barChartData with the data given as parameter
// After this I run function "Update" which I need for my D3 visualisation to work
function testF(data) {
  barChartData = data;
  update(barChartData);
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
  // Update the scales with the API data
  xscale.domain([0, d3.max(new_data, d => d.amount)]);
  yscale.domain(new_data.map(d => d.color));
  // Render the axis
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
      // update existing elements with new data (if there is any)
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
    .attr("y", d => yscale(d.color))
    .attr("class", "glow");

  rect.select("title").text(d => d.amount);
}

// Creating of arrays in which I store the eye colors, seperated into human and extraterrestrial colors.
const human = ["blue", "brown", "blue-gray", "hazel"];
const ext = ["yellow", "red", "black", "orange", "pink", "silver", "red-blue", "gold", "green-yellow", "white"];

// A const with an object in which I store which colors belong in the different categories.
const colorMap = {
  human: human,
  ext: ext,
  all: [...human, ...ext]
};

// This function takes a given race and puts that races' eye colors into "validColors".
// After this it filters all data with the selected races' eye colors and puts them into 
// "filtered_data".
// "filtered data" is then returned.
function filterData (selectedRace){
  const validColors = colorMap[selectedRace];
  const filtered_data = barChartData.filter(c =>
    validColors.find(vc => vc === c.color)
  );
  return filtered_data;
};

// Here "selectedRace is created and made equal to "all" because the data starts with all races combined.
let selectedRace = "all";

// This is the "filter"(technically not a filter but for lack of a better term...) for when the 
// "all" radio button is checked. 
d3.select("#filter-allColors").on("change", function () {
  selectedRace = "all";
  update(barChartData); // Update the chart with the filtered data
});

// This is the filter for when the "human" radio button is checked.
// It sets "selectedRace" equal to "human" and then runs function "filterData" with as parameter
// "selectedRace", which is set equal to human. So all data is filtered against the "human" eye colors.
d3.select("#filter-humanColors").on("change", function () {
  selectedRace = "human";
  const filtered_data = filterData(selectedRace);
  update(filtered_data); // Update the chart with the filtered data
});

// This is the filter for when the "extraterrestrial" radio button is checked.
// It sets "selectedRace" equal to "extraterrestrial" and then runs function "filterData" with as parameter
// "selectedRace", which is set equal to extraterrestrial. So all data is filtered against the "extraterrestrial" eye colors.
d3.select("#filter-extraterrestrialColors").on("change", function () {
  selectedRace = "ext";
  const filtered_data = filterData(selectedRace);
  update(filtered_data); // Update the chart with the filtered data
});

// This is the amount (slider) filter. It gives the option to filter the given data against the amount of
// occurences. In other words, if the slider is set to 8 only the eye colors that occur 8 times or more will 
// be displayed.
// First I create "aantal" which I set equal to this.value, which means the current/latest value input into the slider
// I then filter all data against the selected race data, same as I did with previous filters.
// After this I filter the already filtered "race" data again, I filter it against the current value of the slider.
d3.select('input[type="range"]').on("change", function () {
  let aantal = this.value;
  const filteredRaceData = filterData(selectedRace);
  const filtered_data = filteredRaceData.filter(d => d.amount >= aantal);
  update(filtered_data); // Update the chart with the filtered data
});


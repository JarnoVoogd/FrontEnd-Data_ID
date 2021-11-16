
import "../../node_modules/d3/dist/d3.min.js";


let allFetches = [];
let somPerSoort = {};
let personenData = [];
let barChartData = [];


function fetchPeople(id) {
  const url = `https://swapi.dev/api/people/${id}/`;
  return fetch(url).then(response => response.json());
}

let endFetch = 0;

for (let i = 0; endFetch < 5; i++) {
  await fetchPeople(i).then(persoon => {
    if (!persoon.detail) {
      allFetches.push(persoon);
    } else {
      endFetch++;
    }
  });
}


Promise.all(allFetches).then(allePersonen => {
  for (let i = 0; i < allePersonen.length; i++) {
    personenData.push(allePersonen[i]["eye_color"]);
    personenData[i] = personenData[i]
      .replace(", ", "-")
      .replace("unknown", "silver");
  }

  personenData.forEach(i => {
    somPerSoort[i] = (somPerSoort[i] || 0) + 1;
  });
  
  const test = Object.keys(somPerSoort).map(key => {
    return { color: key, amount: somPerSoort[key] };

  });
  testF(test);
});


function testF(data) {
  // console.log(data)
  barChartData = data;
  update(barChartData);
  // deedrie();
}

const margin = { top: 40, bottom: 10, left: 120, right: 20 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;


const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);


const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);


const xscale = d3.scaleLinear().range([0, width]);
const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1);

const xaxis = d3.axisTop().scale(xscale);
const g_xaxis = g.append("g").attr("class", "x axis");
const yaxis = d3.axisLeft().scale(yscale);
const g_yaxis = g.append("g").attr("class", "y axis");


function update(new_data) {
  xscale.domain([0, d3.max(new_data, d => d.amount)]);
  yscale.domain(new_data.map(d => d.color));
  g_xaxis.transition().call(xaxis);
  g_yaxis.transition().call(yaxis);


  const rect = g
    .selectAll("rect")
    .data(new_data, d => d.color)
    .join(
      enter => {
        const rect_enter = enter.append("rect").attr("x", 0);
        rect_enter.append("title");
        return rect_enter;
      },
      update => update,
    
      exit => exit.remove()
    );

  
  rect
    .transition()
    .attr("height", yscale.bandwidth())
    .attr("width", d => xscale(d.amount))
    .attr("y", d => yscale(d.color));

  rect.select("title").text(d => d.color);
}

//interactivity
d3.select("#filter-humanColors").on("change", function () {
  const checked = d3.select(this).property("checked");
  if (checked === true) {
   
    const filtered_data = barChartData.filter(d => d.color === "blue" || d.color === "brown" || d.color === "hazel" || d.color === "blue-gray");
    
    update(filtered_data);
  } else {
    update(barChartData); 
  }
});

d3.select("#filter-extraterrestrialColors").on("change", function () {
  // This will be triggered when the user selects or unselects the checkbox
  const checked = d3.select(this).property("checked");
  if (checked === true) {
    // Checkbox was just checked

    // Keep only data element whose country is US
    const filtered_data = barChartData.filter(d => d.color === "yellow" || d.color === "red" || d.color === "black" || d.color === "orange" || d.color === "pink" || d.color === "silver" || d.color === "gold" || d.color === "green-yellow" || d.color === "white");

    update(filtered_data); // Update the chart with the filtered data
  } else {
    // Checkbox was just unchecked
    update(barChartData); // Update the chart with all the data we have
  }
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




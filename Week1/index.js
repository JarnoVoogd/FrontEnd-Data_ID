// import "/d3/dist/d3.min";
import "../../node_modules/d3/dist/d3.min.js";

// import fetch from "node-fetch";

// Creating an array to push data to
let allFetches = [];
let somPerSoort = {};
let personenData = [];


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

  }
  // Here I use a ForEach to run through somPerSoort and add up each type of eye color.
  personenData.forEach(i => {
    somPerSoort[i] = (somPerSoort[i] || 0) + 1;
  
});
})

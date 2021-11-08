import fetch from "node-fetch";

// Creating an array to push data to 
let allFetches = [];
let somPerSoort = [];
let personenData = [];

// This function fetches data from SWAPI and seperates the .json part
function fetchPeople(id) {
  const url = `https://swapi.dev/api/people/${id}/`;
  return fetch(url)
    .then(response => response.json())
    .then(data => data);
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
// This data is pushed to an empty array named "personenData", this array is then console logged.
// At the end I run through "personenData" and count the amount of times each eye color is mentioned
// The added up values are console logged again
Promise.all(allFetches).then(allePersonen => {

  for (let i = 0; i < allePersonen.length; i++) {
    personenData.push(allePersonen[i]["eye_color"]);
  }
  console.log(personenData);

  personenData.forEach((i) => {
    somPerSoort[i] = (somPerSoort[i] || 0) + 1;
  });

  console.log(somPerSoort);
});
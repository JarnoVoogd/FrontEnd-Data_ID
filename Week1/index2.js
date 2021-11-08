// requiring data.json file
import data from "./data.json";

// Creating arrays to store the data in
let huisdierData = [];
let favoDatumData = [];
let correcteData = [];
let somPerSoort = [];
let favoDatumText = [];

// For loop that runs through every array in the  data.json file
// The loop specifically looks for 'favourite-pet' and puts that data in the huisdierData array
// It cleans up the data bij capitalizing each (first) word
// Lastly it uses the function twoSpaces, more details in the annotations above twoSpaces
//
// The second thing i use this For-Loop for is running through the data.json file and selecting all the favourite dates
// After selecting the data it will be pushed to a new empty array named favoDatumData
// Lastly it will split all dates at the '/', this creates 3 strings, the day, the month and the year
for (let i = 0; i < data.length; i++) {
  huisdierData.push(twoSpaces(data[i]["favourite-pet"]));
  huisdierData[i] =
    huisdierData[i].charAt(0).toUpperCase() + huisdierData[i].substring(1);

  huisdierData[i] = huisdierData[i].replace(
    "Capricornis sumatraensis",
    "Bosgems"
  );

  favoDatumData.push(data[i]["favourite-date"]);
  favoDatumData[i] = favoDatumData[i].split("/");

  favoDatumText.push(data[i]["favourite-date-in-text"]);
  favoDatumText[i];
}

// This function checks every string for spaces
// At every encounter with a space it splits up the string
// After splitting the string at every space it checks if  the original string consists of more than two strings, if it does it deletes everything except the first resulting string
// This guarantees that animal names consisting of two words remain but all input with ' of ' will be deleted after the first word ends
function twoSpaces(string) {
  let array = string.split(" ");
  if (array.length > 2) {
    return array[0];
  }
  return string;
}

// This line of code runs through every string in huisdierData and adds up the amount of occurences per 'animal'
// If a certain type of animal hasn't occured yet the amount of occurences stays 0, when that type of animal does occur it adds 1 to that category
huisdierData.forEach((i) => {
  somPerSoort[i] = (somPerSoort[i] || 0) + 1;
});

// This function runs through every array, containing a date, and converts the date from arabic to roman numerals
// By using forEach this can be achieved with less code than if I were to use a For-Loop
favoDatumData.forEach((datum) => {
  datum[0] = convertToRoman(datum[0]);
  datum[1] = convertToRoman(datum[1]);
  datum[2] = convertToRoman(datum[2]);
});

// This For-Loop runs through all new, to roman converted, strings in the favoDatumData array
// It then pushes all converted dates to a new array, correcteData
// In the proces of pushing it also runs the function rejoin
for (let i = 0; i < favoDatumData.length; i++) {
  correcteData.push(rejoin(favoDatumData[i]));
}

// This function takes the input array and rejoins the strings in the array
// It rejoins the strings with a '-' in between
function rejoin(string) {
  let array = string.join("-");
  return array;
}

// This funcion was taken from stackoverflow, link below
// https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript
// This function converts arabic numerals to roman
function convertToRoman(num) {
  //create key:value pairs
  var romanLookup = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  var roman = [];
  var romanKeys = Object.keys(romanLookup);
  var curValue;
  var index;
  var count = 1;

  for (var numeral in romanLookup) {
    curValue = romanLookup[numeral];
    index = romanKeys.indexOf(numeral);

    while (num >= curValue) {
      if (count < 4) {
        //push up to 3 of the same numeral
        roman.push(numeral);
      } else {
        //else we had to push four, so we need to convert the numerals
        //to the next highest denomination "coloring-up in poker speak"

        //Note: We need to check previous index because it might be part of the current number.
        //Example:(9) would attempt (VIIII) so we would need to remove the V as well as the I's
        //otherwise removing just the last three III would be incorrect, because the swap
        //would give us (VIX) instead of the correct answer (IX)
        if (roman.indexOf(romanKeys[index - 1]) > -1) {
          //remove the previous numeral we worked with
          //and everything after it since we will replace them
          roman.splice(roman.indexOf(romanKeys[index - 1]));
          //push the current numeral and the one that appeared two iterations ago;
          //think (IX) where we skip (V)
          roman.push(romanKeys[index], romanKeys[index - 2]);
        } else {
          //else Example:(4) would attemt (IIII) so remove three I's and replace with a V
          //to get the correct answer of (IV)

          //remove the last 3 numerals which are all the same
          roman.splice(-3);
          //push the current numeral and the one that appeared right before it; think (IV)
          roman.push(romanKeys[index], romanKeys[index - 1]);
        }
      }
      //reduce our number by the value we already converted to a numeral
      num -= curValue;
      count++;
    }
    count = 1;
  }
  return roman.join("");
}

// Here I created a variable in which convert my array, correcteData, from an array containing strings to one long string
// The reason i did this is so i can more easily count the amount of a certain character.
// I could've used a for loop to run through every string seperately but that would've been a lot of (unnecessary) work
let datumString = correcteData.toString();

// Here I created an object in which I count the amount of occurences of a certain character
// The way I do this is by replacing every chacacter in the string, that isn't my desired character, with 'nothing'
// This way the only characters remaining in the string are the characters I want to count the occurences of
// The amount of occurences of the character is equal to the length of the (remaining) string
let aantalKeer = {
  M: datumString.replaceAll(/[^M]/g, "").length,
  C: datumString.replaceAll(/[^C]/g, "").length,
  X: datumString.replaceAll(/[^X]/g, "").length,
  V: datumString.replaceAll(/[^V]/g, "").length,
  I: datumString.replaceAll(/[^I]/g, "").length,
};

// Here I console.log the results of my code
console.log(huisdierData);
console.log(somPerSoort);
console.log(correcteData);
console.log("Hoevaak komt elk romeinse cijfer voor?", aantalKeer);
console.log(favoDatumText);

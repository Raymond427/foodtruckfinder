let request = require('request');

const APP_TOKEN = 'cEiDATvwKKkPghWJ6PC1obdBb';
let currentDate = new Date();
let currentTime24 = currentDate.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Los_Angeles' }).slice(0, 5);

request(
  `http://data.sfgov.org/resource/bbb8-hzi6.json?$$app_token=${APP_TOKEN}&dayorder=${currentDate.getDay()}&$select=applicant,location,dayorder,start24,end24&$order=applicant`,
  (error, response, body) => {
    if(error !== null || response.statusCode !== 200) {
      displayErrorMessage(body);
    } else {
      body = JSON.parse(body);
      body = filterOpenFoodTrucks(body, currentTime24);
      printTable(body);
    }
  }
);

function displayErrorMessage(body) {
  console.log(`There was an error retrieving the data
    Error Message: ${JSON.parse(body).message}
    Please try again later!`);
}

function filterOpenFoodTrucks(body, currentTime24) {
  return body.filter((foodTruck) => {
    return (currentTime24 >= foodTruck.start24 && currentTime24 < foodTruck.end24);
  }).slice(0, 10);
}

function printTable(body) {
  let result = "CURRENTLY OPEN FOOD TRUCKS\n\nNAME                 ADDRESS";
  for(let foodTruck of body) {
    let spacesBetween = (20 - foodTruck.applicant.length);
    let foodTruckName;
    if (spacesBetween < 0) {
      foodTruckName = foodTruck.applicant.slice(0, 16) + '... ';
    } else {
      let spaces = '';
      while(spacesBetween--) {
        spaces += ' ';
      }
      foodTruckName = foodTruck.applicant + spaces;
    }
    result += `\n${foodTruckName} ${foodTruck.location}`;
  }
  console.log(result);
}

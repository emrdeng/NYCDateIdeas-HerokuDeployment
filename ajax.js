require('dotenv').config()
const fs = require('fs');  // This module allows you to read files

const express = require("express");

const app = express();

app.use(express.static(__dirname));

app.get("/", function (req, res){
  res.sendFile(__dirname + "/index.html");
})

////////////////////////////////////////// CUISINE LIST: ///////////////////////////////////
app.get('/cuisineList', (req, res) => {
  // Read the cuisineNames.json file
  fs.readFile(process.env.CUISINENAMESJSON, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return res.status(500).json({ error: 'Failed to read the file' });
    }
    let cuisineData;
    try {
        cuisineData = JSON.parse(data);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return res.status(500).json({ error: 'Failed to parse JSON' });
    }
    // Send the environment variables along with the parsed JSON data
    res.json({
        CUISINENAMESJSON: cuisineData, 
        DATEACTIVITYBASEURL: process.env.DATEACTIVITYBASEURL,
        RESTBASEURL: process.env.RESTBASEURL,
        RESTAPIKEY: process.env.RESTAPIKEY,
        WEATHERURLCELSIUS: process.env.WEATHERURLCELSIUS,
        WEATHERURLFARENHEIT: process.env.WEATHERURLFARENHEIT,
        WEATHERFORECASTURLCELSIUS: process.env.WEATHERFORECASTURLCELSIUS,
        WEATHERFORECASTURLFARENHEIT: process.env.WEATHERFORECASTURLFARENHEIT,
    });
  });
});

////////////////////////////////////////// WEATHER API ROUTES: ///////////////////////////////////
app.get('/current-weather', (req, res) => {
  const unit = req.query.unit;
  const weatherURL = unit === "Celsius" ? process.env.WEATHERURLCELSIUS : process.env.WEATHERURLFARENHEIT;

  fetch(weatherURL)
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => res.status(500).json({ error: 'Failed to fetch current weather' }));
});

app.get('/forecast-weather', (req, res) => {
  const unit = req.query.unit;
  const weatherURL = unit === "Celsius" ? process.env.WEATHERFORECASTURLCELSIUS : process.env.WEATHERFORECASTURLFARENHEIT;

  fetch(weatherURL)
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => res.status(500).json({ error: 'Failed to fetch forecast weather' }));
});

////////////////////////////////////////// GLOBAL VARIABLES: ///////////////////////////////////
var dateActivityBaseURL = process.env.DATEACTIVITYBASEURL;

var parameterLocationId = "location_id=";
var locationId = "60763";

var parameterCurrency = "currency=";
var currency = "USD";

var parameterUnit = "lunit="
var lunit = "mi";

var parameterLimit = "limit=";
var limit = "30"

var parameterLang = "lang=";
var lang = "en_US";

var parameterRestAPIKey = "rapidapi-key="
var restAPIKey = process.env.RESTAPIKEY;

var parameterMinRating = "min_rating="
var minRating = "4";

var parameterOffset = "offset=";

var parameterSort = "sort="
var sort = "recommended"
var parameterSubCategory = "subcategory="
var and = "&"

// Date activity Subcategory Array that it randomizes off of:
var subcategoryArray = ["40", "41", "49", "20", "0", "56", "61", "58", "57"];

////////////////////////////////////////// DATE ACTIVITY API: ///////////////////////////////////
app.get('/fetch-date-activity', (req, res) => {
  //Setting up all the variable fetch URL variables:
  var subcategoryRandomNumber = Math.round(Math.random() * (subcategoryArray.length - 1));
  var dateActivitySubCategory = subcategoryArray[subcategoryRandomNumber];

  //This will identify a random number for the offset:
  var dateActivityRandomOffsetNumber = Math.round(Math.random() * 50);

  var dateActivityFetchURL = dateActivityBaseURL + parameterLocationId + locationId + and + parameterSort + sort + and + parameterSubCategory + dateActivitySubCategory + and + parameterCurrency + currency + and + parameterUnit + lunit + and + parameterLimit + limit + and + parameterLang + lang + and + parameterRestAPIKey + restAPIKey + and + parameterMinRating + minRating + and + parameterOffset + dateActivityRandomOffsetNumber;

  fetch(dateActivityFetchURL)
    .then(response => response.json())
    .then(data => {
      // Check if 'paging.results' is 0, if so, refetch
      if (data.paging.results === 0) {
        return fetchNewDateActivity();  // Function to refetch
      }

      // Ensure we have valid data to pick from
      let dateActivityActualArrayResults = data.data.length;
      let dateActivityRandomNumber = Math.round(Math.random() * (dateActivityActualArrayResults - 1));

      if (Object.keys(data.data[dateActivityRandomNumber]).length < 30) {
        if (!data.data[dateActivityRandomNumber + 1]) {
          dateActivityRandomNumber = dateActivityRandomNumber - 1;
        } else {
          dateActivityRandomNumber = dateActivityRandomNumber + 1;
        }
      }
      let selectedActivity = data.data[dateActivityRandomNumber];
      res.json(selectedActivity);
    })
    .catch(error => {
      console.error("Error fetching from the external API:", error);
      res.status(500).send("Failed to fetch data from the external API");
    });
});

// This function is only called if the random Date Activity fetch result has 0 results at the first random number.
function fetchNewDateActivity() {
  return fetch('/fetch-date-activity')
    .then(res => res.json())
    .catch(error => {
      console.error("Error fetching a new date activity:", error);
      return {};
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

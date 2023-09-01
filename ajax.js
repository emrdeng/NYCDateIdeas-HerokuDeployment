require('dotenv').config()
const fs = require('fs');  // This module allows you to read files

const express = require("express");

const app = express();

app.use(express.json());
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
        cuisineNames = cuisineData;
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return res.status(500).json({ error: 'Failed to parse JSON' });
    }
    // Send the environment variables along with the parsed JSON data
    res.json({
        CUISINENAMESJSON: cuisineData,
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
////////////////// CHECKBOX PARAMETERS://///////////////////
var dateSave = false;
var restSave = false;
var dessertSave = false;

var restWalkDistance = true;
var dessertWalkDistance = true;

console.log(`dateSave is: ${dateSave}`)
console.log(`restSave is: ${restSave}`)
console.log(`dessertSave is: ${dessertSave}`)
console.log(`restWalkDistance is: ${restWalkDistance}`)
console.log(`dessertWalkDistance is: ${dessertWalkDistance}`)

////////////////// FORM SUBMIT PARAMETERS://///////////////////
var cuisineNames; //Note that this is JUST the full cuisineJSON file NOT the specific cuisine submitted by the user.

var pricesRestaurants;

var cuisineSearchKey;

///////////////// DATE ACTIVITY API PARAMETERS://///////////////////
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

///////////////// RESTAURANT API PARAMETERS://///////////////////
var restBaseURL = process.env.RESTBASEURL;
var parameterLocationId = "location_id=";

var parameterRestAPIKey = "rapidapi-key="
var restAPIKey = process.env.RESTAPIKEY;

var parameterRestPrice = "prices_restaurants=";
var parameterCombinedFoodKey = "combined_food=";

var dateActivityLocation;

///////////////// DESSERT API PARAMETERS://///////////////////
var parameterRestTag = "restaurant_tagcategory=";

var restTagCategory;

var restLocation;

/////////////////// HANDLES DATING STATUS DETAIL THAT DETERMINES WHAT FUNCTIONS TO RUN ////////////////////////////
app.post('/checkbox-info', (req, res) => {
  // Get the data from the request body
  const { 
    dateSave, 
    restSave, 
    dessertSave, 
    restWalkDistance, 
    dessertWalkDistance 
  } = req.body;

  // Send a response back to the frontend
  res.json({ message: 'Data received successfully' });
});

///////////////////// ONE SUBMIT BUTTON POSTING GLOBAL VARIABLES FROM THE USER FORM: //////////////////////////////////
app.post('/form-submit',(req, res) => {
  const { userSubmittedPriceRange, userSubmittedCuisineSearch, userSubmittedExtraChatTime } = req.body;

  if (userSubmittedPriceRange === "$") {
    pricesRestaurants = "10953";
  } else if (userSubmittedPriceRange === "$$ - $$$") {
    pricesRestaurants = "10955";
  } else if (userSubmittedPriceRange === "$$$$") {
    pricesRestaurants = "10954";
  } else {
    pricesRestaurants = "all"
  }

  if (userSubmittedExtraChatTime === "Bars & Pubs") {
    restTagCategory = "11776";
  } else if (userSubmittedExtraChatTime === "Coffee & Tea") {
    restTagCategory = "9900";
  } else if (userSubmittedExtraChatTime === "Dessert") {
    restTagCategory = "9909,9901";
  } else if (userSubmittedExtraChatTime === "Any") {
    restTagCategory = "11776,9900,9909,9901";
  }

  //This will identify the key that correlates with the cuisine search result.
  function getKeyByCuisineValue(object, value) {
    var x = Object.keys(object)
    return x.find(function(key) {
      return object[key].label.toLowerCase() === value.toLowerCase()
    });
  }

  if (userSubmittedCuisineSearch === "") {
    cuisineSearchKey = "all";
  } else {
    cuisineSearchKey = getKeyByCuisineValue(cuisineNames, userSubmittedCuisineSearch);
  };

  res.json({ success: true, message: 'Data processed' });
})

///////////////////// ONE SUBMIT BUTTON FETCHING EVERYTHING: /////////////////////////////////////////////
app.get('/fetch-data', async (req, res) => {
  try {
      let results = {};

      if (!dateSave) {
          const dateData = await fetchDateActivity();
          results.dateActivity = dateData;
      }

      if (!restSave) {
          const restData = await fetchRestaurantAPI(); // You'll need to implement fetchRestaurant()
          results.restaurant = restData;
      }

      if (!dessertSave) {
          const dessertData = await fetchDessertAPI(); // You'll need to implement fetchDessert()
          results.dessert = dessertData;
      }

      console.log(JSON.stringify(results.dateActivity))
      console.log(JSON.stringify(results.restaurant))
      console.log(JSON.stringify(results.dessert))
      res.json(results);

  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Failed to fetch data");
  }
});

////////////////////////////////////////// DATE ACTIVITY API: ///////////////////////////////////
async function fetchDateActivity(){
  //Setting up all the variable fetch URL variables:
  var subcategoryRandomNumber = Math.round(Math.random() * (subcategoryArray.length - 1));
  var dateActivitySubCategory = subcategoryArray[subcategoryRandomNumber];

  //This will identify a random number for the offset:
  var dateActivityRandomOffsetNumber = Math.round(Math.random() * 50);

  var dateActivityFetchURL = dateActivityBaseURL + parameterLocationId + locationId + and + parameterSort + sort + and + parameterSubCategory + dateActivitySubCategory + and + parameterCurrency + currency + and + parameterUnit + lunit + and + parameterLimit + limit + and + parameterLang + lang + and + parameterRestAPIKey + restAPIKey + and + parameterMinRating + minRating + and + parameterOffset + dateActivityRandomOffsetNumber;

  try{
    const response = await fetch(dateActivityFetchURL);
    const data = await response.json();

    if (data.paging.results === 0) {
      return fetchDateActivity();  // Function to refetch
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

    // This whole section is simply to identify the location of the date activity because the search for restaurant will be based off of the date activity location if it needs to be within walking distance.
    var dateActivityNeighborhoodInfoArray = data.data[dateActivityRandomNumber].neighborhood_info;

    function findTheRightLocation(x) {
      if (x.location_id != "60763" && x.location_id != "15565668" && x.location_id != "7102352" && x.location_id != "15565677"){
        return true;
      }
    };

    if (dateActivityNeighborhoodInfoArray == null) {
      // So if the date activity returns no neighborhood information, then just keep dateActivityLocation as 60763
      dateActivityLocation = "60763";
    } else if (restWalkDistance === false) {
      // If restaurant does NOT have to be within walking distance, then keep dateActivityLocation as 60763
      dateActivityLocation = "60763";
    } else if (restWalkDistance === true) {
      // IF the restaurant HAS TO BE within walking distance of the date activity, then it will search through the dateActivityNeighborhoodInfoArray's "location_id". And if returns an index that isn't -1, it will use that location as the new dateActivityLocation. If it returns a -1, it will stick with location of 60763.
        if (dateActivityNeighborhoodInfoArray.findIndex(findTheRightLocation) === -1) {
          dateActivityLocation = "60763";
        } else {
          dateActivityLocation = data.data[dateActivityRandomNumber].neighborhood_info[dateActivityNeighborhoodInfoArray.findIndex(findTheRightLocation)].location_id;
        }
    } else {
      dateActivityLocation = dateActivityData.data[dateActivityRandomNumber].neighborhood_info[0].location_id;
    }
    return data.data[dateActivityRandomNumber];
  } catch(error) {
    console.error("Error fetching date activity:", error);
    throw error; // or handle the error as appropriate for your use case
  }
}

////////////////////////////////////////// RESTAURANT API: ///////////////////////////////////
async function fetchRestaurantAPI(){

  var restaurantFetchURL = restBaseURL + parameterLocationId + dateActivityLocation + and + parameterCurrency + currency + and + parameterUnit + lunit + and + parameterLimit + limit + and + parameterLang + lang + and + parameterRestAPIKey + restAPIKey + and + parameterMinRating + minRating + and + parameterRestPrice + pricesRestaurants + and + parameterCombinedFoodKey + cuisineSearchKey;

  try{
    const response = await fetch(restaurantFetchURL);
    const data = await response.json();

    if (data.paging.results === 0) {
      restLocation = "60763";
      return null;  // Function to refetch
    }

    // Ensure we have valid data to pick from
    let restActualArrayResults = data.data.length;
    console.log(`restActualArrayResults is: ${restActualArrayResults}`)
    let firstPageRandomNumber = Math.round(Math.random() * (restActualArrayResults - 1));
    console.log(`firstPageRandomNumber is: ${firstPageRandomNumber}`)
    if (Object.keys(data.data[firstPageRandomNumber]).length < 30) {
      if (data.data[firstPageRandomNumber + 1] == null || data.data[firstPageRandomNumber + 1] == undefined) {
        firstPageRandomNumber = firstPageRandomNumber - 1;
      } else {
        firstPageRandomNumber = firstPageRandomNumber + 1;
      }
    };

    // This whole section is simply to identify the location of the restaurant because the search for dessert will be based off of the restaurant location if it needs to be within walking distance.
    var restaurantNeighborhoodInfoArray = data.data[firstPageRandomNumber].neighborhood_info;

    function findTheRestRightLocation(x) {
      if (x.location_id != "60763" && x.location_id != "15565668" && x.location_id != "7102352" && x.location_id != "15565677") {
        return true;
      }
    };

    if (restaurantNeighborhoodInfoArray == null) {
      // So if the restaurant returns no neighborhood information, then just keep restLocation as 60763
      restLocation = "60763";
    } else if (dessertWalkDistance === false) {
      // If dessert does NOT have to be within walking distance, then keep restLocation as 60763
      dateActivityLocation = "60763";
    } else if (dessertWalkDistance === true) {
      // IF the dessert HAS TO BE within walking distance of the restaurant, then it will search through the restaurantNeighborhoodInfoArray's "location_id". And if returns an index that isn't -1, it will use that location as the new restLocation. If it returns a -1, it will stick with location of 60763.
        if (restaurantNeighborhoodInfoArray.findIndex(findTheRestRightLocation) === -1) {
          restLocation = "60763";
        } else {
          restLocation = data.data[firstPageRandomNumber].neighborhood_info[restaurantNeighborhoodInfoArray.findIndex(findTheRestRightLocation)].location_id;
        }
    } else {
      restLocation = data.data[firstPageRandomNumber].neighborhood_info[0].location_id;
    }

    return data.data[firstPageRandomNumber];

  } catch(error) {
    console.error("Error fetching restaurant:", error);
    throw error; // or handle the error as appropriate for your use case
  }
}

////////////////////////////////////////// DESSERT API: ///////////////////////////////////
async function fetchDessertAPI(){

  var dessertFetchURL = restBaseURL + parameterLocationId + restLocation + and + parameterCurrency + currency + and + parameterUnit + lunit + and + parameterLimit + limit + and + parameterLang + lang + and + parameterRestAPIKey + restAPIKey + and + parameterMinRating + minRating + and + parameterRestPrice + pricesRestaurants + and + parameterRestTag + restTagCategory;

  try{
    const response = await fetch(dessertFetchURL);
    const data = await response.json();

    if (data.paging.results === 0) {
      return null;  // Function to refetch
    }

    // Ensure we have valid data to pick from
    let dessertActualArrayResults = data.data.length;
    let firstPageRandomNumber = Math.round(Math.random() * (dessertActualArrayResults - 1));

    if (Object.keys(data.data[firstPageRandomNumber]).length < 30) {
      if (data.data[firstPageRandomNumber + 1] == null || data.data[firstPageRandomNumber + 1] == undefined) {
        firstPageRandomNumber = firstPageRandomNumber - 1;
      } else {
        firstPageRandomNumber = firstPageRandomNumber + 1;
      }
    };

    return data.data[firstPageRandomNumber];

  } catch(error) {
    console.error("Error fetching dessert:", error);
    throw error; // or handle the error as appropriate for your use case
  }
}

////////////////////////////////////////// MY PORT: ///////////////////////////////////
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
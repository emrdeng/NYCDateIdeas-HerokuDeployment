console.log("App.js is running!")
// Identifying the elements:
const dateControl = document.querySelector("input[type=date]");
const submitBtn = document.querySelector(".submit-btn");
const heartBtn = document.querySelector(".heart-btn");

const restCloseBtn = document.querySelector(".rest-close-button");
const dessertCloseBtn = document.querySelector(".dessert-close-button");

const dateSaveCheckbox = document.querySelector(".date-activity-save-checkbox");
const restSaveCheckbox = document.querySelector(".rest-save-checkbox");
const dessertSaveCheckbox = document.querySelector(".dessert-save-checkbox");

const restWalkDistance = document.querySelector(".rest-walking-checkbox");
const dessertWalkDistance = document.querySelector(".dessert-walking-checkbox");

// EVENT LISTENERS FOR THE DATING STATUSES:
dateSaveCheckbox.addEventListener('click', sendCheckboxDataToBackend);
restSaveCheckbox.addEventListener('click', sendCheckboxDataToBackend);
dessertSaveCheckbox.addEventListener('click', sendCheckboxDataToBackend);
restWalkDistance.addEventListener('click', sendCheckboxDataToBackend);
dessertWalkDistance.addEventListener('click', sendCheckboxDataToBackend);

// EVENT LISTENERS FOR THE SUBMIT BUTTON:
// submitBtn.addEventListener("click", callEverything);
submitBtn.addEventListener("click", function(event) {
  event.preventDefault();
  callEverything();
});
submitBtn.addEventListener("mouseover", heartAnimation);

// Storing the locations of the date activity and restaurant:
var dateActivityLocationArray = [];
var restLocationArray = [];

// GLOBAL PARAMETERS FOR THE FRONT END MEMORY OF THE DATE DETAILS:

let dateActivityData;
let restaurant;
let dessert;

// Function heartAnimation This is the animation of the heart button on hover.
function heartAnimation() {
  var heartElement = heartBtn.classList;
  heartElement.add("fa-flip");
  setTimeout(removeFlipClass, 1750);

  function removeFlipClass() {
    heartElement.toggle("fa-flip");
    heartElement.toggle("fa-heart");
    heartElement.toggle("fa-heart-crack");
  }
}

//Function addBtnMouseOver changes the i-class to an orange color upon hover and removes the effect when no longer hovering:
function addBtnMouseOver() {
  document.querySelector(".fa-plus").style.color = "#b54507";
}

function addBtnMouseOut() {
  document.querySelector(".fa-plus").style.color = "#1C3879";
}

/////////////// THIS WILL SEND THE DATING STATUSES TO THE BACKEND: /////////////////
function sendCheckboxDataToBackend() {
  const data = {
    dateSave: dateSaveCheckbox.checked,
    restSave: restSaveCheckbox.checked,
    dessertSave: dessertSaveCheckbox.checked,
    restWalkDistance: restWalkDistance.checked,
    dessertWalkDistance: dessertWalkDistance.checked
  };

  fetch('/checkbox-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

/////////////// SEARCH BAR: ////////////////////
var cuisineSearch = document.getElementById("cuisine-selection");

// Initial event listener to fetch the data
cuisineSearch.addEventListener("focus", fetchData, { once: true });

let cuisineNames;

function fetchData() {
  console.log("fetchData is running!")
  fetch("https://nyc-date-planner-224c86480c8a.herokuapp.com/cuisineList")
      .then(response => response.json())
      .then(data => {
        cuisineNames = data;
        attachAutocomplete(cuisineNames.CUISINENAMESJSON);
      });
}

function attachAutocomplete(cuisineJSON) {
    var sortedCuisineNames = Object.values(cuisineJSON).map(item => item.label).sort();

    cuisineSearch.addEventListener("keyup", function(e) {
        removeElements();
        if (!cuisineSearch.value) return;

        const matchedCuisines = sortedCuisineNames.filter(cuisine => 
            cuisine.toLowerCase().startsWith(cuisineSearch.value.toLowerCase())
        );

        // Using a fragment to minimize DOM reflows/repaints
        let fragment = document.createDocumentFragment();
        matchedCuisines.forEach(i => {
            var listCuisine = document.createElement("li");
            listCuisine.classList.add("list-items");
            listCuisine.style.cursor = "pointer";
            listCuisine.addEventListener("click", function() {
              displayNames(i);
          });
            var word = "<b>" + i.substr(0, cuisineSearch.value.length) + "<b>";
            word += i.substr(cuisineSearch.value.length);
            listCuisine.innerHTML = word;
            fragment.appendChild(listCuisine);
        });
        document.querySelector(".list").appendChild(fragment);
    });
}

function displayNames(value) {
  document.getElementById("cuisine-selection").value = value;
  removeElements();
}

function removeElements() {
  var items = document.querySelectorAll(".list-items");
  items.forEach(item => item.remove());
}



//This is the overarching button formula that will address everything.
function callEverything() {
  // This identifies the key for the rest-tag-category parameter based on the user submitted item.
  //This will also hide the extra chat time div if the user submitted "none".
  var userSubmittedExtraChatTime = document.getElementById("extra-chat-time").value;
  //This is what the user submitted as the date for the weather function.
  var userSubmittedDate = dateControl.value;
  //This will control the number of panels that shows up based on the user submitted parameters.
  if (userSubmittedExtraChatTime === "None" && userSubmittedDate === "") {
    document.querySelector(".dessert-div").style.display = "none";
    document.querySelector(".weather-div").style.display = "none";
    document.querySelector(".rightmost-container").style.gridTemplateColumns = "1fr 1fr";
    document.querySelector(".rightmost-container").style.display = "grid";
  } else if (userSubmittedExtraChatTime === "None" && userSubmittedDate != "") {
    document.querySelector(".dessert-div").style.display = "none";
    document.querySelector(".rightmost-container").style.display = "grid";
    document.querySelector(".rightmost-container").style.gridTemplateColumns = "0.6fr 1fr 1fr";
    document.querySelector(".weather-details").style.justifyContent = "center";
    document.querySelector(".weather-details").style.alignItems = "center;"
    callTheWeather();
  } else if (userSubmittedExtraChatTime != "None" && userSubmittedDate != "") {
    document.querySelector(".dessert-div").style.display = "";
    document.querySelector(".rightmost-container").style.display = "grid";
    document.querySelector(".rightmost-container").style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
    callTheWeather();
  } else if (userSubmittedExtraChatTime != "None" && userSubmittedDate === "") {
    document.querySelector(".weather-div").style.display = "none";
    document.querySelector(".dessert-div").style.display = "";
    document.querySelector(".rightmost-container").style.display = "grid";
    document.querySelector(".rightmost-container").style.gridTemplateColumns = "1fr 1fr 1fr";
  }

  //DATE ACTIVITY DIV: This will run the date activity information:

  // if (dateSaveCheckbox.checked === false) {
  //   return dateHappily();
  // } else if (dateSaveCheckbox.checked === true && restSaveCheckbox.checked === true && dessertSaveCheckbox.checked === true) {
  //   console.log("Nothing needs to run. All items have been saved.")
  // } else if (dateSaveCheckbox.checked === true && restSaveCheckbox.checked === true && dessertSaveCheckbox.checked === false) {
  //   postSaveDessert();
  // } else if (dateSaveCheckbox.checked === true && restSaveCheckbox.checked === false && dessertSaveCheckbox.checked === false) {
  //   postSaveRestaurant();
  //   postSaveDessert();
  // } else if (dateSaveCheckbox.checked === true && restSaveCheckbox.checked === false && dessertSaveCheckbox.checked === true) {
  //   postSaveRestaurant();
  // }

  //This will be the function that houses the Javascript Fetch for the Date Activity panel (incl. the random number offset):

  ////////////////////////////////HANDLES THE POSTING OF THE FORM SUBMISSION: ///////////////////
  var priceRange = document.getElementById("price-range")
  var userSubmittedPriceRange = priceRange.value;
  
  var userSubmittedCuisineSearch = document.getElementById("cuisine-selection").val
  
  const formDataToSend = {
    userSubmittedPriceRange: userSubmittedPriceRange,
    userSubmittedCuisineSearch: userSubmittedCuisineSearch
  };

  fetch("/form-submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formDataToSend)
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server
      console.log(data);
    })
    .catch(error => {
      console.error("Error:", error);
    });

  ////////////////////////////////HANDLES THE FETCHING OF DETAILS: ///////////////////

  fetch('/fetch-data')
    .then(response => response.json())
    .then(data => {
      // Only update parts of the state that are present in the response
      if (data.dateActivity) dateActivityData = data.dateActivity;
      if (data.restaurant) restaurant = data.restaurant;
      if (data.dessert) dessert = data.dessert;

      updateFrontendDisplay();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

  
  function updateFrontendDisplay(){
    // THIS HANDLES THE FETCHED DATE ACTIVITY FROM BACK END AND PUTS IT INTO THE FRONT END:
    var dateActivityName = dateActivityData.name;
    document.querySelector(".date-activity-title").innerHTML = dateActivityName;

    if (dateActivityData.photo == null || dateActivityData.photo === "" || dateActivityData.photo == undefined) {
      document.querySelector(".date-activity-pic").style.display = "none";
      document.querySelector(".date-activity-pic-error").style.display = "flex";
    } else {
      var dateActivityPhoto = dateActivityData.photo.images.large.url;
      document.querySelector(".date-activity-pic").setAttribute("src", dateActivityPhoto);
      document.querySelector(".date-activity-pic").style.display = "";
      document.querySelector(".date-activity-pic-error").style.display = "none"
    }

    var dateActivityWebsite = dateActivityData.website;
    if (dateActivityWebsite === "" || dateActivityWebsite == null || dateActivityWebsite == undefined) {
      document.querySelector(".date-activity-links-paragraph").innerHTML = "<a href='' target='_blank' class='date-activity-reviews'>TripAdvisor reviews</a>"
    } else {
      document.querySelector(".date-activity-links-paragraph").innerHTML = "<a href='' target='_blank' class='date-activity-link'>Website</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href='' target='_blank' class='date-activity-reviews'>TripAdvisor reviews</a>"
      document.querySelector(".date-activity-link").setAttribute("href", dateActivityWebsite);
    };
    var dateActivityTripAdvisor = dateActivityData.web_url;
    document.querySelector(".date-activity-reviews").setAttribute("href", dateActivityTripAdvisor);

    var dateActivityPhone = dateActivityData.phone;
    if (dateActivityPhone === "" || dateActivityPhone == null || dateActivityPhone == undefined) {
      document.querySelector(".date-activity-phone").style.display = "none";
    } else {
      document.querySelector(".date-activity-phone").style.display = "";
      document.querySelector(".date-activity-phone").innerHTML = dateActivityPhone;
    };

    // DATE ACTIVITY ADDRESS EDITS:
    var dateActivityStreet1 = dateActivityData.address_obj.street1;
    var dateActivityCity = dateActivityData.address_obj.city;
    var dateActivityState = dateActivityData.address_obj.state;
    if (dateActivityStreet1 == null || dateActivityStreet1 == undefined || dateActivityStreet1 === "") {
      document.querySelector(".date-activity-street-1").style.display = "none";
    } else {
      document.querySelector(".date-activity-street-1").style.display = "";
      document.querySelector(".date-activity-street-1").innerHTML = dateActivityStreet1;
    }
    if (dateActivityData.address_obj.postalcode == null || dateActivityData.address_obj.postalcode == undefined || dateActivityData.address_obj.postalcode === "") {
      document.querySelector(".date-activity-city").innerHTML = dateActivityCity + ", " + dateActivityState;
    } else {
      let dateActivityZip = (dateActivityData.address_obj.postalcode);
      let dateActivityZipCut = dateActivityZip.split("-")[0];
      document.querySelector(".date-activity-city").innerHTML = dateActivityCity + ", " + dateActivityState + " " + dateActivityZipCut;
    };

    //OTHER DATE ACTIVITY EDITS:
    var dateActivityRating = dateActivityData.rating;
    document.querySelector(".dadg4").innerHTML = dateActivityRating
    var dateActivityDescription = dateActivityData.description;
    document.querySelector(".date-activity-description-paragraph").innerHTML = dateActivityDescription

  } // End of the updateFrontendDisplay()
    
    

  function dateHappily() {

    // THIS HANDLES THE FETCHING OF THE DATE ACTIVITY FROM THE BACKEND:
    // let dateActivityData;

    // fetch("https://nyc-date-planner-224c86480c8a.herokuapp.com/fetch-date-activity")
    //   .then(response => response.json())
    //   .then(dateActivityJSON => {
    //     console.log("dateActivityFetched!")
    //     console.log(dateActivityJSON)
    //     dateActivityData = dateActivityJSON
    //   })
    //   .catch(error => {
    //     console.error("There was an error fetching the date activity data:", error);
    //   });
    
    // // THIS HANDLES THE FETCHED DATE ACTIVITY FROM BACK END AND PUTS IT INTO THE FRONT END:
    // var dateActivityName = dateActivityData.name;
    // document.querySelector(".date-activity-title").innerHTML = dateActivityName;

    // if (dateActivityData.photo == null || dateActivityData.photo === "" || dateActivityData.photo == undefined) {
    //   document.querySelector(".date-activity-pic").style.display = "none";
    //   document.querySelector(".date-activity-pic-error").style.display = "flex";
    // } else {
    //   var dateActivityPhoto = dateActivityData.photo.images.large.url;
    //   document.querySelector(".date-activity-pic").setAttribute("src", dateActivityPhoto);
    //   document.querySelector(".date-activity-pic").style.display = "";
    //   document.querySelector(".date-activity-pic-error").style.display = "none"
    // }

    // var dateActivityWebsite = dateActivityData.website;
    // if (dateActivityWebsite === "" || dateActivityWebsite == null || dateActivityWebsite == undefined) {
    //   document.querySelector(".date-activity-links-paragraph").innerHTML = "<a href='' target='_blank' class='date-activity-reviews'>TripAdvisor reviews</a>"
    // } else {
    //   document.querySelector(".date-activity-links-paragraph").innerHTML = "<a href='' target='_blank' class='date-activity-link'>Website</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href='' target='_blank' class='date-activity-reviews'>TripAdvisor reviews</a>"
    //   document.querySelector(".date-activity-link").setAttribute("href", dateActivityWebsite);
    // };
    // var dateActivityTripAdvisor = dateActivityData.web_url;
    // document.querySelector(".date-activity-reviews").setAttribute("href", dateActivityTripAdvisor);

    // var dateActivityPhone = dateActivityData.phone;
    // if (dateActivityPhone === "" || dateActivityPhone == null || dateActivityPhone == undefined) {
    //   document.querySelector(".date-activity-phone").style.display = "none";
    // } else {
    //   document.querySelector(".date-activity-phone").style.display = "";
    //   document.querySelector(".date-activity-phone").innerHTML = dateActivityPhone;
    // };

    // // DATE ACTIVITY ADDRESS EDITS:
    // var dateActivityStreet1 = dateActivityData.address_obj.street1;
    // var dateActivityCity = dateActivityData.address_obj.city;
    // var dateActivityState = dateActivityData.address_obj.state;
    // if (dateActivityStreet1 == null || dateActivityStreet1 == undefined || dateActivityStreet1 === "") {
    //   document.querySelector(".date-activity-street-1").style.display = "none";
    // } else {
    //   document.querySelector(".date-activity-street-1").style.display = "";
    //   document.querySelector(".date-activity-street-1").innerHTML = dateActivityStreet1;
    
    // if (dateActivityData.address_obj.postalcode == null || dateActivityData.address_obj.postalcode == undefined || dateActivityData.address_obj.postalcode === "") {
    //   document.querySelector(".date-activity-city").innerHTML = dateActivityCity + ", " + dateActivityState;
    // } else {
    //   let dateActivityZip = (dateActivityData.address_obj.postalcode);
    //   let dateActivityZipCut = dateActivityZip.split("-")[0];
    //   document.querySelector(".date-activity-city").innerHTML = dateActivityCity + ", " + dateActivityState + " " + dateActivityZipCut;
    // };

    // //OTHER DATE ACTIVITY EDITS:
    // var dateActivityRating = dateActivityData.rating;
    // document.querySelector(".dadg4").innerHTML = dateActivityRating
    // var dateActivityDescription = dateActivityData.description;
    // document.querySelector(".date-activity-description-paragraph").innerHTML = dateActivityDescription

        //FIGURING OUT THE LOCATION OF THE RESTAURANT TO INPUT INTO THE DESSERT FUNCTION:

        // var dateActivityNeighborhoodInfoArray = dateActivityData.neighborhood_info;

        // function findTheRightLocation(x) {
        //   if (x.location_id != "60763" && x.location_id != "15565668" && x.location_id != "7102352" && x.location_id != "15565677") {
        //     return true;
        //   }
        // };

        // function findTheSecondRightLocation(x) {
        //   if (x.location_id != "60763") {
        //     return true;
        //   }
        // };

        // if (dateActivityNeighborhoodInfoArray == null) {
        //   var dateActivityLocation = "60763";
        // } else if (restWalkDistance.checked === false) {
        //   var dateActivityLocation = "60763";
        // } else if (restWalkDistance.checked === true) {
        //   if (dateActivityNeighborhoodInfoArray.findIndex(findTheRightLocation) === -1) {
        //     var dateActivityLocation = "60763";
        //   } else {
        //     var dateActivityLocation = dateActivityData.data[dateActivityRandomNumber].neighborhood_info[dateActivityNeighborhoodInfoArray.findIndex(findTheRightLocation)].location_id;
        //   }
        // } else {
        //   var dateActivityLocation = dateActivityData.data[dateActivityRandomNumber].neighborhood_info[0].location_id;
        // }

        // dateActivityLocationArray.push(dateActivityLocation);

        //This is the noFaceDemandsFood()function that is embedded within this Date Activity function.
        noFaceDemandsFood();

        function noFaceDemandsFood() {
          //Setting up all the fetch URL variables:
          // var restBaseURL = process.env.RESTBASEURL;
          // var parameterLocationId = "location_id=";

          // var parameterCurrency = "currency=";
          // var currency = "USD";

          // var parameterUnit = "lunit="
          // var lunit = "mi";

          // var parameterLimit = "limit=";
          // var limit = "30"

          // var parameterLang = "lang=";
          // var lang = "en_US";

          // var parameterRestAPIKey = "rapidapi-key="
          // var restAPIKey = process.env.RESTAPIKEY;

          // var parameterMinRating = "min_rating="
          // var minRating = "4";

          // var parameterRestPrice = "prices_restaurants="
          // var parameterCombinedFoodKey = "combined_food="
          // var parameterRestTag = "restaurant_tagcategory="

          // var and = "&"

          // //This will identify the key for the price-range submitted by the user.
          // var priceRange = document.getElementById("price-range")
          // var userSubmittedPriceRange = priceRange.value;
          // if (userSubmittedPriceRange === "$") {
          //   var pricesRestaurants = "10953";
          // } else if (userSubmittedPriceRange === "$$ - $$$") {
          //   var pricesRestaurants = "10955";
          // } else if (userSubmittedPriceRange === "$$$$") {
          //   var pricesRestaurants = "10954";
          // } else {
          //   var pricesRestaurants = "all"
          // }

          // //This will identify the key that correlates with the cuisine search result.
          // function getKeyByCuisineValue(object, value) {
          //   var x = Object.keys(object)
          //   return x.find(function(key) {
          //     return object[key].label.toLowerCase() === value.toLowerCase()
          //   });
          // }
          // var userSubmittedCuisineSearch = document.getElementById("cuisine-selection").value;

          // if (userSubmittedCuisineSearch === "") {
          //   var cuisineSearchKey = "all";
          // } else {
          //   var cuisineSearchKey = getKeyByCuisineValue(cuisineNames, userSubmittedCuisineSearch);
          // };

          var restaurantFetchURL = restBaseURL + parameterLocationId + dateActivityLocation + and + parameterCurrency + currency + and + parameterUnit + lunit + and + parameterLimit + limit + and + parameterLang + lang + and + parameterRestAPIKey + restAPIKey + and + parameterMinRating + minRating + and + parameterRestPrice + pricesRestaurants + and + parameterCombinedFoodKey + cuisineSearchKey;

          if (restSaveCheckbox.checked === false) {
            reRestaurantFetch(restaurantFetchURL);
          } else if (restSaveCheckbox.checked === true && dessertSaveChecbox.checked === true) {
          } else if (restSaveCheckbox.checked === true && dessertSaveChecbox.checked === false) {
            postSaveDessert();
          }

          function reRestaurantFetch(x) {
            const data = null;
            const xhr = new XMLHttpRequest();

            xhr.open("GET", x, true);
            xhr.addEventListener("readystatechange", restaurantCallFunction);

            function restaurantCallFunction() {
              if (this.readyState === this.DONE) {
                var restaurantData = JSON.parse(this.responseText);
                var restPage1Results = restaurantData.paging.results;
                var restTotalResults = restaurantData.paging.total_results;
                var restActualArrayResults = restaurantData.data.length;

                if (restActualArrayResults == null || restActualArrayResults == undefined || restActualArrayResults === 0 || restActualArrayResults === "") {
                  document.querySelector(".restaurant-div").style.display = "none";
                  document.querySelector(".rest-error-page").style.display = "block";
                  if (userSubmittedExtraChatTime === "None" && userSubmittedDate === "") {
                    document.querySelector(".rightmost-container").style.gridTemplateColumns = "1fr 1fr";
                    document.querySelector(".rightmost-container").style.display = "grid";
                  } else if (userSubmittedExtraChatTime === "None" && userSubmittedDate != "") {
                    document.querySelector(".rightmost-container").style.display = "grid";
                    document.querySelector(".rightmost-container").style.gridTemplateColumns = "1fr 1fr 1fr";
                  } else if (userSubmittedExtraChatTime != "None" && userSubmittedDate != "") {
                    document.querySelector(".rightmost-container").style.display = "grid";
                    document.querySelector(".rightmost-container").style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
                  } else if (userSubmittedExtraChatTime != "None" && userSubmittedDate === "") {
                    document.querySelector(".rightmost-container").style.display = "grid";
                    document.querySelector(".rightmost-container").style.gridTemplateColumns = "1fr 1fr 1fr";
                  }
                  restCloseBtn.addEventListener("click", closeRestErrorPage);

                  function closeRestErrorPage() {
                    document.querySelector(".restaurant-div").style.display = "";
                    document.querySelector(".rest-error-page").style.display = "none";
                    var reRunRestaurantFetchURL = restBaseURL + parameterLocationId + locationId + and + parameterCurrency + currency + and + parameterUnit + lunit + and + parameterLimit + limit + and + parameterLang + lang + and + parameterRestAPIKey + restAPIKey + and + parameterMinRating + minRating + and + parameterRestPrice + pricesRestaurants + and + parameterCombinedFoodKey + cuisineSearchKey;
                    reRestaurantFetch(reRunRestaurantFetchURL);
                  } //This is the end of the function closeRestErrorPage()
                } else {
                  document.querySelector(".restaurant-div").style.display = "";
                  document.querySelector(".rest-error-page").style.display = "none";
                  var firstPageRandomNumber = Math.round(Math.random() * (restActualArrayResults - 1));
                  if (Object.keys(restaurantData.data[firstPageRandomNumber]).length < 30) {
                    if (restaurantData.data[firstPageRandomNumber + 1] == null || restaurantData.data[firstPageRandomNumber + 1] == undefined) {
                      firstPageRandomNumber = firstPageRandomNumber - 1;
                    } else {
                      firstPageRandomNumber = firstPageRandomNumber + 1;
                    }
                  };

                  var restName = restaurantData.data[firstPageRandomNumber].name;
                  document.querySelector(".rest-title").innerHTML = restName;

                  if (restaurantData.data[firstPageRandomNumber].photo == null || restaurantData.data[firstPageRandomNumber].photo == undefined || restaurantData.data[firstPageRandomNumber].photo === "") {
                    document.querySelector(".rest-pic").style.display = "none";
                    document.querySelector(".rest-pic-error").style.display = "flex";
                  } else {
                    var restPhoto = restaurantData.data[firstPageRandomNumber].photo.images.large.url;
                    document.querySelector(".rest-pic").setAttribute("src", restPhoto);
                    document.querySelector(".rest-pic").style.display = "";
                    document.querySelector(".rest-pic-error").style.display = "none"
                  }

                  var restWebsite = restaurantData.data[firstPageRandomNumber].website;
                  if (restWebsite === "" || restWebsite == null || restWebsite == undefined) {
                    document.querySelector(".rest-links-paragraph").innerHTML = "<a href='' target='_blank' class='rest-reviews'>TripAdvisor reviews</a>"
                  } else {
                    document.querySelector(".rest-links-paragraph").innerHTML = "<a href='' target='_blank' class='rest-link'>Website</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href='' target='_blank' class='rest-reviews'>TripAdvisor reviews</a>"
                    document.querySelector(".rest-link").setAttribute("href", restWebsite);
                  };
                  var restTripAdvisor = restaurantData.data[firstPageRandomNumber].web_url;
                  document.querySelector(".rest-reviews").setAttribute("href", restTripAdvisor);

                  var restPhone = restaurantData.data[firstPageRandomNumber].phone;
                  if (restPhone === "" || restPhone == null || restPhone == undefined) {
                    document.querySelector(".rest-phone").style.display = "none";
                  } else {
                    document.querySelector(".rest-phone").style.display = "";
                    document.querySelector(".rest-phone").innerHTML = restPhone;
                  };

                  // ADDRESS EDITS:
                  var restStreet1 = restaurantData.data[firstPageRandomNumber].address_obj.street1;
                  var restCity = restaurantData.data[firstPageRandomNumber].address_obj.city;
                  var restState = restaurantData.data[firstPageRandomNumber].address_obj.state;

                  if (restStreet1 == null || restStreet1 == undefined || restStreet1 === "") {
                    document.querySelector(".rest-street-1").style.display = "none";
                  } else {
                    document.querySelector(".rest-street-1").style.display = "";
                    document.querySelector(".rest-street-1").innerHTML = restStreet1;
                  }

                  if (restaurantData.data[firstPageRandomNumber].address_obj.postalcode == null || restaurantData.data[firstPageRandomNumber].address_obj.postalcode == undefined || restaurantData.data[firstPageRandomNumber].address_obj.postalcode === "") {
                    document.querySelector(".rest-city").innerHTML = restCity + ", " + restState;
                  } else {
                    let restZip = (restaurantData.data[firstPageRandomNumber].address_obj.postalcode);
                    let restZipCut = restZip.split("-")[0];
                    document.querySelector(".rest-city").innerHTML = restCity + ", " + restState + " " + restZipCut;
                  };

                  //OTHER REST EDITS:
                  var restRating = restaurantData.data[firstPageRandomNumber].rating;
                  document.querySelector(".rdg4").innerHTML = restRating;

                  var restPrice = restaurantData.data[firstPageRandomNumber].price_level;

                  if (restPrice === "$$ - $$$") {
                    document.querySelector(".rdg2").innerHTML = "$$-$$$";
                  } else {
                    document.querySelector(".rdg2").innerHTML = restPrice;
                  }

                  var restDescription = restaurantData.data[firstPageRandomNumber].description;
                  document.querySelector(".restaurant-description-paragraph").innerHTML = restDescription;

                  //FIGURING OUT THE LOCATION OF THE RESTAURANT TO INPUT INTO THE DESSERT FUNCTION:
                  //7102352=Midwest and 15565668=Tenderloin and 15565677=Downtown Manhattan

                  // var restaurantNeighborhoodInfoArray = restaurantData.data[firstPageRandomNumber].neighborhood_info;

                  // function findTheRestRightLocation(x) {
                  //   if (x.location_id != "60763" && x.location_id != "15565668" && x.location_id != "7102352" && x.location_id != "15565677") {
                  //     return true;
                  //   }
                  // };

                  // function findTheSecondRestRightLocation(x) {
                  //   if (x.location_id != "60763") {
                  //     return true;
                  //   }
                  // };

                  // if (restaurantNeighborhoodInfoArray == null) {
                  //   var restLocation = "60763";
                  // } else if (dessertWalkDistance.checked === false) {
                  //   var restLocation = "60763";
                  // } else if (dessertWalkDistance.checked === true) {
                  //   if (restaurantNeighborhoodInfoArray.findIndex(findTheRestRightLocation) === -1) {
                  //     var restLocation = restaurantData.data[firstPageRandomNumber].neighborhood_info[restaurantNeighborhoodInfoArray.findIndex(findTheSecondRestRightLocation)].location_id;
                  //   } else {
                  //     var restLocation = restaurantData.data[firstPageRandomNumber].neighborhood_info[restaurantNeighborhoodInfoArray.findIndex(findTheRestRightLocation)].location_id;
                  //   }
                  // } else {
                  //   var restLocation = restaurantData.data[firstPageRandomNumber].neighborhood_info[0].location_id;
                  // }

                  // restLocationArray.push(restLocation);

                  //THIS IS THE DESSERT/TEA/COFFEE DIV:
                  if (userSubmittedExtraChatTime != "None" && dessertSaveCheckbox.checked === false) {
                    return extraChatTime();
                  } else if (userSubmittedExtraChatTime != "None" && dessertSaveCheckbox.checked === true) {
                    console.log("No dessert API function needs to run.");
                  } else if (userSubmittedExtraChatTime === "None" && dessertSaveCheckbox.checked === true) {
                    console.log("No dessert API function needs to run.");
                  } else if (userSubmittedExtraChatTime === "None" && dessertSaveCheckbox.checked === false) {
                    console.log("No dessert API function needs to run.");
                  }

                  function extraChatTime() {
                    // This identifies the key for the rest-tag-category parameter based on the user submitted item.
                    //This will also hide the extra chat time div if the user submitted "none".
                    var userSubmittedExtraChatTime = document.getElementById("extra-chat-time").value;
                    //This is what the user submitted as the date for the weather function.
                    var userSubmittedDate = dateControl.value;

                    if (userSubmittedExtraChatTime === "Bars & Pubs") {
                      var restTagCategory = "11776";
                    } else if (userSubmittedExtraChatTime === "Coffee & Tea") {
                      var restTagCategory = "9900";
                    } else if (userSubmittedExtraChatTime === "Dessert") {
                      var restTagCategory = "9909,9901";
                    } else if (userSubmittedExtraChatTime === "Any") {
                      var restTagCategory = "11776,9900,9909,9901";
                    }

                    var dessertFetchURL = restBaseURL + parameterLocationId + restLocation + and + parameterCurrency + currency + and + parameterUnit + lunit + and + parameterLimit + limit + and + parameterLang + lang + and + parameterRestAPIKey + restAPIKey + and + parameterMinRating + minRating + and + parameterRestPrice + pricesRestaurants + and + parameterRestTag + restTagCategory;

                    reDessertFetch(dessertFetchURL);

                    function reDessertFetch(x) {

                      const data = null;
                      const xhr = new XMLHttpRequest();

                      xhr.open("GET", x, true);
                      xhr.addEventListener("readystatechange", dessertCallFunction);

                      function dessertCallFunction() {
                        if (this.readyState === this.DONE) {
                          var dessertData = JSON.parse(this.responseText);
                          var dessertPage1Results = dessertData.paging.results;
                          var dessertTotalResults = dessertData.paging.total_results;
                          var dessertActualArrayResults = dessertData.data.length;

                          if (dessertActualArrayResults == null || dessertActualArrayResults == undefined || dessertActualArrayResults === 0 || dessertActualArrayResults === "") {
                            document.querySelector(".dessert-div").style.display = "none";
                            document.querySelector(".dessert-error-page").style.display = "block";
                            dessertCloseBtn.addEventListener("click", closeDessertErrorPage);

                            function closeDessertErrorPage() {
                              document.querySelector(".dessert-error-page").style.display = "none";
                              document.querySelector(".dessert-div").style.display = "";
                              var reRunDessertFetchURL = restBaseURL + parameterLocationId + "60763" + and + parameterCurrency + currency + and + parameterUnit + lunit + and + parameterLimit + limit + and + parameterLang + lang + and + parameterRestAPIKey + restAPIKey + and + parameterMinRating + minRating + and + parameterRestPrice + pricesRestaurants + and + parameterRestTag + restTagCategory;
                              reDessertFetch(reRunDessertFetchURL);
                            } //This is the end of the closeDessertErrorPage() function
                          } else {
                            document.querySelector(".dessert-div").style.display = "";
                            document.querySelector(".dessert-error-page").style.display = "none";
                            var dessertFirstPageRandomNumber = Math.round(Math.random() * (dessertActualArrayResults - 1));
                            if (Object.keys(dessertData.data[dessertFirstPageRandomNumber]).length < 30) {
                              if (dessertData.data[dessertFirstPageRandomNumber + 1] == null || dessertData.data[dessertFirstPageRandomNumber + 1] == undefined) {
                                dessertFirstPageRandomNumber = dessertFirstPageRandomNumber - 1;
                              } else {
                                dessertFirstPageRandomNumber = dessertFirstPageRandomNumber + 1;
                              }
                            };

                            var dessertName = dessertData.data[dessertFirstPageRandomNumber].name;
                            document.querySelector(".dessert-title").innerHTML = dessertName;

                            if (dessertData.data[dessertFirstPageRandomNumber].photo == null || dessertData.data[dessertFirstPageRandomNumber].photo == undefined || dessertData.data[dessertFirstPageRandomNumber].photo === "") {
                              document.querySelector(".dessert-pic").style.display = "none";
                              document.querySelector(".dessert-pic-error").style.display = "flex";
                            } else {
                              var dessertPhoto = dessertData.data[dessertFirstPageRandomNumber].photo.images.large.url;
                              document.querySelector(".dessert-pic").setAttribute("src", dessertPhoto);
                              document.querySelector(".dessert-pic").style.display = "";
                              document.querySelector(".dessert-pic-error").style.display = "none"
                            }

                            var dessertWebsite = dessertData.data[dessertFirstPageRandomNumber].website;
                            if (dessertWebsite === "" || dessertWebsite == null || dessertWebsite == undefined) {
                              document.querySelector(".dessert-links").innerHTML = "<a href='' target='_blank' class='dessert-reviews'>TripAdvisor reviews</a>"
                            } else {
                              document.querySelector(".dessert-links").innerHTML = "<a href='' target='_blank' class='dessert-link'>Website</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href='' target='_blank' class='dessert-reviews'>TripAdvisor reviews</a>"
                              document.querySelector(".dessert-link").setAttribute("href", dessertWebsite);
                            };
                            var dessertTripAdvisor = dessertData.data[dessertFirstPageRandomNumber].web_url;
                            document.querySelector(".dessert-reviews").setAttribute("href", dessertTripAdvisor);

                            var dessertPhone = dessertData.data[dessertFirstPageRandomNumber].phone;
                            if (dessertPhone === "" || dessertPhone == null || dessertPhone == undefined) {
                              document.querySelector(".dessert-phone").style.display = "none";
                            } else {
                              document.querySelector(".dessert-phone").style.display = "";
                              document.querySelector(".dessert-phone").innerHTML = dessertPhone;
                            }

                            // ADDRESS EDITS:
                            var dessertStreet1 = dessertData.data[dessertFirstPageRandomNumber].address_obj.street1;
                            var dessertCity = dessertData.data[dessertFirstPageRandomNumber].address_obj.city;
                            var dessertState = dessertData.data[dessertFirstPageRandomNumber].address_obj.state;
                            if (dessertStreet1 == null || dessertStreet1 == undefined || dessertStreet1 === "") {
                              document.querySelector(".dessert-street-1").style.display = "none";
                            } else {
                              document.querySelector(".dessert-street-1").style.display = "";
                              document.querySelector(".dessert-street-1").innerHTML = dessertStreet1;
                            }

                            if (dessertData.data[dessertFirstPageRandomNumber].address_obj.postalcode == null || dessertData.data[dessertFirstPageRandomNumber].address_obj.postalcode == undefined || dessertData.data[dessertFirstPageRandomNumber].address_obj.postalcode === "") {
                              document.querySelector(".dessert-city").innerHTML = dessertCity + ", " + dessertState;
                            } else {
                              let dessertZip = (dessertData.data[dessertFirstPageRandomNumber].address_obj.postalcode);
                              let dessertZipCut = dessertZip.split("-")[0];
                              document.querySelector(".dessert-city").innerHTML = dessertCity + ", " + dessertState + " " + dessertZipCut;
                            };

                            //OTHER REST EDITS:
                            var dessertRating = dessertData.data[dessertFirstPageRandomNumber].rating;
                            document.querySelector(".ddg4").innerHTML = dessertRating;

                            var dessertPrice = dessertData.data[dessertFirstPageRandomNumber].price_level;

                            if (dessertPrice === "$$ - $$$") {
                              document.querySelector(".ddg2").innerHTML = "$$-$$$";
                            } else {
                              document.querySelector(".ddg2").innerHTML = dessertPrice;
                            }

                            var dessertDescription = dessertData.data[dessertFirstPageRandomNumber].description;
                            document.querySelector(".dessert-description-paragraph").innerHTML = dessertDescription;

                          }; //This is the end of the if else statement to identify whether the first search results for dessert return nothing.
                        }; //End of the xhr if statement which determines ready state for the dessertCallFunction.
                      }; //End of the xhr call function dessertCallFunction().

                      xhr.send(); //This is the xhr.send() for the dessertCallFunction();

                    }; //This is the end of the function reDessertFetch(x).

                  }; //This is the end of the extraChatTime() function.

                }; //this is the end of the if else statement to identify whether the first search results for restaurants return nothing

              }; //End of the if statement which determines ready state for restaurantCallFunction().

            }; //End of the xhr load function for restaurantCallFunction().
            xhr.send(); //To send the data from the xhr load function for restaurantCallFunction().
          }; // This is the end of the function reRestaurantFetch(x).

        }; //This is the end of the function noFaceDemandsFood().

  }; //This is the end of the dateHappily() function.

} //This is the end of the callEverything() function.


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// POST-SAVE DUPLICATE FUNCTIONS:
// SECONDARY RESTAURANT FUNCTION:

function postSaveRestaurant() {
  //Setting up all the fetch URL variables:
  var restBaseURL = process.env.RESTBASEURL;
  var parameterLocationId = "location_id=";

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

  var parameterRestPrice = "prices_restaurants="
  var parameterCombinedFoodKey = "combined_food="
  var parameterRestTag = "restaurant_tagcategory="

  var and = "&"

  //This will identify the key for the price-range submitted by the user.
  var priceRange = document.getElementById("price-range")
  var userSubmittedPriceRange = priceRange.value;
  if (userSubmittedPriceRange === "$") {
    var pricesRestaurants = "10953";
  } else if (userSubmittedPriceRange === "$$ - $$$") {
    var pricesRestaurants = "10955";
  } else if (userSubmittedPriceRange === "$$$$") {
    var pricesRestaurants = "10954";
  } else {
    var pricesRestaurants = "all"
  }

  //This will identify the key that correlates with the cuisine search result.
  function getKeyByCuisineValue(object, value) {
    var x = Object.keys(object)
    return x.find(function(key) {
      return object[key].label.toLowerCase() === value.toLowerCase()
    });
  }
  var userSubmittedCuisineSearch = document.getElementById("cuisine-selection").value;

  if (userSubmittedCuisineSearch === "") {
    var cuisineSearchKey = "all";
  } else {
    var cuisineSearchKey = getKeyByCuisineValue(cuisineNames, userSubmittedCuisineSearch);
  };

  //This will identify the location id to use based on whether the restWalk checkbox is checked or not:
  if (restWalkDistance.checked === true) {
    var restParameterLocationId = dateActivityLocationArray[dateActivityLocationArray.length - 1];
  } else {
    var restParameterLocationId = "60763";
  }

  var restaurantFetchURL = restBaseURL + parameterLocationId + restParameterLocationId + and + parameterCurrency + currency + and + parameterUnit + lunit + and + parameterLimit + limit + and + parameterLang + lang + and + parameterRestAPIKey + restAPIKey + and + parameterMinRating + minRating + and + parameterRestPrice + pricesRestaurants + and + parameterCombinedFoodKey + cuisineSearchKey;

  reRestaurantFetch(restaurantFetchURL);

  function reRestaurantFetch(x) {
    const data = null;
    const xhr = new XMLHttpRequest();

    xhr.open("GET", x, true);
    xhr.addEventListener("readystatechange", restaurantCallFunction);

    function restaurantCallFunction() {
      if (this.readyState === this.DONE) {
        var restaurantData = JSON.parse(this.responseText);
        var restPage1Results = restaurantData.paging.results;
        var restTotalResults = restaurantData.paging.total_results;
        var restActualArrayResults = restaurantData.data.length;

        if (restActualArrayResults == null || restActualArrayResults == undefined || restActualArrayResults === 0 || restActualArrayResults === "") {
          document.querySelector(".restaurant-div").style.display = "none";
          document.querySelector(".rest-error-page").style.display = "block";
          if (userSubmittedExtraChatTime === "None" && userSubmittedDate === "") {
            document.querySelector(".rightmost-container").style.gridTemplateColumns = "1fr 1fr";
            document.querySelector(".rightmost-container").style.display = "grid";
          } else if (userSubmittedExtraChatTime === "None" && userSubmittedDate != "") {
            document.querySelector(".rightmost-container").style.display = "grid";
            document.querySelector(".rightmost-container").style.gridTemplateColumns = "1fr 1fr 1fr";
          } else if (userSubmittedExtraChatTime != "None" && userSubmittedDate != "") {
            document.querySelector(".rightmost-container").style.display = "grid";
            document.querySelector(".rightmost-container").style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
          } else if (userSubmittedExtraChatTime != "None" && userSubmittedDate === "") {
            document.querySelector(".rightmost-container").style.display = "grid";
            document.querySelector(".rightmost-container").style.gridTemplateColumns = "1fr 1fr 1fr";
          }
          restCloseBtn.addEventListener("click", closeRestErrorPage);

          function closeRestErrorPage() {
            document.querySelector(".restaurant-div").style.display = "";
            document.querySelector(".rest-error-page").style.display = "none";
            var reRunRestaurantFetchURL = restBaseURL + parameterLocationId + locationId + and + parameterCurrency + currency + and + parameterUnit + lunit + and + parameterLimit + limit + and + parameterLang + lang + and + parameterRestAPIKey + restAPIKey + and + parameterMinRating + minRating + and + parameterRestPrice + pricesRestaurants + and + parameterCombinedFoodKey + cuisineSearchKey;
            reRestaurantFetch(reRunRestaurantFetchURL);
          } //This is the end of the function closeRestErrorPage()
        } else {
          document.querySelector(".restaurant-div").style.display = "";
          document.querySelector(".rest-error-page").style.display = "none";
          var firstPageRandomNumber = Math.round(Math.random() * (restActualArrayResults - 1));
          if (Object.keys(restaurantData.data[firstPageRandomNumber]).length < 30) {
            if (restaurantData.data[firstPageRandomNumber + 1] == null || restaurantData.data[firstPageRandomNumber + 1] == undefined) {
              firstPageRandomNumber = firstPageRandomNumber - 1;
            } else {
              firstPageRandomNumber = firstPageRandomNumber + 1;
            }
          };

          var restName = restaurantData.data[firstPageRandomNumber].name;
          document.querySelector(".rest-title").innerHTML = restName;

          if (restaurantData.data[firstPageRandomNumber].photo == null || restaurantData.data[firstPageRandomNumber].photo == undefined || restaurantData.data[firstPageRandomNumber].photo === "") {
            document.querySelector(".rest-pic").style.display = "none";
            document.querySelector(".rest-pic-error").style.display = "flex";
          } else {
            var restPhoto = restaurantData.data[firstPageRandomNumber].photo.images.large.url;
            document.querySelector(".rest-pic").setAttribute("src", restPhoto);
            document.querySelector(".rest-pic").style.display = "";
            document.querySelector(".rest-pic-error").style.display = "none"
          }

          var restWebsite = restaurantData.data[firstPageRandomNumber].website;
          if (restWebsite === "" || restWebsite == null || restWebsite == undefined) {
            document.querySelector(".rest-links-paragraph").innerHTML = "<a href='' target='_blank' class='rest-reviews'>TripAdvisor reviews</a>"
          } else {
            document.querySelector(".rest-links-paragraph").innerHTML = "<a href='' target='_blank' class='rest-link'>Website</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href='' target='_blank' class='rest-reviews'>TripAdvisor reviews</a>"
            document.querySelector(".rest-link").setAttribute("href", restWebsite);
          };
          var restTripAdvisor = restaurantData.data[firstPageRandomNumber].web_url;
          document.querySelector(".rest-reviews").setAttribute("href", restTripAdvisor);

          var restPhone = restaurantData.data[firstPageRandomNumber].phone;
          if (restPhone === "" || restPhone == null || restPhone == undefined) {
            document.querySelector(".rest-phone").style.display = "none";
          } else {
            document.querySelector(".rest-phone").style.display = "";
            document.querySelector(".rest-phone").innerHTML = restPhone;
          };

          // ADDRESS EDITS:
          var restStreet1 = restaurantData.data[firstPageRandomNumber].address_obj.street1;
          var restCity = restaurantData.data[firstPageRandomNumber].address_obj.city;
          var restState = restaurantData.data[firstPageRandomNumber].address_obj.state;

          if (restStreet1 == null || restStreet1 == undefined || restStreet1 === "") {
            document.querySelector(".rest-street-1").style.display = "none";
          } else {
            document.querySelector(".rest-street-1").style.display = "";
            document.querySelector(".rest-street-1").innerHTML = restStreet1;
          }

          if (restaurantData.data[firstPageRandomNumber].address_obj.postalcode == null || restaurantData.data[firstPageRandomNumber].address_obj.postalcode == undefined || restaurantData.data[firstPageRandomNumber].address_obj.postalcode === "") {
            document.querySelector(".rest-city").innerHTML = restCity + ", " + restState;
          } else {
            let restZip = (restaurantData.data[firstPageRandomNumber].address_obj.postalcode);
            let restZipCut = restZip.split("-")[0];
            document.querySelector(".rest-city").innerHTML = restCity + ", " + restState + " " + restZipCut;
          };

          //OTHER REST EDITS:
          var restRating = restaurantData.data[firstPageRandomNumber].rating;
          document.querySelector(".rdg4").innerHTML = restRating;

          var restPrice = restaurantData.data[firstPageRandomNumber].price_level;

          if (restPrice === "$$ - $$$") {
            document.querySelector(".rdg2").innerHTML = "$$-$$$";
          } else {
            document.querySelector(".rdg2").innerHTML = restPrice;
          }

          var restDescription = restaurantData.data[firstPageRandomNumber].description;
          document.querySelector(".restaurant-description-paragraph").innerHTML = restDescription;

          //FIGURING OUT THE LOCATION OF THE RESTAURANT TO INPUT INTO THE DESSERT FUNCTION:
          //7102352=Midwest and 15565668=Tenderloin and 15565677=Downtown Manhattan

          var restaurantNeighborhoodInfoArray = restaurantData.data[firstPageRandomNumber].neighborhood_info;

          function findTheRestRightLocation(x) {
            if (x.location_id != "60763" && x.location_id != "15565668" && x.location_id != "7102352" && x.location_id != "15565677") {
              return true;
            }
          };

          function findTheSecondRestRightLocation(x) {
            if (x.location_id != "60763") {
              return true;
            }
          };

          if (restaurantNeighborhoodInfoArray == null) {
            var restLocation = "60763";
          } else if (dessertWalkDistance.checked === false) {
            var restLocation = "60763";
          } else if (dessertWalkDistance.checked === true) {
            if (restaurantNeighborhoodInfoArray.findIndex(findTheRestRightLocation) === -1) {
              var restLocation = restaurantData.data[firstPageRandomNumber].neighborhood_info[restaurantNeighborhoodInfoArray.findIndex(findTheSecondRestRightLocation)].location_id;
            } else {
              var restLocation = restaurantData.data[firstPageRandomNumber].neighborhood_info[restaurantNeighborhoodInfoArray.findIndex(findTheRestRightLocation)].location_id;
            }
          } else {
            var restLocation = restaurantData.data[firstPageRandomNumber].neighborhood_info[0].location_id;
          }

          restLocationArray.push(restLocation);
        }; //this is the end of the if else statement to identify whether the first search results for restaurants return nothing
      }; //End of the if statement which determines ready state for the restaurantCallFunction.
    }; //This is the end of the xhr onload for restaurantCallFunction within the postSaveRestaurant function.
    xhr.send();
  }; // This is the end of the function reRestaurantFetch(x).

}; //This is the end of the postSaveRestaurant() function.


// SECONDARY DESSERT FUNCTION:
function postSaveDessert(){
  var userSubmittedExtraChatTime = document.getElementById("extra-chat-time").value;
  if (userSubmittedExtraChatTime != "None" && dessertSaveCheckbox.checked === false) {
    return extraChatTime();
  } else if (userSubmittedExtraChatTime != "None" && dessertSaveCheckbox.checked === true) {
    console.log("No dessert API function needs to run.");
  } else if (userSubmittedExtraChatTime === "None" && dessertSaveCheckbox.checked === true) {
    console.log("No dessert API function needs to run.");
  } else if (userSubmittedExtraChatTime === "None" && dessertSaveCheckbox.checked === false) {
    console.log("No dessert API function needs to run.");
  }

  function extraChatTime() {

    var restBaseURL = process.env.RESTBASEURL;
    var parameterLocationId = "location_id=";

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

    var parameterRestPrice = "prices_restaurants="
    var parameterCombinedFoodKey = "combined_food="
    var parameterRestTag = "restaurant_tagcategory="

    var and = "&"

    //This will identify the key for the price-range submitted by the user.
    var priceRange = document.getElementById("price-range")
    var userSubmittedPriceRange = priceRange.value;
    if (userSubmittedPriceRange === "$") {
      var pricesRestaurants = "10953";
    } else if (userSubmittedPriceRange === "$$ - $$$") {
      var pricesRestaurants = "10955";
    } else if (userSubmittedPriceRange === "$$$$") {
      var pricesRestaurants = "10954";
    } else {
      var pricesRestaurants = "all"
    }

    //This will identify the location needed for the fetch URL.
    if(dessertWalkDistance.checked === true){
      var restLocation = restLocationArray[restLocationArray.length-1];
    } else {restLocation = "60763"}

    // This identifies the key for the rest-tag-category parameter based on the user submitted item.
    //This will also hide the extra chat time div if the user submitted "none".
    var userSubmittedExtraChatTime = document.getElementById("extra-chat-time").value;
    //This is what the user submitted as the date for the weather function.
    var userSubmittedDate = dateControl.value;

    if (userSubmittedExtraChatTime === "Bars & Pubs") {
      var restTagCategory = "11776";
    } else if (userSubmittedExtraChatTime === "Coffee & Tea") {
      var restTagCategory = "9900";
    } else if (userSubmittedExtraChatTime === "Dessert") {
      var restTagCategory = "9909,9901";
    } else if (userSubmittedExtraChatTime === "Any") {
      var restTagCategory = "11776,9900,9909,9901";
    }

    var dessertFetchURL = restBaseURL + parameterLocationId + restLocation + and + parameterCurrency + currency + and + parameterUnit + lunit + and + parameterLimit + limit + and + parameterLang + lang + and + parameterRestAPIKey + restAPIKey + and + parameterMinRating + minRating + and + parameterRestPrice + pricesRestaurants + and + parameterRestTag + restTagCategory;

    reDessertFetch(dessertFetchURL);

    function reDessertFetch(x){
      const data = null;
      const xhr = new XMLHttpRequest();

      xhr.open("GET", x, true);
      xhr.addEventListener("readystatechange", dessertCallFunction);

      function dessertCallFunction(){
        if(this.readyState === this.DONE){
          var dessertData = JSON.parse(this.responseText);
          var dessertPage1Results = dessertData.paging.results;
          var dessertTotalResults = dessertData.paging.total_results;
          var dessertActualArrayResults = dessertData.data.length;

          if (dessertActualArrayResults == null || dessertActualArrayResults == undefined || dessertActualArrayResults === 0 || dessertActualArrayResults === "") {
            document.querySelector(".dessert-div").style.display = "none";
            document.querySelector(".dessert-error-page").style.display = "block";
            dessertCloseBtn.addEventListener("click", closeDessertErrorPage);

            function closeDessertErrorPage() {
              document.querySelector(".dessert-error-page").style.display = "none";
              document.querySelector(".dessert-div").style.display = "";
              var reRunDessertFetchURL = restBaseURL + parameterLocationId + "60763" + and + parameterCurrency + currency + and + parameterUnit + lunit + and + parameterLimit + limit + and + parameterLang + lang + and + parameterRestAPIKey + restAPIKey + and + parameterMinRating + minRating + and + parameterRestPrice + pricesRestaurants + and + parameterRestTag + restTagCategory;
              reDessertFetch(reRunDessertFetchURL);
            } //This is the end of the closeDessertErrorPage() function
          } else {
            document.querySelector(".dessert-div").style.display = "";
            document.querySelector(".dessert-error-page").style.display = "none";
            var dessertFirstPageRandomNumber = Math.round(Math.random() * (dessertActualArrayResults - 1));
            if (Object.keys(dessertData.data[dessertFirstPageRandomNumber]).length < 30) {
              if (dessertData.data[dessertFirstPageRandomNumber + 1] == null || dessertData.data[dessertFirstPageRandomNumber + 1] == undefined) {
                dessertFirstPageRandomNumber = dessertFirstPageRandomNumber - 1;
              } else {
                dessertFirstPageRandomNumber = dessertFirstPageRandomNumber + 1;
              }
            };

            var dessertName = dessertData.data[dessertFirstPageRandomNumber].name;
            document.querySelector(".dessert-title").innerHTML = dessertName;

            if (dessertData.data[dessertFirstPageRandomNumber].photo == null || dessertData.data[dessertFirstPageRandomNumber].photo == undefined || dessertData.data[dessertFirstPageRandomNumber].photo === "") {
              document.querySelector(".dessert-pic").style.display = "none";
              document.querySelector(".dessert-pic-error").style.display = "flex";
            } else {
              var dessertPhoto = dessertData.data[dessertFirstPageRandomNumber].photo.images.large.url;
              document.querySelector(".dessert-pic").setAttribute("src", dessertPhoto);
              document.querySelector(".dessert-pic").style.display = "";
              document.querySelector(".dessert-pic-error").style.display = "none"
            }

            var dessertWebsite = dessertData.data[dessertFirstPageRandomNumber].website;
            if (dessertWebsite === "" || dessertWebsite == null || dessertWebsite == undefined) {
              document.querySelector(".dessert-links").innerHTML = "<a href='' target='_blank' class='dessert-reviews'>TripAdvisor reviews</a>"
            } else {
              document.querySelector(".dessert-links").innerHTML = "<a href='' target='_blank' class='dessert-link'>Website</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href='' target='_blank' class='dessert-reviews'>TripAdvisor reviews</a>"
              document.querySelector(".dessert-link").setAttribute("href", dessertWebsite);
            };
            var dessertTripAdvisor = dessertData.data[dessertFirstPageRandomNumber].web_url;
            document.querySelector(".dessert-reviews").setAttribute("href", dessertTripAdvisor);

            var dessertPhone = dessertData.data[dessertFirstPageRandomNumber].phone;
            if (dessertPhone === "" || dessertPhone == null || dessertPhone == undefined) {
              document.querySelector(".dessert-phone").style.display = "none";
            } else {
              document.querySelector(".dessert-phone").style.display = "";
              document.querySelector(".dessert-phone").innerHTML = dessertPhone;
            }

            // ADDRESS EDITS:
            var dessertStreet1 = dessertData.data[dessertFirstPageRandomNumber].address_obj.street1;
            var dessertCity = dessertData.data[dessertFirstPageRandomNumber].address_obj.city;
            var dessertState = dessertData.data[dessertFirstPageRandomNumber].address_obj.state;
            if (dessertStreet1 == null || dessertStreet1 == undefined || dessertStreet1 === "") {
              document.querySelector(".dessert-street-1").style.display = "none";
            } else {
              document.querySelector(".dessert-street-1").style.display = "";
              document.querySelector(".dessert-street-1").innerHTML = dessertStreet1;
            }

            if (dessertData.data[dessertFirstPageRandomNumber].address_obj.postalcode == null || dessertData.data[dessertFirstPageRandomNumber].address_obj.postalcode == undefined || dessertData.data[dessertFirstPageRandomNumber].address_obj.postalcode === "") {
              document.querySelector(".dessert-city").innerHTML = dessertCity + ", " + dessertState;
            } else {
              let dessertZip = (dessertData.data[dessertFirstPageRandomNumber].address_obj.postalcode);
              let dessertZipCut = dessertZip.split("-")[0];
              document.querySelector(".dessert-city").innerHTML = dessertCity + ", " + dessertState + " " + dessertZipCut;
            };

            //OTHER REST EDITS:
            var dessertRating = dessertData.data[dessertFirstPageRandomNumber].rating;
            document.querySelector(".ddg4").innerHTML = dessertRating;

            var dessertPrice = dessertData.data[dessertFirstPageRandomNumber].price_level;

            if (dessertPrice === "$$ - $$$") {
              document.querySelector(".ddg2").innerHTML = "$$-$$$";
            } else {
              document.querySelector(".ddg2").innerHTML = dessertPrice;
            }

            var dessertDescription = dessertData.data[dessertFirstPageRandomNumber].description;
            document.querySelector(".dessert-description-paragraph").innerHTML = dessertDescription;

          }; //This is the end of the if else statement to identify whether the first search results for dessert return nothing.
        }; //This is the end of the if statement which determines readystate for dessertCallFunction.
        }; //This is the end of the xhr onload function for dessertCallFunction
      xhr.send();
    }; //This is the end of the function reDessertFetch(x).

  }; //This is the end of the extraChatTime() function.
}; //This is the end of the PostSaveDessert() function.







// Changing the min and max date selectable in the calendar input:
// ----This sets the minimum date on the calendar input.
var todaysDate = new Date();
var todaysDateAtNoon = new Date(todaysDate.setHours(12, 0, 0));
var formattedTodaysDate = todaysDateAtNoon.toISOString().split("T")[0];
document.getElementById("calendar").setAttribute("min", formattedTodaysDate);
// ----This sets the maximum date on the calendar input.
var maxDate = todaysDateAtNoon.setDate(todaysDateAtNoon.getDate() + 5);
var formattedMaxDate = new Date(maxDate).toISOString().split("T")[0];
document.getElementById("calendar").setAttribute("max", formattedMaxDate);

// CALLS THE WEATHER API (callTheWeather function):
function callTheWeather() {
  // This identifies what the user submitted as the date.
  var userSubmittedDate = dateControl.value;
  // This identifies what the user submitted as the weather measurement.
  var measurementControl = document.getElementById("weather-unit").value;
  // This changes the Weather API URL depending on the measurement unit selected.
  let endpoint;
  let callbackFunction;

  if (userSubmittedDate === ""){
    document.querySelector(".weather-div").style.display = "none";
    return;
  } else if (formattedTodaysDate === userSubmittedDate) {
    document.querySelector(".weather-div").style.removeProperty("display");
    endpoint = "/current-weather";
    callbackFunction = weatherCallFunction;
  } else {
    document.querySelector(".weather-div").style.removeProperty("display");
    endpoint = "/forecast-weather";
    callbackFunction = forecastWeatherCallFunction;
  }

  fetch(`${endpoint}?unit=${measurementControl}`)
    .then(response => response.json())
    .then(data => callbackFunction(data))
    .catch(error => console.error("Error fetching weather data:", error));

  function weatherCallFunction(weatherData) {
      console.log(weatherData)

      // WEATHER SUMMARY DATA
      var weatherDataDate = new Date(weatherData.dt*1000);
      var weatherDate = weatherDataDate.toLocaleString("en-US", {
        dateStyle: "medium"
      });
      document.querySelector(".weather-date").innerHTML = weatherDate;
      var weatherTemp = Math.round(weatherData.main.temp);
      if (measurementControl === "Celsius") {
        document.querySelector(".temperature").innerHTML = weatherTemp + "&#176;C";
      } else {
        document.querySelector(".temperature").innerHTML = weatherTemp + "&#176;F";
      }
      // WEATHER IMAGE DATA
      var weatherCode = weatherData.weather[0].id;
      if (weatherCode >= 800 && weatherCode <= 803) {
        document.querySelector(".weather-div").style.backgroundImage = "url('images/blue-sky.jpg')"
      } else if (weatherCode < 790 || weatherCode === 804) {
        document.querySelector(".weather-div").style.backgroundImage = "url('images/rainy-sky-2.jpg')"
      }
      var weatherIcon = weatherData.weather[0].icon;
      var weatherIconURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
      var icon = document.querySelector(".weather-icon-pic");
      icon.src = weatherIconURL
      // WEATHER SUMMARY DATA CONTINUED
      var weatherDescription = weatherData.weather[0].description;
      document.querySelector(".weather-description").innerHTML = weatherDescription;
      // WEATHER DETAILS DATA
      var highTemp = Math.round(weatherData.main.temp_max);
      var lowTemp = Math.round(weatherData.main.temp_min);
      if (measurementControl === "Celsius") {
        document.querySelector(".high-temp-number").innerHTML = highTemp + "&#176;C";
        document.querySelector(".low-temp-number").innerHTML = lowTemp + "&#176;C";
      } else {
        document.querySelector(".high-temp-number").innerHTML = highTemp + "&#176;F";
        document.querySelector(".low-temp-number").innerHTML = lowTemp + "&#176;F";
      }
      var averageHumidity = Math.round(weatherData.main.humidity);
      document.querySelector(".avg-humidity-number").innerHTML = averageHumidity + "&#37;";
  }; //This closes the weatherCallFunction().

  function forecastWeatherCallFunction(weatherData){

    var searchDate = userSubmittedDate + " 12:00:00"
    let matchedItem;
    for(let i = 0; i < weatherData.list.length; i++){
      if(weatherData.list[i].dt_txt === searchDate){
        matchedItem = weatherData.list[i]
      }
    }
      
    // WEATHER SUMMARY DATA
    var weatherDataDate = new Date(matchedItem.dt*1000);
    var weatherDate = weatherDataDate.toLocaleString("en-US", {
      dateStyle: "medium"
    });
    document.querySelector(".weather-date").innerHTML = weatherDate;
    var weatherTemp = Math.round(matchedItem.main.temp);
    if (measurementControl === "Celsius") {
      document.querySelector(".temperature").innerHTML = weatherTemp + "&#176;C";
    } else {
      document.querySelector(".temperature").innerHTML = weatherTemp + "&#176;F";
    }
    // WEATHER IMAGE DATA
    var weatherCode = matchedItem.weather[0].id;
    if (weatherCode >= 800 && weatherCode <= 803) {
      document.querySelector(".weather-div").style.backgroundImage = "url('images/blue-sky.jpg')"
    } else if (weatherCode < 790 || weatherCode === 804) {
      document.querySelector(".weather-div").style.backgroundImage = "url('images/rainy-sky-2.jpg')"
    }
    var weatherIcon = matchedItem.weather[0].icon;
    var weatherIconURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
    var icon = document.querySelector(".weather-icon-pic");
    icon.src = weatherIconURL
    // WEATHER SUMMARY DATA CONTINUED
    var weatherDescription = matchedItem.weather[0].description;
    document.querySelector(".weather-description").innerHTML = weatherDescription;
    // WEATHER DETAILS DATA
    var highTemp = Math.round(matchedItem.main.temp_max);
    var lowTemp = Math.round(matchedItem.main.temp_min);
    if (measurementControl === "Celsius") {
      document.querySelector(".high-temp-number").innerHTML = highTemp + "&#176;C";
      document.querySelector(".low-temp-number").innerHTML = lowTemp + "&#176;C";
    } else {
      document.querySelector(".high-temp-number").innerHTML = highTemp + "&#176;F";
      document.querySelector(".low-temp-number").innerHTML = lowTemp + "&#176;F";
    }
    var averageHumidity = Math.round(matchedItem.main.humidity);
    document.querySelector(".avg-humidity-number").innerHTML = averageHumidity + "&#37;";

  } //This closes the forecastWeatherCallFunction().

}; //This is the end of the entire function "callTheWeather"

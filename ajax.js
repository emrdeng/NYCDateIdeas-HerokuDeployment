require('dotenv').config()
const fs = require('fs');  // This module allows you to read files

const express = require("express");

const app = express();

app.use(express.static(__dirname));

app.get("/", function (req, res){
  res.sendFile(__dirname + "/index.html");
})

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

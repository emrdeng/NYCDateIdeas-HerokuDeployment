require('dotenv').config()
const fs = require('fs');  // This module allows you to read files

const express = require("express");

const app = express();

app.use(express.static(__dirname));

app.get("/", function (req, res){
  res.sendFile(__dirname + "/index.html");
})

app.get('/env-vars', (req, res) => {
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


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

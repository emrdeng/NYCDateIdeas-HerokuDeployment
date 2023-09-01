require('dotenv').config()

const express = require("express");

const app = express();

app.use(express.static(__dirname));

app.get("/", function (req, res){
  res.sendFile(__dirname + "/index.html");
})

app.get('/env-vars', (req, res) => {
  res.json({
    CUISINENAMESJSON: process.env.CUISINENAMESJSON,
    DATEACTIVITYBASEURL: process.env.DATEACTIVITYBASEURL,
    RESTBASEURL: process.env.RESTBASEURL,
    RESTAPIKEY: process.env.RESTAPIKEY,
    WEATHERURLCELSIUS: process.env.WEATHERURLCELSIUS,
    WEATHERURLFARENHEIT: process.env.WEATHERURLFARENHEIT,
    WEATHERFORECASTURLCELSIUS: process.env.WEATHERFORECASTURLCELSIUS,
    WEATHERFORECASTURLFARENHEIT: process.env.WEATHERFORECASTURLFARENHEIT,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

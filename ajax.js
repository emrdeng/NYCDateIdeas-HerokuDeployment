const express = require("express");

const app = express();

app.use('/dist', express.static(__dirname + '/dist'));  // for bundled js
app.use('/images', express.static(__dirname + '/images'));  // for images
app.use('/styles.css', express.static(__dirname + '/style.css'));  // for styles

app.get("/", function (req, res){
  res.sendFile(__dirname + "/index.html");
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
  console.log(`Server is running on port ${PORT}.`)
});

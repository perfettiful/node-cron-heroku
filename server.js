var express = require("express");
var expresshbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");

// Set up port and mongodb connection
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articleScraper";

const cron = require('node-cron');

var task = cron.schedule(' * * * * *', () => {

  var dateTimeStamp = new Date().toLocaleString();
  console.log('---Printing current date-time ('+dateTimeStamp+') every minute in the terminal---');
  
  // axios.get("https://www.youtube.com/trending").then(function (ytResponse) {

  // console.log("----------Youtube Scrape---------------");
  
  // console.log(ytResponse);
  // });


});


// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
app.engine("handlebars", expresshbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes/Controllers
var routes = require("./controllers/article_controller.js");
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false });

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

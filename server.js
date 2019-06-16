var express = require("express");
var expresshbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Set up port and mongodb connection
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articleScraper";

const cron = require('node-cron');

var task = cron.schedule(' * * * * *', () => {
	console.log('Printing this line every minute in the terminal');
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

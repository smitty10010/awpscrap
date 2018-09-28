const express = require("express");
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

//Scraping tools
const axios = require("axios");
const cheerio = require ("cheerio");

//Require the models
const db = require("./models")

//Init Express
const app = express();
const PORT = process.env.PORT || 3000;

//Routes
require("./routes/api")(app);
require("./routes/html")(app);

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Set Handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/awpdb";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//Start the server
app.listen(PORT, () => console.log(`Server listening on: http://localhost:${PORT}`));


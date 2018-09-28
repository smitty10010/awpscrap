const express = require("express");
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

//Scraping tools
const axios = require("axios");
const cheerio = require ("cheerio");

//Require the routes
const routes = require("./controllers/awpcontroller");

app.use(routes);

const PORT = 3000;

//Init Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/awpdb", { useNewUrlParser: true });

//Set Handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//Start the server
app.listen(PORT, () => console.log(`Server listening on: http://localhost:${PORT}`));


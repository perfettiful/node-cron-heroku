var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");

// The router to handle the requests
var app = express.Router();

var db = require("../models");

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.androidpolice.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("header h2").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Show the articles
        res.redirect("/");
    });
});

// Route for getting all Articles from the db for home
app.get("/", function (req, res) {
    // Find all Notes
    db.Article.find({isSaved: false})
        .then(function (dbArticle) {
            // If all Notes are successfully found, send them back to the client
            res.render("home", { articles: dbArticle });
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            res.json(err);
        });
});

// Route for getting all Articles from the db for saved
app.get("/savedarticles", function (req, res) {
    // Find all Notes
    db.Article.find({isSaved: true})
        .then(function (dbArticle) {
            // If all Notes are successfully found, send them back to the client
            res.render("saved", { articles: dbArticle });
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    var myArticleId = req.params.id;
    db.Article.findOne({ _id: myArticleId })
        // Specify that we want to populate the retrieved libraries with any associated books
        .populate("note")
        .then(function (dbArticle) {
            // If any Libraries are found, send them to the client with any associated Books
            console.log(dbArticle);
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });

});

app.put("/articles/:id/:sflag", function (req, res) {
    var savedState = (req.params.sflag === "true")
    db.Article.updateOne({ _id: req.params.id }, { $set: { isSaved: savedState } }, function (err, res) {
        if (err) {
            console.log("Error updating document " + req.params.id);
        } else {
            console.log("Document " + req.params.id + " saved flag updated!");
        }
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            // If the User was updated successfully, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});

// Delete note and remove from the article array
app.delete("/notes/:noteid/:articleid", function(req, res) {
    db.Note.deleteOne({ _id: req.params.noteid }, function(err, obj) {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(obj);
        console.log("1 deleted");
    });
    db.Article.update({ _id: req.params.articleid }, { $pull: { note: req.params.noteid }}, {multi: false}, function(err, raw) {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(raw);
    });
});

// Export router for the server to use
module.exports = app;

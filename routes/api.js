module.exports = (app, axios, cheerio, db) => {

    app.get("/api/scrape", function(req, res) {
        // First, we grab the body of the html with request
        axios.get("https://www.newpages.com/classifieds/big-list-of-writing-contests").then(function(html) {
          // Then, we load that into cheerio and save it to $ for a shorthand selector
          const $ = cheerio.load(html.data);
          // Now, we grab every p within an li tag, and do the following:
          $('li p').each(function(i, element) {
            // Save an empty result object
            const result = {};
      
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
              .children("a")
              .text();
            result.description = $(this).text();
            result.link = $(this)
              .children("a")
              .attr("href");
      
            // Create a new Article using the `result` object built from scraping
            db.Contests.create(result)
              .then(function(dbContests) {
                // View the added result in the console
                console.log(dbContests);
              })
              .catch(function(err) {
                // If an error occurred, send it to the client
                return res.json(err);
              });
          });

        });
      });

      app.get("/api/contests", function(req,res) {
        db.Contests.find({}).then(function(dbContests) {
          res.json(dbContests);
        }).catch(function(err) {
          res.json(err);
        });
      });

      app.get("/api/contests/:id", function(req,res) {
        db.Contests.findById(req.params.id).populate("note").then(function(dbContests) {
          res.json(dbContests);
        }).catch(function(err){
          res.json(err);
        });
      });

      app.post("/api/contests/:id", function(req, res) {
        const newNote = req.body;
        db.Note.create(newNote).then(function(newNote) {
          db.Contests.findByIdAndUpdate(req.params.id, {note: newNote._id}, {new: true});
          return
        }).then(function(dbContests){
          res.json(dbContests);
        }).catch(function(err){
          res.json(err);
        });
      });

      app.get("/api/clear", function(req,res){
        db.Contests.deleteMany({}).then(function(dbContests){
          res.json(dbContests)
        }).catch(function(err){
          res.json(err);
        })
      })
};

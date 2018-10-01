/* global bootbox */
$(document).ready(function() {
    // Setting a reference to the article-container div where all the dynamic content will go
    // Adding event listeners to any dynamically generated "save article"
    // and "scrape new article" buttons
    const articleContainer = $(".contest-container");
    // $(".btn.save").on("click",handleArticleSave());
    $("scrape").on("click", articleScrape);
    $(".clear").on("click", handleArticleClear);
  
    function initPage() {
      // Run an AJAX request for any unsaved headlines
      $.get("/api/contests").then(function(data) {
        articleContainer.empty();
        // If we have headlines, render them to the page
        if (data && data.length) {
          renderContests(data);
        } else {
          // Otherwise render a message explaining we have no articles
          renderEmpty();
        }
      });
    }
  
    function renderContests(contests) {
      // This function handles appending HTML containing our article data to the page
      // We are passed an array of JSON containing all available articles in our database
      var contestsCards = [];
      // We pass each article JSON object to the createCard function which returns a bootstrap
      // card with our article data inside
      for (var i = 0; i < contests.length; i++) {
        contestsCards.push(createCard(articles[i]));
      }
      // Once we have all of the HTML for the articles stored in our articleCards array,
      // append them to the articleCards container
      articleContainer.append(contestsCards);
    }
  
    function createCard(contests) {
      // This function takes in a single JSON object for an article/headline
      // It constructs a jQuery element containing all of the formatted HTML for the
      // article card
      var card = $("<div class='card'>");
      var cardHeader = $("<div class='card-header'>").append(
        $("<h3>").append(
          $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
            .attr("href", contests.link)
            .text(contests.title),
          $("<a class='btn btn-success save'>Save Article</a>")
        )
      );
  
      var cardBody = $("<div class='card-body'>").text(contests.description);
  
      card.append(cardHeader, cardBody);
      // We attach the article's id to the jQuery element
      // We will use this when trying to figure out which article the user wants to save
      card.data("_id", contests._id);
      // We return the constructed card jQuery element
      return card;
    }
  
    function renderEmpty() {
      // This function renders some HTML to the page explaining we don't have any articles to view
      // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
      var emptyAlert = $(
        [
          "<div class='alert alert-warning text-center'>",
          "<h4>Uh Oh. Looks like we don't have any new contests.</h4>",
          "</div>",
          "<div class='card'>",
          "<div class='card-header text-center'>",
          "<h3>Would You Like To Look For Some Or View Saved Contests?</h3>",
          "</div>",
          "<div class='card-body text-center'>",
          "<h4><a class='scrape'>Try Scraping New Contests</a></h4>",
          "<h4><a href='/saved'>Go to Saved Contests</a></h4>",
          "</div>",
          "</div>"
        ].join("")
      );
      // Appending this data to the page
      articleContainer.append(emptyAlert);
    }
  
    function handleArticleSave() {
      // This function is triggered when the user wants to save an article
      // When we rendered the article initially, we attached a javascript object containing the headline id
      // to the element using the .data method. Here we retrieve that.
      var articleToSave = $(this)
        .parents(".card")
        .data();
  
      // Remove card from page
      $(this)
        .parents(".card")
        .remove();
  
      articleToSave.saved = true;
      // Using a patch method to be semantic since this is an update to an existing record in our collection
      $.ajax({
        method: "PUT",
        url: "/api/saved/" + articleToSave._id,
        data: articleToSave
      }).then(function(data) {
        // If the data was saved successfully
        if (data.saved) {
          // Run the initPage function again. This will reload the entire list of articles
          initPage();
        }
      });
    }
  
    function articleScrape() {
      // This function handles the user clicking any "scrape new article" buttons
      $.getJSON("/api/scrape").then(function(data) {
        initPage();
        bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
      });
    }
  
    function handleArticleClear() {
      $.get("/api/clear").then(function() {
        articleContainer.empty();
        initPage();
      });
    }
  });
// Function to populate our notes
function populateNotes(articleId) {
  $("#notes").empty();
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + articleId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        for (var i = 0; i < data.note.length; i++) {

          var noteCard = $("<div>");
          noteCard.attr("class", "card");

          var noteCardBody = $("<div>");
          noteCardBody.attr("class", "card-body");

          var noteTitle = $("<h3>");
          noteTitle.attr("class", "card-title");
          noteTitle.text(data.note[i].title);

          var noteBody = $("<p>");
          noteBody.attr("class", "card-text");
          noteBody.text(data.note[i].body);

          var btnGroup = $("<div>");
          btnGroup.attr("class", "btn-group").attr("role", "group");

          var noteDeleteButton = $("<button class='btn btn-danger delete-note' article-id='"+articleId+"' data-id='"+data.note[i]._id+"'>");
          noteDeleteButton.text("Delete Note");

          btnGroup.append(noteDeleteButton);
          noteCardBody.append(noteTitle).append(noteBody).append(btnGroup);
          noteCard.append(noteCardBody);

          $("#notes").append("<hr>").append(noteCard);
        }
      }
    });
}

// Delete note
$(document).on("click", ".delete-note", function () {
  var noteId = $(this).attr("data-id");
  var articleId = $(this).attr("article-id");

  $.ajax({
    method: "DELETE",
    url: "/notes/" + noteId + "/" + articleId
  });

  populateNotes(articleId);
});


// Save our article when the user clicks the button
$(document).on("click", ".save-article", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "PUT",
    url: "/articles/" + thisId + "/true"
  })

  location.reload();
});

// Remove from saved articles when the user clicks the button
$(document).on("click", ".unsave-article", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "PUT",
    url: "/articles/" + thisId + "/false"
  })

  location.reload();
});


// Whenever someone clicks a 'notes' button class
$(document).on("click", ".notes", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  populateNotes(thisId);
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      populateNotes(thisId);
    });

});

// Get articles when the scrape button is clicked
$(document).on("click", "#scrap-articles", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function () {
    location.reload();
  })
});

// See saved articles when button is clicked
$(document).on("click", "#home-page", function () {
  $.ajax({
    method: "GET",
    url: "/"
  }).then(function () {
    location.reload();
    location.href = "/"
  })
});

// See saved articles when button is clicked
$(document).on("click", "#saved-articles", function () {
  $.ajax({
    method: "GET",
    url: "/savedarticles"
  }).then(function () {
    location.reload();
    location.href = "/savedarticles"
  })
});

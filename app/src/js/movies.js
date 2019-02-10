$(document).ready(function() {
  // Runs 'movieTheatres' function when the document is ready.
  movieTheatres();
});

// time conversion function.
const timeConvert = (time) => {
  // Convert time into minutes
  const min = time % 60;
  // Convert time into hours
  const hours = Math.round(time / 60);
  // Returns minutes converted into hours/minutes format.
  return `${hours}h ${min}min`;
}

// function that gets all movie theaters from the finnkino API and lists them into an select tag.
const movieTheatres = () => {  
  $.ajax({
    url: "http://www.finnkino.fi/xml/Schedule/",
    dataType: "xml",
    success: function(data) {
      $(data).find("Shows Show").each(function() {
        const TheatreID = $(this).find("TheatreID").text();
        const Theatre = $(this).find("Theatre").text();

        // Here we grab the select element where the generated option elements will be outputted.
        const selectElement = $("#theatres");
        // option element creation with values from the API, which are stored in variables, then appended to the select element.
        const optionElement = $("<option></option>", {id: TheatreID, class: "theatre-listing__item", text: Theatre }).appendTo(selectElement);

        // Removes duplicates from select listing.
        $('[id]').each(function () {
          $('[id="' + this.id + '"]:gt(0)').remove();
        });
      })
    }
  });

  // Runs the movieDate() function when a value is selected in the select element.
  $("#theatres").on('change', function(){
    const selectedTheatre = $(this).val();    
    $('.movie-listing__item').remove();
    // Passes the value selected into the function.
    movieData(selectedTheatre);
  });
};

// Creates function for the movieData listing. Creates elements and fetches data.
const movieData = (theatre) => {  
  $.ajax({
    url: "http://www.finnkino.fi/xml/Schedule/",
    dataType: "xml",
    success: function(data) {
      $(data).find("Shows Show").each(function() {
        // Shows only the theathers movies which was selected in the dropdown.
        if (theatre === $(this).find("Theatre").text()) {
          const EventID = $(this).find("EventID").text();
          const Title = $(this).find("Title").text();
          const OriginalTitle = $(this).find("OriginalTitle").text();
          const PosterImage = $(this).find("Images EventMediumImagePortrait").text();
          const RatingImageUrl = $(this).find("RatingImageUrl").text();
          let ShowStart = $(this).find("dttmShowStart").text();
          const ShowStartTime = ShowStart.split("T")[1].slice(0, -3);
          const LengthInMinutes = $(this).find("LengthInMinutes").text();
          const Genres = $(this).find("Genres").text();

          // Singular element creation for the movieData listings.
          const movieListItem = $("<li></li>", {class: "movie-listing__item" });
          const movieElement = $("<div></div>", {id: EventID, class: "movie" }).appendTo(movieListItem);
          const movieImagesElement = $("<div></div>", {class: "movie__images" }).appendTo(movieElement);
          const posterImageElement = $("<img></img>", {class: "movie__images-poster", alt: "poster image", src: PosterImage }).appendTo(movieImagesElement);
          const ratingImageElement = $("<img></img>", {class: "movie__images-restriction", alt: "age restriction", src: RatingImageUrl }).appendTo(movieImagesElement);
          const movieInformationElement = $("<div></div>", {class: "movie__information" }).appendTo(movieElement);
          const titleElement = $("<h2></h2>", {class: "movie__information-name", text: Title }).appendTo(movieInformationElement);
          const GenresElement = $("<p></p>", {class: "movie__information-genres", text: Genres }).appendTo(movieInformationElement);
          
          // Shows original name if it's not the same as the normal title.
          if (Title !== OriginalTitle) {
            const movieLengthElement = $("<p></p>", {class: "movie__information-length", text: `${timeConvert(LengthInMinutes)}` }).appendTo(movieInformationElement);
            const titleOriginalElement = $("<p></p>", {class: "movie__information-name-original", text: `${OriginalTitle}` }).appendTo(movieInformationElement);
          } else {
            const movieLengthElement = $("<p></p>", {class: "movie__information-length is-alone", text: `${timeConvert(LengthInMinutes)}` }).appendTo(movieInformationElement);
          }

          const showStartElement = $("<p></p>", {class: "movie__information-start-time", text: `SHOW STARTS: ${ShowStartTime}` }).appendTo(movieInformationElement);

          // Appends items to the listing element.
          movieListItem.appendTo(".js-movie-listing");
        }
      });
    }
  });
};
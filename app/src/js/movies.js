$(document).ready(function() {
  movieData();
})

const timeConvert = (time) => {
  const givenMinutes = time;
  const hours = (givenMinutes / 60);
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return `${rhours}h ${rminutes}min`;
}

const movieData = () => {  
  $.ajax({
    url: "http://www.finnkino.fi/xml/Schedule/",
    dataType: "xml",
    success: function(data) {
      $(data).find("Shows Show").each(function() {
        const EventID = $(this).find("EventID").text();
        const Title = $(this).find("Title").text();
        const OriginalTitle = $(this).find("OriginalTitle").text();
        const PosterImage = $(this).find("Images EventMediumImagePortrait").text();
        const RatingImageUrl = $(this).find("RatingImageUrl").text();
        let ShowStart = $(this).find("dttmShowStartUTC").text();
        const ShowStartTime = ShowStart.split("T")[1].slice(0, -4);
        const LengthInMinutes = $(this).find("LengthInMinutes").text();

        const movieListItem = $("<li></li>", {class: "movie-listing__item" });
        const movieElement = $("<div></div>", {id: EventID, class: "movie" }).appendTo(movieListItem);
        const movieImagesElement = $("<div></div>", {class: "movie__images" }).appendTo(movieElement);
        const posterImageElement = $("<img></img>", {class: "movie__images-poster", alt: "poster image", src: PosterImage }).appendTo(movieImagesElement);
        const ratingImageElement = $("<img></img>", {class: "movie__images-restriction", alt: "age restriction", src: RatingImageUrl }).appendTo(movieImagesElement);
        const movieInformationElement = $("<div></div>", {class: "movie__information" }).appendTo(movieElement);
        const titleElement = $("<h2></h2>", {class: "movie__information-name", text: Title }).appendTo(movieInformationElement);
        const titleOriginalElement = $("<h3></h3>", {class: "movie__information-name-original", text: OriginalTitle }).appendTo(movieInformationElement);
        const showStartElement = $("<h4></h4>", {class: "movie__information-start-time", text: ShowStartTime }).appendTo(movieInformationElement);
        const movieLengthElement = $("<p></p>", {class: "movie__information-length", text: timeConvert(LengthInMinutes) }).appendTo(movieInformationElement);

        movieListItem.appendTo(".js-movie-listing");
      });
    }
  });
};
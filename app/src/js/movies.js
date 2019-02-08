const timeConvert = time => {
  const min = time % 60;
  const hours = Math.round(time / 60);
  return `${hours}h ${min}min`;
};

const parseShowXML = data => {
  const theatreID = $(data)
    .find('TheatreID')
    .text();
  const theatre = $(data)
    .find('Theatre')
    .text();
  const eventID = $(data)
    .find('EventID')
    .text();
  const title = $(data)
    .find('Title')
    .text();
  const originalTitle = $(data)
    .find('OriginalTitle')
    .text();
  const posterImage = $(data)
    .find('Images EventMediumImagePortrait')
    .text();
  const ratingImageUrl = $(data)
    .find('RatingImageUrl')
    .text();
  const showStart = $(data)
    .find('dttmShowStart')
    .text();
  const showStartTime = showStart.split('T')[1].slice(0, -3);
  const lengthInMinutes = $(data)
    .find('LengthInMinutes')
    .text();
  const genres = $(data)
    .find('Genres')
    .text();

  return {
    theatreID,
    theatre,
    eventID,
    title,
    originalTitle,
    posterImage,
    ratingImageUrl,
    showStartTime,
    lengthInMinutes,
    genres,
  };
};

const renderMovieListItem = ({
  eventID,
  posterImage,
  ratingImageUrl,
  title,
  genres,
  originalTitle,
  lengthInMinutes,
  showStartTime,
}) => {
  // Singular element creation for the movieData listings.
  const movieListItem = $('<li></li>', { class: 'movie-listing__item' });
  const movieElement = $('<div></div>', {
    id: eventID,
    class: 'movie',
  }).appendTo(movieListItem);
  const movieImagesElement = $('<div></div>', {
    class: 'movie__images',
  }).appendTo(movieElement);
  $('<img></img>', {
    class: 'movie__images-poster',
    alt: 'poster image',
    src: posterImage,
  }).appendTo(movieImagesElement);
  $('<img></img>', {
    class: 'movie__images-restriction',
    alt: 'age restriction',
    src: ratingImageUrl,
  }).appendTo(movieImagesElement);
  const movieInformationElement = $('<div></div>', {
    class: 'movie__information',
  }).appendTo(movieElement);
  $('<h2></h2>', {
    class: 'movie__information-name',
    text: title,
  }).appendTo(movieInformationElement);
  $('<p></p>', {
    class: 'movie__information-genres',
    text: genres,
  }).appendTo(movieInformationElement);

  // Shows original name if it's not the same as the normal title.
  if (title !== originalTitle) {
    $('<p></p>', {
      class: 'movie__information-length',
      text: `${timeConvert(lengthInMinutes)}`,
    }).appendTo(movieInformationElement);
    $('<p></p>', {
      class: 'movie__information-name-original',
      text: `${originalTitle}`,
    }).appendTo(movieInformationElement);
  } else {
    $('<p></p>', {
      class: 'movie__information-length is-alone',
      text: `${timeConvert(lengthInMinutes)}`,
    }).appendTo(movieInformationElement);
  }

  $('<p></p>', {
    class: 'movie__information-start-time',
    text: `SHOW STARTS: ${showStartTime}`,
  }).appendTo(movieInformationElement);

  return movieListItem;
};

const renderMovieList = data => {
  console.log('Movie list update event');
  $('.movie-listing__item').remove();
  data.forEach(show => {
    renderMovieListItem({ ...show }).appendTo('.js-movie-listing');
  });
};

const appendSelectOptions = data => {
  const selectElement = $('#theatres');
  data.forEach(theatre => {
    $('<option></option>', {
      id: theatre.theatreID,
      value: theatre.theatreID,
      class: 'theatre-listing__item',
      text: theatre.theatre,
    }).appendTo(selectElement);
  });

  console.log('Theatre list ready');
};

const fetchMovieData = () =>
  $.ajax({
    url: 'http://www.finnkino.fi/xml/Schedule/',
    dataType: 'xml',
  });

const initApp = async () => {
  const rawData = await fetchMovieData();
  const data = [...$(rawData).find('Shows Show')].map(i => parseShowXML(i));

  const idsInList = [];
  const theatreList = data
    .filter(show => {
      if (idsInList.includes(show.theatreID)) {
        return false;
      }
      idsInList.push(show.theatreID);
      return true;
    })
    .map(show => ({ theatre: show.theatre, theatreID: show.theatreID }));

  appendSelectOptions(theatreList);

  $('#theatres').on('change', e =>
    renderMovieList(data.filter(show => show.theatreID === e.target.value))
  );
};

$(document).ready(function() {
  // Runs 'movieTheatres' function when the document is ready.
  initApp();
});

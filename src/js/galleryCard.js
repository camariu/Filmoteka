export function renderCardWithGenres(movie) {
  const { id, poster, title, genres, release, vote_average } = movie;
  const posterUrl = poster
    ? poster
    : 'https://dummyimage.com/395x574/000/fff.jpg&text=no+poster';

  const genresToShow = genres.slice(0, 2);
  if (genres.length > 2) {
    genresToShow.push('Others');
  }
  const year = release ? release : null;

  return `
    <li class="gallery__item">
      <a class="gallery__link" href="#" data-modal-open data-id="${id}">
        <img class="gallery__image" src="${posterUrl}" alt="${title} movie poster" loading="lazy">
        <div class="info">
          <h3 class="info__item">${title}</h3>
          <div class="info-detail">
            <p class="info-detail__item">${genresToShow.join(', ')}</p>
            <p class="info-detail__item">${year}
              <span class="film-rating film-rating--${getClassByRate(vote_average)}">
                ${Number(vote_average).toFixed(1)}
              </span>
            </p>
          </div>
        </div>
      </a>
    </li>
  `;
}

export function renderListMovies(list) {

  const movieCards = list.map(movie => renderCardWithGenres(movie));
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = movieCards.join('');
}

export function setFilmsToLocalStorage(list) {
  const localListMovies = {};
  list.forEach(item => {
    const { id, ...props } = item;
    localListMovies[id] = props;
  });
  localStorage.setItem('listMovies', JSON.stringify(localListMovies));
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote > 6) {
    return 'orange';
  } else {
    return 'red';
  }
}
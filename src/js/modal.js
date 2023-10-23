import { serviceApi } from './service-api';
import { renderListMovies } from './galleryCard';
import { getArrayFromObjMovies } from './libraryBtn';
import { emptyLibrary } from './emptyLibrary';
import { pagination } from './pagination-library';

const backdrop = document.querySelector('[data-modal]')
const openButtonModal = document.querySelector('.gallery');
const closeButtonModal = document.querySelector('[data-modal-close]')
const body = document.querySelector('body');
const modal = document.querySelector('.modal');
const blkLibraryEmpty = document.querySelector('.library-gallery');

const BTN_WATCHED_ADD = 'add to Watched';
const BTN_WATCHED_REMOVE = 'remove from Watched';
const BTN_QUEUE_ADD = 'add to queue';
const BTN_QUEUE_REMOVE = 'remove from queue';
const LIST_WATCHED = 'watchedMovies';
const LIST_QUEUE = 'listQueue';

let dataMovie = null;
const isLibraryPage = document.body.classList.contains('library-page');

openButtonModal.addEventListener('click', onOpenButtonClick)
closeButtonModal.addEventListener('click', onCloseButtonClick)
backdrop.addEventListener('click', onBackdropClick)
modal.addEventListener('click', handleClickModal);

function getActiveType() {
  try {
    return document.getElementById('btn__watched').classList.contains('active')
      ? LIST_WATCHED
      : LIST_QUEUE;
  } catch (err) {}
}

function onOpenButtonClick(e) {
  e.preventDefault();
  const currentMovie = e.target.closest('[data-modal-open]');

  if (currentMovie) {
    backdrop.classList.remove('is-hidden');
    window.addEventListener('keydown', closeModalByEscape);
    body.style.overflow = 'hidden';
    renderPopupBody(currentMovie.dataset.id);
  }
}

function onCloseButtonClick()  {
  backdrop.classList.add('is-hidden')
  window.removeEventListener('keydown', closeModalByEscape)
  document.querySelector('.modal-content-container').innerHTML = '';
  body.style.overflow = 'auto';
}

function onBackdropClick(event) {
  if (event.currentTarget === event.target) {
    onCloseButtonClick()
  }
}

function closeModalByEscape(event) {
  const closeButtonEscape = 'Escape'
  if (event.code === closeButtonEscape) {
    onCloseButtonClick()
  }
}

function renderTrailer(key) {
  if (!key) return;

  const blockTrailer = document.querySelector('.js-modalTrailer');
  blockTrailer.innerHTML = `
    <iframe width="560" height="240" src="https://www.youtube.com/embed/${key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  `;
}

function renderPopupBody(id) {
  dataMovie = JSON.parse(localStorage.getItem('listMovies'))[id];

  serviceApi.getTrailer(id)
    .then(renderTrailer)
    .catch(err => {});

  const {
    poster,
    title,
    vote_average,
    vote_count,
    popularity,
    original_title,
    genres,
    overview,
  } = dataMovie;

  const container = document.querySelector('.modal-content-container');

  if (container) {
    container.innerHTML = `
      <div class="modal-photo-container">
        <picture>
          <img src="${poster}" width="" class="statistick-img" alt="" />
        </picture>
      </div>
      <div class="content-modal" data-id='${id}'>
        <h2 class="modal-title">${title}</h2>
        <div class="statistic-container">
           <ul class="list">
              <li>
                <div class="statistic-wraper">
                  <p class="first-item-statistic">Vote / Votes</p>
                  <p><span class="statistic-vote">${Number(vote_average).toFixed(1)}</span>/<span class="statistic-votes">${vote_count}</span></p>
                </div>
              </li>
              <li>
                <div class="statistic-wraper">
                  <p class="first-item-statistic">Popularity</p>
                  <p>${Number(popularity).toFixed(1)}</p>
                </div>
              </li>
              <li>
                <div class="statistic-wraper">
                  <p class="first-item-statistic">Original Title</p>
                  <p>${original_title}</p>
                </div>
              </li>
              <li>
                <div class="statistic-wraper">
                  <p class="first-item-statistic">Genre</p>
                  <p>${genres.join(', ')}</p>
                </div>
              </li>
            </ul>
        </div>
        <h3 class="content-modal-title">About</h3>
        <p class="content-modal">${overview}</p>
        <div class="modal-btn-container">
          <button class="modal-btn btn-add-watched" data-btn-watch>${getButtonText(id, LIST_WATCHED)}</button>
          <button class="modal-btn btn-add-queue" data-btn-queue>${getButtonText(id, LIST_QUEUE)}</button>
        </div>
        <div class='modal-trailer js-modalTrailer'></div>
      </div>
    `;
  }
}

function handleClickModal(e) {
  const target = e.target;
  if (target.closest('[data-btn-watch]')) {
    toggleStatus('data-btn-watch', LIST_WATCHED);
    if (isLibraryPage) {
      rerenderLibMovies(LIST_WATCHED);
    }
  }
  if (target.closest('[data-btn-queue]')) {
    toggleStatus('data-btn-queue', LIST_QUEUE);
    if (isLibraryPage) {
      rerenderLibMovies(LIST_QUEUE);
    }
  }
}

function rerenderLibMovies(typeList) {
  onCloseButtonClick();

  if (typeList === getActiveType()) {
    if (getArrayFromObjMovies(typeList).length > 0) {
     const newArray = getArrayFromObjMovies(typeList)
     console.log("newArray:", newArray.length)
     pagination.off();
     pagination.reset(newArray.length);

    const currentPage = pagination.getCurrentPage();
    const itemsPerPage = pagination._options.itemsPerPage;
    const start = (currentPage - 1) * itemsPerPage; 
    const end = start + itemsPerPage;
    const itemsForPage = newArray.slice(start, end);

      renderListMovies(itemsForPage);

      pagination.on('afterMove', (event) => {
        const currentPage = event.page; 
        const itemsPerPage = pagination._options.itemsPerPage;
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const itemsForPage = newArray.slice(start, end);
        renderListMovies(itemsForPage);
        console.log(itemsForPage);
    });

      blkLibraryEmpty.classList.remove('active');
    } else {
      emptyLibrary();
    }
  }
}

function isIncluded(idMovie, listLocalStorage) {
  return idMovie in JSON.parse(localStorage.getItem(listLocalStorage));
}

function getButtonText(id, typeList) {
  let text = 'null';

  switch (typeList) {
    case LIST_WATCHED:
      text = isIncluded(id, LIST_WATCHED) ? BTN_WATCHED_REMOVE : BTN_WATCHED_ADD;
      break;
    case LIST_QUEUE:
      text = isIncluded(id, LIST_QUEUE) ? BTN_QUEUE_REMOVE : BTN_QUEUE_ADD;
      break;
  }

  return text;
}

function toggleStatus(dataAttr, typeList) {
  if (!dataAttr) return;
  const el = document.querySelector(`[${dataAttr}]`);

  const currentID = el.closest('.content-modal').dataset.id;

  const list = JSON.parse(localStorage.getItem(typeList));

  if (currentID in list) {
    delete list[currentID];
  } else {
    list[currentID] = dataMovie;
  }

  localStorage.setItem(typeList, JSON.stringify(list));

  el.textContent = getButtonText(currentID, typeList);
}
import { pagination } from './pagination-library';

import {emptyLibrary} from './emptyLibrary';


import { renderListMovies } from './galleryCard';

const classTheme = localStorage.getItem('active-theme') === 'dark-theme'
  ? 'dark-theme'
  : 'light-theme';

document.body.classList.add(classTheme);

const LIST_WATCHED = 'watchedMovies';
const LIST_QUEUE = 'listQueue';
const baseActive = LIST_WATCHED;
const blkCtrlLib = document.querySelector('.js-blockCtrlLib');
const blkLibraryEmpty = document.querySelector('.library-gallery');

localStorage.getItem(LIST_WATCHED) || localStorage.setItem(LIST_WATCHED,
JSON.stringify({}));
localStorage.getItem(LIST_QUEUE) || localStorage.setItem(LIST_QUEUE,
JSON.stringify({}));

blkCtrlLib && setActiveButton(baseActive);

if (blkCtrlLib && Object.keys(JSON.parse(localStorage.getItem(baseActive))).length > 0) {
  const listMovies = getArrayFromObjMovies(baseActive);
  console.log("listMovies:", listMovies)
 
  const currentPage = pagination.getCurrentPage(); 
    const itemsPerPage = pagination._options.itemsPerPage; 
    const start = (currentPage - 1) * itemsPerPage; 
    const end = start + itemsPerPage;
    const itemsForPage = listMovies.slice(start, end);
  renderListMovies(itemsForPage);

pagination._options.totalItems = listMovies.length;
pagination.reset(listMovies.length);
pagination.off();
   
  pagination.on('afterMove', (event) => {
    const currentPage = event.page; 
    const itemsPerPage = pagination._options.itemsPerPage; 
    const start = (currentPage - 1) * itemsPerPage; 
    const end = start + itemsPerPage;
    const itemsForPage = listMovies.slice(start, end);
    renderListMovies(itemsForPage);
    console.log(itemsForPage);
});

blkLibraryEmpty.classList.remove('active');


} else {
  emptyLibrary();
}

function setActiveButton(typeList) {
  const opts = {
    btn__watched: LIST_WATCHED,
    btn__queue: LIST_QUEUE,
  };

  Object.entries(opts).forEach(item => {
    const currentBtn = document.querySelector(`#${item[0]}`);
    if (item[1] === typeList) {
      currentBtn.classList.add('active');
      currentBtn.disabled = true;
    } else {
      currentBtn.classList.remove('active');
      currentBtn.disabled = false;
    }
  });
}

if (blkCtrlLib) {
  blkCtrlLib.addEventListener('click', onClickBtn);
}

export function getArrayFromObjMovies(fieldLocalStorage) {
  const objMovies = JSON.parse(localStorage.getItem(fieldLocalStorage));
  return Object.entries(objMovies).map(item => ({id: +item[0], ...item[1]}));
}

function onClickBtn(event) {
  event.preventDefault();
  const target = event.target;

  let type = null;
  let listMovies = null;

  if (target.closest('#btn__watched')) {
    type = LIST_WATCHED;
    setActiveButton(LIST_WATCHED);
  }
  if (target.closest('#btn__queue')) {
    type = LIST_QUEUE;
    setActiveButton(LIST_QUEUE);
  }

  if (type) {
    switch (type) {
      case LIST_WATCHED:
        listMovies = getArrayFromObjMovies(LIST_WATCHED);
        break;
      case LIST_QUEUE:
        listMovies = getArrayFromObjMovies(LIST_QUEUE);
        break;
    }
  }

  console.log(type, listMovies);

  if (listMovies.length > 0) {
    const currentPage = pagination.getCurrentPage(); 
    const itemsPerPage = pagination._options.itemsPerPage; 
    const start = (currentPage - 1) * itemsPerPage; 
    const end = start + itemsPerPage;
    const itemsForPage = listMovies.slice(start, end);
  renderListMovies(itemsForPage);
  
  blkLibraryEmpty.classList.remove('active');

  pagination._options.totalItems = listMovies.length;
  pagination.reset(listMovies.length);
  pagination.off();  

  pagination.on('afterMove', (event) => {
    const currentPage = event.page;
    const itemsPerPage = pagination._options.itemsPerPage;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsForPage = listMovies.slice(start, end);
    renderListMovies(itemsForPage);
    console.log(itemsForPage);
});

  } else {
    emptyLibrary();
  }

  // renderListMovies(listMovies);

};
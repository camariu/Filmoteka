import { serviceApi } from './service-api';
import {
  renderListMovies,
  setFilmsToLocalStorage,
} from './galleryCard';
import { pagination } from './pagination';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

async function onPagination(period) {
  try {
    const movies = await serviceApi.getListMovies(period);

    setFilmsToLocalStorage(movies.listMovies);
    renderListMovies(movies.listMovies);

    pagination._options.totalItems = movies.totalResults;

    pagination.reset(movies.totalResults);
    pagination.off();
  } catch (e) {
    console.log(e.message);
  }

  pagination.on('afterMove', (event) => {
    const currentPage = event.page;
    serviceApi
      .getListMovies(period, currentPage)
      .then((res) => {
        setFilmsToLocalStorage(res.listMovies);
        renderListMovies(res.listMovies);
      })
      .catch((error) => console.log(error));
    window.scrollTo(0, 0);
  });
}

async function initialize() {
  const period = 'day';
  onPagination(period);
}

initialize();

const searchForm = document.querySelector('#search-form');

searchForm.addEventListener('submit', onSearchByKeyword);
let totalResults;
let query;

async function onSearchByKeyword(e) {
  e.preventDefault();

  query = e.target.searchQuery.value.trim();

  try {
    const res = await serviceApi.searchMovie(query);

    if (!query) {
      return Notify.failure(
        'Sorry, we didn`t find anything. Please, type something'
      );
    } else if (res.totalResults < 1) {
      return Notify.failure(
        'Sorry, we didn`t find anything. Please, try again'
      );
    } else if (res.totalResults > 1) {
       Notify.success(`Hooray, we found ${res.totalResults} films`);
      

    setFilmsToLocalStorage(res.listMovies);
    renderListMovies(res['listMovies']);

    pagination._options.totalItems = res.totalResults;
    pagination.reset(res.totalResults);
    pagination.off();

    pagination.on('afterMove', event => {
      const currentPage = event.page;
  
      serviceApi
        .searchMovie(query, currentPage)
        .then(res => {
          setFilmsToLocalStorage(res.listMovies);
           renderListMovies(res['listMovies']);
        })
        .catch(console.error);
  
      window.scrollTo(0, 0);
    });
    }

  } catch (err) {
    console.error(err.message);
  }

  
}

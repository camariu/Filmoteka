const API_KEY = '4f9e0ec41e08da372f31f33f2c08989f';

class ServiceApi {
  constructor() {
    this.#getGenre().then(this.#setGenres);
  }

  #BASE_URL = 'https://api.themoviedb.org/3';
  #BASE_IMG = 'https://image.tmdb.org/t/p/w500';
  // #BASE_YOUTUBE = 'https://www.youtube.com/watch?v=';

  /**
   * The main addition method which do request
   * @param url {string} - unique part of URL
   * @returns {Promise<any>}
   */
  async getResource(url) {
    return await fetch(`${this.#BASE_URL}${url}api_key=${API_KEY}`)
      .then(res => res.json());
  }

  /**
   * Getting list of movies
   * @param period {string: ("day"|"week")} - Period to display popular movies
   * @param page {number} - Number of page of pagination
   * @returns {Promise<{totalPages: (number|number), page, listMovies: *}>}
   */
  getListMovies = async (period, page=1) => {
    const res = await this.getResource(`/trending/movie/${period}?page=${page}&`);
    return this.#transformListMovies(res);
  };

  /**
   * Looking for
   * @param movieId
   * @returns {Promise<{overview: string, original_title: *, genres: *, vote_average: *, popularity: *, title: *, vote_count: *, poster_path: string}>}
   */
  getMovie = async (movieId) => {
    const res = await this.getResource(`/movie/${movieId}?`);
    return await this.#transformDataMovie(res);
  };

  /**
   * Search a movie from dataBase
   * @param query {string} - string for search
   * @returns {Promise<*>}
   */
  searchMovie = async (query, page=1) => {
    const res = await this.getResource(`/search/movie?query=${query}&page=${page}&`);
    return this.#transformListMovies(res);
  };

  /**
   * Looking for trailer via ID of movie
   * @param movieId {number} - Identificator
   * @returns {Promise<string>}
   */
  getTrailer = async (movieId) => {
    const res = await this.getResource(`/movie/${movieId}/videos?`);
    return this.#transformDataTrailer(res);
  };

  /* Adding methods */
  #transformListMovies = (res) => {
    const {page, total_pages, results, total_results} = res;

    const totalPages = total_pages;
    const totalResults = total_results

    const listMovies = results.map(item => {
      const {
        id,
        poster_path,
        title,
        name,
        release_date,
        genre_ids,
        overview,
        popularity,
        original_title,
        vote_average,
        vote_count
      } = item;
      const keyGenres = JSON.parse(localStorage.getItem('genres'));

      const genres = Object.entries(keyGenres).filter(item => genre_ids.includes(+item[0])).map(item => item[1]);

      const poster = poster_path ? `${this.#BASE_IMG}${poster_path}` : null;

      const d = release_date && new Date(Date.parse(release_date));
      const release = release_date ? d.getFullYear() : null;

      return {
        id,
        genres,
        poster,
        release,
        title: title || name,
        overview,
        popularity,
        original_title,
        vote_average,
        vote_count,
      }
    });

    return {
      page,
      totalPages,
      totalResults,
      listMovies,
    };
  };
  #getGenre = async () => {
    return await this.getResource(`/genre/movie/list?`);
  };
  #transformDataMovie = async (res) => {
    const {
      title,
      vote_average,
      vote_count,
      popularity,
      original_title,
      genres,
      overview="",
      poster_path=null
    } = res;

    return {
      title,
      vote_average,
      vote_count,
      popularity,
      original_title,
      genres: genres.map(item => item['name']),
      overview,
      poster_path: `${this.#BASE_IMG}${poster_path}`,
    }
  };
  #setGenres = ({genres}) => {
    const objGenres = {};
    genres.forEach(({id, name}) => {
      objGenres[id] = name;
    });
    localStorage.setItem('genres', JSON.stringify(objGenres));
  };
  #transformDataTrailer = (res) => {
    const key = res['results'].find(item => item['site'] === "YouTube")['key'];
    return key;
  };
}

export const serviceApi = new ServiceApi();
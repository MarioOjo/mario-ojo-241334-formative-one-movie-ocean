import axios from 'axios';

// Create axios instances for different APIs
const tmdbAPI = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.REACT_APP_TMDB_KEY,
    language: 'en-US'
  }
});

const boxOfficeAPI = axios.create({
  baseURL: 'https://Movies-Verse.proxy-production.allthingsdev.co/api',
  headers: {
    "x-apihub-key": "YDoVJUPRVRQPoDRzkuiuccJDV1-6FgluIpO3QSuoFPSdQMW174",
    "x-apihub-host": "Movies-Verse.allthingsdev.co",
    "x-apihub-endpoint": "5122e0f8-a949-45a9-aedf-5eaf61c6085b"
  }
});

// Track active requests for cancellation
const activeRequests = new Set();

/**
 * Make an API request with cancellation support
 * @param {Object} apiInstance - Axios instance
 * @param {Object} config - Axios config
 * @returns {Promise} - API response
 */
const makeRequest = async (apiInstance, config) => {
  const source = axios.CancelToken.source();
  activeRequests.add(source);

  try {
    const response = await apiInstance({
      ...config,
      cancelToken: source.token
    });
    return response.data;
  } catch (error) {
    if (!axios.isCancel(error)) {
      console.error('API Error:', error);
      throw error;
    }
  } finally {
    activeRequests.delete(source);
  }
};

/**
 * Cancel all active requests
 */
export const cancelAllRequests = () => {
  activeRequests.forEach(source => source.cancel('Request canceled by user'));
  activeRequests.clear();
};

// TMDb API Endpoints
export const fetchPopularMovies = async () => {
  return makeRequest(tmdbAPI, {
    url: '/movie/popular',
    params: {
      page: 1
    }
  }).then(data => data.results);
};

export const getMovieDetails = async (id) => {
  return makeRequest(tmdbAPI, {
    url: `/movie/${id}`,
    params: {
      append_to_response: 'credits,videos,similar'
    }
  });
};

export const searchMovies = async (query) => {
  return makeRequest(tmdbAPI, {
    url: '/search/movie',
    params: {
      query,
      include_adult: false
    }
  }).then(data => data.results);
};

// Custom Box Office API Endpoints
export const fetchTopBoxOffice = async () => {
  return makeRequest(boxOfficeAPI, {
    url: '/movies/top-box-office'
  });
};

/**
 * Get complete movie data by combining TMDb and Box Office APIs
 * @param {string} id - Movie ID
 * @returns {Promise<Object>} - Combined movie data
 */
export const getCompleteMovieData = async (id) => {
  try {
    const [tmdbData, boxOfficeData] = await Promise.all([
      getMovieDetails(id),
      fetchTopBoxOffice()
    ]);

    // Find matching box office data
    const boxOfficeMatch = boxOfficeData.find(movie => 
      movie.id === id || movie.title.toLowerCase() === tmdbData.title.toLowerCase()
    );

    return {
      ...tmdbData,
      boxOffice: boxOfficeMatch || null
    };
  } catch (error) {
    console.error('Error combining API data:', error);
    throw error;
  }
};

// Utility functions
export const getPosterUrl = (path, size = 'w500') => {
  return path 
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
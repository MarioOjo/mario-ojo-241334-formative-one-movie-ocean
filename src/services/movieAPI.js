import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;

// Create axios instance with default config
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Movie API functions
export const movieAPI = {
  // Fetch movie by ID with comprehensive data
  fetchById: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'release_dates,credits,videos,reviews,recommendations,similar,images',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie by ID:', error);
      throw new Error(`Failed to fetch movie with ID: ${movieId}`);
    }
  },

  // Search movies
  search: async (query, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/movie', {
        params: {
          query,
          language: 'en-US',
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error(`Failed to search for: ${query}`);
    }
  },

  // Get popular movies
  getPopular: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/popular', {
        params: {
          language: 'en-US',
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw new Error('Failed to fetch popular movies');
    }
  },

  // Get movie recommendations
  getRecommendations: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/recommendations`, {
        params: {
          language: 'en-US',
          page: 1,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw new Error(`Failed to fetch recommendations for movie: ${movieId}`);
    }
  },
};

// Helper function to get full image URL
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper function to format currency
export const formatCurrency = (amount) => {
  if (!amount) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default movieAPI;
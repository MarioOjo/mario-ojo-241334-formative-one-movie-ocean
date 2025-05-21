// src/api.js
const API_KEY = 'bf12ff0542145f969307e128eae46673';
const BASE_URL = 'https://api.themoviedb.org/3';

// Function to search for movies
export const searchMovies = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
};

// Function to fetch movie details
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const movieData = await response.json();
    return movieData;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

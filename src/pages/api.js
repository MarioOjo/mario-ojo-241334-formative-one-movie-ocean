const API_KEY = 'bf12ff0542145f969307e128eae46673';
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const [details, credits] = await Promise.all([
      fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`),
      fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`)
    ]);
    
    const movieData = await details.json();
    const creditData = await credits.json();
    
    return {
      ...movieData,
      director: creditData.crew.find(p => p.job === 'Director')?.name || 'Unknown'
    };
  } catch (error) {
    console.error('Details error:', error);
    throw error;
  }
};
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { movieAPI, getImageUrl, formatCurrency } from '../services/movieAPI';
import { metricSets, getMetricData } from '../utils/movieMetrics';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import ComparisonChart from '../components/Charts/ComparisonChart';
import './ComparePage.css';

// Inline SearchBar component for comparison page
const SearchBar = ({ value, onChange, results, placeholder, index, onSelectMovie }) => (
  <div className="search-bar-container">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e, index)}
      placeholder={placeholder}
      className="search-input"
    />
    {results.length > 0 && (
      <ul className="search-results">
        {results.map((movie) => (
          <li key={movie.id} onClick={() => onSelectMovie(movie.id, index)}>
            <img 
              src={getImageUrl(movie.poster_path, 'w92') || 'https://via.placeholder.com/92x138?text=No+Poster'} 
              alt={movie.title}
              className="result-poster"
            />
            <div className="result-info">
              <span className="result-title">{movie.title}</span>
              <span className="result-year">
                ({movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'})
              </span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const ComparePage = () => {
  const [movies, setMovies] = useState([null, null]);
  const [loading, setLoading] = useState([false, false]);
  const [searchTerm, setSearchTerm] = useState(['', '']);
  const [searchResults, setSearchResults] = useState([[], []]);
  const [activeMetricSet, setActiveMetricSet] = useState('financial');

  const searchMovies = async (query, index) => {
    if (!query.trim()) {
      setSearchResults(prev => {
        const newResults = [...prev];
        newResults[index] = [];
        return newResults;
      });
      return;
    }

    try {
      setLoading(prev => {
        const newLoad = [...prev];
        newLoad[index] = true;
        return newLoad;
      });

      const results = await movieAPI.search(query);
      
      setSearchResults(prev => {
        const newResults = [...prev];
        newResults[index] = results.results.slice(0, 5); // Limit to 5 results
        return newResults;
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults(prev => {
        const newResults = [...prev];
        newResults[index] = [];
        return newResults;
      });
    } finally {
      setLoading(prev => {
        const newLoad = [...prev];
        newLoad[index] = false;
        return newLoad;
      });
    }
  };

  const handleSearchChange = (e, index) => {
    const value = e.target.value;
    setSearchTerm(prev => {
      const newTerms = [...prev];
      newTerms[index] = value;
      return newTerms;
    });
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchMovies(value, index);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const fetchMovieDetails = async (movieId, index) => {
    try {
      setLoading(prev => {
        const newLoad = [...prev];
        newLoad[index] = true;
        return newLoad;
      });

      const movieData = await movieAPI.fetchById(movieId);
      
      const movie = {
        ...movieData,
        poster_path: getImageUrl(movieData.poster_path),
        backdrop_path: getImageUrl(movieData.backdrop_path, 'w1280'),
        // Add comprehensive data
        credits: movieData.credits || {},
        videos: movieData.videos || {},
        reviews: movieData.reviews || {},
        recommendations: movieData.recommendations || {},
        similar: movieData.similar || {},
        images: movieData.images || {}
      };

      selectMovie(movie, index);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(prev => {
        const newLoad = [...prev];
        newLoad[index] = false;
        return newLoad;
      });
    }
  };

  const selectMovie = (movie, index) => {
    setMovies(prev => {
      const newMovies = [...prev];
      newMovies[index] = movie;
      return newMovies;
    });
    setSearchTerm(prev => {
      const newTerms = [...prev];
      newTerms[index] = movie.title;
      return newTerms;
    });
    setSearchResults(prev => {
      const newResults = [...prev];
      newResults[index] = [];
      return newResults;
    });
  };

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1>🎬 Advanced Movie Comparison</h1>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>

      {/* Metric Controls */}
      <div className="comparison-controls">
        <div className="metric-selector">
          <h4>📊 Metric Category</h4>
          <div className="metric-buttons">
            {Object.keys(metricSets).map(key => (
              <button
                key={key}
                className={`metric-button ${activeMetricSet === key ? 'active' : ''}`}
                onClick={() => setActiveMetricSet(key)}
              >
                {{
                  financial: '💰',
                  audience: '👥',
                  production: '🎬',
                  analytics: '📈'
                }[key]} {metricSets[key].title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="search-containers">
        {/* First Movie Column */}
        <div className="movie-column">
          <div className="search-box">
            <h3>🎥 First Movie</h3>
            <SearchBar
              value={searchTerm[0]}
              onChange={handleSearchChange}
              results={searchResults[0]}
              placeholder="Search first movie..."
              index={0}
              onSelectMovie={fetchMovieDetails}
            />
            {loading[0] && <LoadingSpinner message="Searching..." size="small" />}
            {movies[0] && !loading[0] && (
              <div className="selected-movie">
                <img 
                  src={movies[0].poster_path || 'https://via.placeholder.com/300x450?text=No+Poster'} 
                  alt={movies[0].title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h4>{movies[0].title}</h4>
                  {movies[0].release_date && (
                    <p className="release-year">({new Date(movies[0].release_date).getFullYear()})</p>
                  )}
                  {movies[0].tagline && (
                    <p className="movie-tagline">"{movies[0].tagline}"</p>
                  )}
                  <div className="quick-stats">
                    <div className="stat-item">
                      <span>Rating:</span>
                      <span>{(movies[0].vote_average || 0).toFixed(1)}/10</span>
                    </div>
                    <div className="stat-item">
                      <span>Budget:</span>
                      <span>{formatCurrency(movies[0].budget)}</span>
                    </div>
                    <div className="stat-item">
                      <span>Revenue:</span>
                      <span>{formatCurrency(movies[0].revenue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="vs-circle">
          <span>VS</span>
        </div>

        {/* Second Movie Column */}
        <div className="movie-column">
          <div className="search-box">
            <h3>🎥 Second Movie</h3>
            <SearchBar
              value={searchTerm[1]}
              onChange={handleSearchChange}
              results={searchResults[1]}
              placeholder="Search second movie..."
              index={1}
              onSelectMovie={fetchMovieDetails}
            />
            {loading[1] && <LoadingSpinner message="Searching..." size="small" />}
            {movies[1] && !loading[1] && (
              <div className="selected-movie">
                <img 
                  src={movies[1].poster_path || 'https://via.placeholder.com/300x450?text=No+Poster'} 
                  alt={movies[1].title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h4>{movies[1].title}</h4>
                  {movies[1].release_date && (
                    <p className="release-year">({new Date(movies[1].release_date).getFullYear()})</p>
                  )}
                  {movies[1].tagline && (
                    <p className="movie-tagline">"{movies[1].tagline}"</p>
                  )}
                  <div className="quick-stats">
                    <div className="stat-item">
                      <span>Rating:</span>
                      <span>{(movies[1].vote_average || 0).toFixed(1)}/10</span>
                    </div>
                    <div className="stat-item">
                      <span>Budget:</span>
                      <span>{formatCurrency(movies[1].budget)}</span>
                    </div>
                    <div className="stat-item">
                      <span>Revenue:</span>
                      <span>{formatCurrency(movies[1].revenue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      {movies[0] && movies[1] && !loading[0] && !loading[1] && (
        <ComparisonChart
          movie1={movies[0]}
          movie2={movies[1]}
          metricData1={getMetricData(movies[0], activeMetricSet)}
          metricData2={getMetricData(movies[1], activeMetricSet)}
          categoryTitle={metricSets[activeMetricSet]?.title}
        />
      )}
    </div>
  );
};

export default ComparePage;
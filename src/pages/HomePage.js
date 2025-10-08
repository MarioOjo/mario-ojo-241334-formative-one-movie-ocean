import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarChart from '../components/Charts/BarChart';
import AdvancedChartSelector from '../components/Charts/AdvancedChartSelector';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { movieAPI, getImageUrl, formatCurrency, formatDate } from '../services/movieAPI';
import './HomePage.css';

// Chart.js setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

// TMDB API configuration
const DEFAULT_MOVIE_ID = 603; // The Matrix movie ID

// Remove the old API functions since we're using the service now

const HomePage = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const fetchMovie = async (movieIdOrQuery) => {
    setLoading(true);
    setError(null);
    setShowResults(false);
    try {
      let movieData;
      // Check if it's an ID (number) or search query (string)
      if (typeof movieIdOrQuery === 'number') {
        movieData = await movieAPI.fetchById(movieIdOrQuery);
      } else {
        const results = await movieAPI.search(movieIdOrQuery);
        movieData = results.results.length > 0 ? await movieAPI.fetchById(results.results[0].id) : null;
      }
      
      if (movieData) {
        setMovie({
          ...movieData,
          // Normalize the data structure
          budget: movieData.budget,
          revenue: movieData.revenue,
          vote_average: movieData.vote_average,
          vote_count: movieData.vote_count,
          runtime: movieData.runtime,
          popularity: movieData.popularity,
          poster_path: getImageUrl(movieData.poster_path),
          backdrop_path: getImageUrl(movieData.backdrop_path, 'w1280'),
          release_date: movieData.release_date,
          // Add new comprehensive data
          credits: movieData.credits || {},
          videos: movieData.videos || {},
          reviews: movieData.reviews || {},
          recommendations: movieData.recommendations || {},
          similar: movieData.similar || {}
        });
        setQuery(''); // Clear search after selecting
        setSearchResults([]);
      } else {
        setMovie(null);
        setError(`No movies found for "${movieIdOrQuery}"`);
      }
    } catch (error) {
      console.error("Error fetching movie:", error);
      setError('Failed to fetch movie data. Please try again.');
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  // New function for live search suggestions
  const searchMoviesLive = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const results = await movieAPI.search(searchQuery);
      setSearchResults(results.results.slice(0, 5)); // Limit to 5 results
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear previous timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Set new timeout for debounced search
    window.searchTimeout = setTimeout(() => {
      if (value.trim().length >= 2) {
        searchMoviesLive(value);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);
  };

  // Handle selecting a movie from search results
  const handleSelectMovie = (movieId) => {
    fetchMovie(movieId);
  };

  // Load default movie immediately on component mount
  useEffect(() => {
    fetchMovie(DEFAULT_MOVIE_ID);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    fetchMovie(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleCompareClick = () => {
    navigate('/compare');
  };

  // Helper functions for rendering components
  const renderCastSection = () => {
    if (!movie?.credits?.cast?.length) return null;
    
    const topCast = movie.credits.cast.slice(0, 8);
    
    return (
      <div className="cast-crew-section">
        <h3 className="section-title">Top Cast</h3>
        <div className="cast-grid">
          {topCast.map((actor) => (
            <div key={actor.id} className="cast-member">
              <div className="member-name">{actor.name}</div>
              <div className="member-role">{actor.character}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCrewSection = () => {
    if (!movie?.credits?.crew?.length) return null;
    
    const keyRoles = ['Director', 'Producer', 'Screenplay', 'Story', 'Music', 'Cinematography'];
    const keyCrew = movie.credits.crew.filter(person => 
      keyRoles.includes(person.job)
    ).slice(0, 8);
    
    return (
      <div className="cast-crew-section">
        <h3 className="section-title">Key Crew</h3>
        <div className="crew-grid">
          {keyCrew.map((person, index) => (
            <div key={`${person.id}-${index}`} className="crew-member">
              <div className="member-name">{person.name}</div>
              <div className="member-role">{person.job}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTrailersSection = () => {
    if (!movie?.videos?.results?.length) return null;
    
    const trailers = movie.videos.results
      .filter(video => video.type === 'Trailer' && video.site === 'YouTube')
      .slice(0, 2);
    
    if (!trailers.length) return null;
    
    return (
      <div className="trailers-section">
        <h3 className="section-title">Trailers</h3>
        <div className="trailers-grid">
          {trailers.map((trailer) => (
            <div key={trailer.id} className="trailer-item">
              <iframe
                className="trailer-iframe"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMovieStats = () => {
    if (!movie) return null;
    
    return (
      <div className="movie-stats">
        <div className="stat-item">
          <span className="stat-label">Budget:</span>
          <span className="stat-value">{formatCurrency(movie.budget)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Revenue:</span>
          <span className="stat-value">{formatCurrency(movie.revenue)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Rating:</span>
          <span className="stat-value">{movie.vote_average}/10</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Runtime:</span>
          <span className="stat-value">{movie.runtime} min</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Release Date:</span>
          <span className="stat-value">{formatDate(movie.release_date)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Genres:</span>
          <span className="stat-value">
            {movie.genres?.map(g => g.name).join(', ') || 'N/A'}
          </span>
        </div>
      </div>
    );
  };
  // Memoized chart data
  const chartData = React.useMemo(() => {
    if (!movie) return { barChartData: null, radarChartData: null };

    const barChartData = {
      labels: ['Budget ($M)', 'Revenue ($M)', 'Profit ($M)'],
      datasets: [{
        label: movie.title || 'N/A',
        data: [
          movie.budget / 1000000 || 0,
          movie.revenue / 1000000 || 0,
          (movie.revenue - movie.budget) / 1000000 || 0,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }],
    };

    const radarChartData = {
      labels: ['Rating (x10)', 'Popularity', 'Runtime (/10)', 'Vote Count (/1000)'],
      datasets: [{
        label: movie.title || 'N/A',
        data: [
          (movie.vote_average * 10) || 0,
          movie.popularity || 0,
          (movie.runtime / 10) || 0,
          (movie.vote_count / 1000) || 0,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
      }],
    };

    return { barChartData, radarChartData };
  }, [movie]);

  // Chart options
  const chartOptions = {
    barChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Financial Performance' },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Millions (USD)' }
        }
      }
    },
    radarChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Movie Metrics Overview' },
      },
      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 0,
          pointLabels: { color: '#333' }
        }
      }
    }
  };

  return (
    <div className="homepage">
      <h1>Discover & Compare Movies</h1>
      
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            onFocus={() => query.trim().length >= 2 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            disabled={loading}
          />
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="search-result-item"
                  onClick={() => handleSelectMovie(result.id)}
                >
                  <img
                    src={getImageUrl(result.poster_path, 'w92') || 'https://via.placeholder.com/92x138?text=No+Poster'}
                    alt={result.title}
                    className="result-poster"
                  />
                  <div className="result-info">
                    <div className="result-title">{result.title}</div>
                    <div className="result-year">
                      {result.release_date ? new Date(result.release_date).getFullYear() : 'N/A'}
                    </div>
                    {result.vote_average > 0 && (
                      <div className="result-rating">
                        ⭐ {result.vote_average.toFixed(1)}/10
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="button-group">
          <button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Searching...
              </>
            ) : 'Search'}
          </button>
          <button 
            onClick={handleCompareClick}
            className="compare-button"
            disabled={loading}
          >
            Compare Movies
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <LoadingSpinner 
          message={movie ? 'Searching for movies...' : 'Loading The Matrix...'} 
          size="large"
        />
      ) : movie ? (
        <div className="movie-data-container">
          <div className="movie-details">
            <div className="movie-info">
              <div className="movie-header">
                <h2>{movie.title}</h2>
                {movie.release_date && (
                  <p className="release-year">
                    ({new Date(movie.release_date).getFullYear()})
                  </p>
                )}
                {movie.overview && (
                  <p className="movie-overview">{movie.overview}</p>
                )}
              </div>
              
              {movie.poster_path && (
                <img 
                  src={movie.poster_path}
                  alt={`${movie.title} poster`}
                  className="movie-poster"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x750?text=Poster+Not+Available';
                  }}
                />
              )}
            </div>
            
            <div className="movie-stats-container">
              {renderMovieStats()}
            </div>
          </div>
          
          <div className="chart-container">
            <BarChart 
              data={chartData.barChartData} 
              options={chartOptions.barChartOptions}
              title="Financial Performance"
            />
          </div>
          
          <AdvancedChartSelector movie={movie} />
          
          {renderCastSection()}
          {renderCrewSection()}
          {renderTrailersSection()}
        </div>
      ) : (
        <p className="no-results">No movie data available. Try a search!</p>
      )}
    </div>
  );
};

export default HomePage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarChart from '../components/Charts/BarChart';
import RadarChart from '../components/Charts/RadarChart';
import axios from 'axios';
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

const API_URL = "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/search";
const API_HEADERS = {
  "x-apihub-key": "YDoVJUPRVRQPoDRzkuiuccJDV1-6FgluIpO3QSuoFPSdQMW174",
  "x-apihub-host": "Movies-Verse.allthingsdev.co",
  "x-apihub-endpoint": "5122e0f8-a949-45a9-aedf-5eaf61c6085b"
};

// Configurable default movie
const DEFAULT_MOVIE_QUERY = "The Matrix"; // Change this to any default movie you want

const HomePage = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true); // Start with true for initial load
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const fetchMovie = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}?query=${encodeURIComponent(searchQuery)}`,
        { headers: API_HEADERS }
      );
      
      if (response.data.results?.length > 0) {
        setMovie(response.data.results[0]);
      } else {
        setMovie(null);
        setError(`No movies found for "${searchQuery}"`);
      }
    } catch (error) {
      console.error("Error fetching movie:", error);
      setError('Failed to fetch movie data. Please try again.');
      setMovie(null);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Load default movie on initial render
  useEffect(() => {
    fetchMovie(DEFAULT_MOVIE_QUERY);
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

  // Chart data
  const barChartData = movie ? {
    labels: ['Budget ($M)', 'Revenue ($M)', 'Profit ($M)'],
    datasets: [{
      label: movie.title || 'N/A',
      data: [
        movie.budget / 1000000 || 0,
        movie.revenue / 1000000 || 0,
        (movie.revenue - movie.budget) / 1000000 || 0,
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  } : null;

  const radarChartData = movie ? {
    labels: ['Rating', 'Popularity', 'Runtime', 'Vote Count'],
    datasets: [{
      label: movie.title || 'N/A',
      data: [
        movie.vote_average || 0,
        movie.popularity || 0,
        movie.runtime || 0,
        movie.vote_count || 0,
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
    }],
  } : null;

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Financial Metrics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Millions (USD)'
        }
      }
    }
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance Metrics',
      },
    },
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        pointLabels: {
          color: '#333'
        }
      }
    }
  };

  return (
    <div className="homepage">
      <h1>Discover & Compare Movies</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
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

      {initialLoad ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading {DEFAULT_MOVIE_QUERY}...</p>
        </div>
      ) : loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading movie data...</p>
        </div>
      ) : movie ? (
        <div className="movie-data-container">
          <div className="movie-header">
            <h2>{movie.title}</h2>
            {movie.release_date && (
              <p className="release-year">
                ({new Date(movie.release_date).getFullYear()})
              </p>
            )}
            {movie.poster_path && (
              <img 
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={`${movie.title} poster`}
                className="movie-poster"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450?text=Poster+Not+Available';
                }}
              />
            )}
          </div>
          
          <div className="chart-container">
            <BarChart data={barChartData} options={barChartOptions} />
            <RadarChart data={radarChartData} options={radarChartOptions} />
          </div>
        </div>
      ) : (
        <p className="no-results">No movie data available. Try a search!</p>
      )}
    </div>
  );
};

export default HomePage;
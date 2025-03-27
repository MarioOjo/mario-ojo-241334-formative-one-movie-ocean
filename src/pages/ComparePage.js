import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import './ComparePage.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// API Configuration
const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZjEyZmYwNTQyMTQ1Zjk2OTMwN2UxMjhlYWU0NjY3MyIsInN1YiI6IjY2ZTk1NjFlODJmZjg3M2Y3ZDFlYTZmMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Gi_-5IleLtUa4XCv8VwUkHKjJaQNwWPAVOw5Ed3LOUg';

const ComparePage = () => {
  const [movies, setMovies] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState(['', '']);
  const [searchResults, setSearchResults] = useState([[], []]);
  const [loading, setLoading] = useState({
    search: [false, false],
    details: [false, false]
  });
  const [activeTab, setActiveTab] = useState('financial');

  // Search movies from TMDB API
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
      setLoading(prev => ({
        ...prev,
        search: [...prev.search.slice(0, index), true, ...prev.search.slice(index + 1)]
      }));

      const response = await axios.get(`${API_URL}/search/movie`, {
        params: {
          query,
          include_adult: false,
          language: 'en-US',
          page: 1
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`
        }
      });

      setSearchResults(prev => {
        const newResults = [...prev];
        newResults[index] = response.data.results.slice(0, 5);
        return newResults;
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(prev => ({
        ...prev,
        search: [...prev.search.slice(0, index), false, ...prev.search.slice(index + 1)]
      }));
    }
  };

  // Fetch complete movie details
  const fetchMovieDetails = async (movieId, index) => {
    try {
      setLoading(prev => ({
        ...prev,
        details: [...prev.details.slice(0, index), true, ...prev.details.slice(index + 1)]
      }));

      const [detailsResponse, creditsResponse] = await Promise.all([
        axios.get(`${API_URL}/movie/${movieId}`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
          }
        }),
        axios.get(`${API_URL}/movie/${movieId}/credits`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
          }
        })
      ]);

      const movieData = {
        id: detailsResponse.data.id,
        title: detailsResponse.data.title,
        poster_path: detailsResponse.data.poster_path 
          ? `https://image.tmdb.org/t/p/w500${detailsResponse.data.poster_path}`
          : 'https://via.placeholder.com/500x750?text=No+Poster',
        release_date: detailsResponse.data.release_date,
        tagline: detailsResponse.data.tagline || '',
        overview: detailsResponse.data.overview,
        budget: detailsResponse.data.budget || 0,
        revenue: detailsResponse.data.revenue || 0,
        // Estimate weekend gross as 30% of total revenue
        weekend_gross: Math.floor((detailsResponse.data.revenue || 0) * 0.3),
        vote_average: detailsResponse.data.vote_average,
        vote_count: detailsResponse.data.vote_count,
        runtime: detailsResponse.data.runtime || 0,
        director: creditsResponse.data.crew.find(person => person.job === 'Director')?.name || 'Unknown'
      };

      setMovies(prev => {
        const newMovies = [...prev];
        newMovies[index] = {
          ...movieData,
          profit: movieData.revenue - movieData.budget
        };
        return newMovies;
      });

      // Clear search results after selection
      setSearchResults(prev => {
        const newResults = [...prev];
        newResults[index] = [];
        return newResults;
      });

      // Reset search term to selected movie title
      setSearchTerm(prev => {
        const newTerms = [...prev];
        newTerms[index] = movieData.title;
        return newTerms;
      });
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(prev => ({
        ...prev,
        details: [...prev.details.slice(0, index), false, ...prev.details.slice(index + 1)]
      }));
    }
  };

  const handleSearchChange = (e, index) => {
    const value = e.target.value;
    setSearchTerm(prev => {
      const newTerms = [...prev];
      newTerms[index] = value;
      return newTerms;
    });
    searchMovies(value, index);
  };

  // Format currency in millions
  const formatCurrency = (amount) => {
    if (amount === 0 || amount === null) return '$0M';
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  // Format runtime
  const formatRuntime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  // Render star rating
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1 ? '½' : '';
    
    return (
      <div className="rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">★</span>
        ))}
        {halfStar && <span className="star half">½</span>}
        <span className="rating-text">{rating.toFixed(1)}/10</span>
      </div>
    );
  };

  // Create chart data
  const createChartData = (type, movie) => {
    if (!movie) return null;
    
    switch (type) {
      case 'financial':
        return {
          labels: ['Budget', 'Revenue', 'Profit'],
          datasets: [{
            label: 'USD',
            data: [movie.budget, movie.revenue, movie.profit],
            backgroundColor: ['#4bc0c0', '#36a2eb', '#ff6384']
          }]
        };
      case 'performance':
        return {
          labels: ['Rating', 'Votes', 'Runtime'],
          datasets: [{
            label: 'Metrics',
            data: [
              movie.vote_average * 10, // Scale to 100 for chart
              Math.min(movie.vote_count / 10000, 100), // Scale votes
              movie.runtime
            ],
            backgroundColor: ['#ff9f40', '#9966ff', '#ffcd56']
          }]
        };
      default:
        return null;
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (activeTab === 'financial') {
              return formatCurrency(context.raw);
            }
            if (context.label === 'Rating') {
              return `${(context.raw / 10).toFixed(1)}/10`;
            }
            if (context.label === 'Votes') {
              return `${(context.raw * 10000).toLocaleString()} votes`;
            }
            if (context.label === 'Runtime') {
              return formatRuntime(context.raw);
            }
            return context.raw;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (activeTab === 'financial') {
              return formatCurrency(value);
            }
            return value;
          }
        }
      }
    }
  };

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1>Movie Comparison Tool</h1>
      </div>

      <div className="search-containers">
        {/* First Movie Column */}
        <div className="movie-column">
          <div className="search-box">
            <h3>First Movie</h3>
            <div className="search-input-container">
              <input
                type="text"
                value={searchTerm[0]}
                onChange={(e) => handleSearchChange(e, 0)}
                placeholder="Search first movie..."
                className="search-input"
              />
              {loading.search[0] && <div className="search-loading">Searching...</div>}
            </div>
            {searchResults[0].length > 0 && (
              <div className="search-results">
                {searchResults[0].map(movie => (
                  <div 
                    key={movie.id}
                    className="result-item"
                    onClick={() => fetchMovieDetails(movie.id, 0)}
                  >
                    {movie.title} ({movie.release_date?.substring(0, 4) || 'N/A'})
                  </div>
                ))}
              </div>
            )}
          </div>

          {movies[0] && (
            <div className="movie-display">
              <div className="poster-column">
                <img 
                  src={movies[0].poster_path} 
                  alt={movies[0].title}
                  className="movie-poster"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/500x750?text=Poster+Not+Available';
                  }}
                />
              </div>
              <div className="info-column">
                <h2 className="movie-title">{movies[0].title}</h2>
                <div className="movie-meta">
                  <span>{new Date(movies[0].release_date).getFullYear()}</span>
                  <span>•</span>
                  <span>{formatRuntime(movies[0].runtime)}</span>
                  <span>•</span>
                  <span>{movies[0].director}</span>
                </div>

                <div className="rating-container">
                  {renderRating(movies[0].vote_average)}
                  <span className="vote-count">({movies[0].vote_count.toLocaleString()} votes)</span>
                </div>

                {movies[0].tagline && <p className="tagline">"{movies[0].tagline}"</p>}

                <div className="overview-box">
                  <h3>Overview</h3>
                  <p>{movies[0].overview}</p>
                </div>

                <div className="stats-container">
                  <div className="stat-box">
                    <span className="stat-label">WEEKEND GROSS</span>
                    <span className="stat-value">{formatCurrency(movies[0].weekend_gross)}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">TOTAL GROSS</span>
                    <span className="stat-value">{formatCurrency(movies[0].revenue)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="vs-circle">VS</div>

        {/* Second Movie Column */}
        <div className="movie-column">
          <div className="search-box">
            <h3>Second Movie</h3>
            <div className="search-input-container">
              <input
                type="text"
                value={searchTerm[1]}
                onChange={(e) => handleSearchChange(e, 1)}
                placeholder="Search second movie..."
                className="search-input"
              />
              {loading.search[1] && <div className="search-loading">Searching...</div>}
            </div>
            {searchResults[1].length > 0 && (
              <div className="search-results">
                {searchResults[1].map(movie => (
                  <div 
                    key={movie.id}
                    className="result-item"
                    onClick={() => fetchMovieDetails(movie.id, 1)}
                  >
                    {movie.title} ({movie.release_date?.substring(0, 4) || 'N/A'})
                  </div>
                ))}
              </div>
            )}
          </div>

          {movies[1] && (
            <div className="movie-display">
              <div className="poster-column">
                <img 
                  src={movies[1].poster_path} 
                  alt={movies[1].title}
                  className="movie-poster"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/500x750?text=Poster+Not+Available';
                  }}
                />
              </div>
              <div className="info-column">
                <h2 className="movie-title">{movies[1].title}</h2>
                <div className="movie-meta">
                  <span>{new Date(movies[1].release_date).getFullYear()}</span>
                  <span>•</span>
                  <span>{formatRuntime(movies[1].runtime)}</span>
                  <span>•</span>
                  <span>{movies[1].director}</span>
                </div>

                <div className="rating-container">
                  {renderRating(movies[1].vote_average)}
                  <span className="vote-count">({movies[1].vote_count.toLocaleString()} votes)</span>
                </div>

                {movies[1].tagline && <p className="tagline">"{movies[1].tagline}"</p>}

                <div className="overview-box">
                  <h3>Overview</h3>
                  <p>{movies[1].overview}</p>
                </div>

                <div className="stats-container">
                  <div className="stat-box">
                    <span className="stat-label">WEEKEND GROSS</span>
                    <span className="stat-value">{formatCurrency(movies[1].weekend_gross)}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">TOTAL GROSS</span>
                    <span className="stat-value">{formatCurrency(movies[1].revenue)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      {movies[0] && movies[1] && (
        <div className="charts-section">
          <div className="chart-tabs">
            <button 
              className={`tab-button ${activeTab === 'financial' ? 'active' : ''}`}
              onClick={() => setActiveTab('financial')}
            >
              Financial Comparison
            </button>
            <button 
              className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              Performance Metrics
            </button>
          </div>

          <div className="chart-container">
            <div className="chart-wrapper">
              <h3>{movies[0].title}</h3>
              <div className="chart">
                <Bar 
                  data={createChartData(activeTab, movies[0])} 
                  options={chartOptions}
                  height={400}
                />
              </div>
            </div>

            <div className="chart-wrapper">
              <h3>{movies[1].title}</h3>
              <div className="chart">
                <Bar 
                  data={createChartData(activeTab, movies[1])} 
                  options={chartOptions}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
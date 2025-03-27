import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { searchMovies, fetchMovieDetails } from './api';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ComparePage = () => {
  const [movies, setMovies] = useState([null, null]);
  const [searchTerms, setSearchTerms] = useState(['', '']);
  const [searchResults, setSearchResults] = useState([[], []]);
  const [loading, setLoading] = useState({
    search: [false, false],
    details: [false, false]
  });
  const [activeTab, setActiveTab] = useState('financial');
  const [differences, setDifferences] = useState(null);

  // Load from localStorage on initial render
  useEffect(() => {
    const savedComparison = localStorage.getItem('movieComparison');
    if (savedComparison) {
      const { movies: savedMovies, terms } = JSON.parse(savedComparison);
      setMovies(savedMovies);
      setSearchTerms(terms);
    }
  }, []);

  // Save to localStorage when movies change
  useEffect(() => {
    if (movies.some(m => m !== null)) {
      localStorage.setItem('movieComparison', JSON.stringify({
        movies,
        terms: searchTerms
      }));
    }
  }, [movies, searchTerms]);

  // Calculate differences when movies change
  useEffect(() => {
    if (movies[0] && movies[1]) {
      calculateDifferences();
    } else {
      setDifferences(null);
    }
  }, [movies]);

  const searchMoviesHandler = async (query, index) => {
    if (!query.trim()) {
      updateSearchResults([], index);
      return;
    }

    setLoading(prev => updateLoadingState(prev, 'search', index, true));
    
    try {
      const results = await searchMovies(query);
      updateSearchResults(results.slice(0, 5), index);
    } catch (error) {
      console.error('Search failed:', error);
      updateSearchResults([], index);
    } finally {
      setLoading(prev => updateLoadingState(prev, 'search', index, false));
    }
  };

  const handleMovieSelect = async (movieId, index) => {
    setLoading(prev => updateLoadingState(prev, 'details', index, true));
    
    try {
      const movieData = await fetchMovieDetails(movieId);
      const normalizedData = normalizeMovieData(movieData);
      
      setMovies(prev => {
        const newMovies = [...prev];
        newMovies[index] = normalizedData;
        return newMovies;
      });
      
      updateSearchResults([], index);
      setSearchTerms(prev => {
        const newTerms = [...prev];
        newTerms[index] = normalizedData.title;
        return newTerms;
      });
    } catch (error) {
      console.error('Failed to load movie:', error);
    } finally {
      setLoading(prev => updateLoadingState(prev, 'details', index, false));
    }
  };

  const calculateDifferences = () => {
    const movie1 = movies[0];
    const movie2 = movies[1];
    
    setDifferences({
      budget: movie2.budget - movie1.budget,
      revenue: movie2.revenue - movie1.revenue,
      profit: movie2.profit - movie1.profit,
      rating: movie2.vote_average - movie1.vote_average,
      runtime: movie2.runtime - movie1.runtime,
      year: new Date(movie2.release_date).getFullYear() - 
           new Date(movie1.release_date).getFullYear()
    });
  };

  const swapMovies = () => {
    setMovies([movies[1], movies[0]]);
    setSearchTerms([searchTerms[1], searchTerms[0]]);
  };

  const clearComparison = () => {
    setMovies([null, null]);
    setSearchTerms(['', '']);
    setSearchResults([[], []]);
    localStorage.removeItem('movieComparison');
  };

  // Helper functions
  const updateSearchResults = (results, index) => {
    setSearchResults(prev => {
      const newResults = [...prev];
      newResults[index] = results;
      return newResults;
    });
  };

  const updateLoadingState = (prev, type, index, value) => {
    const newState = {...prev};
    newState[type] = [...newState[type]];
    newState[type][index] = value;
    return newState;
  };

  const normalizeMovieData = (data) => ({
    id: data.id,
    title: data.title,
    poster_path: data.poster_path 
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Poster',
    release_date: data.release_date,
    tagline: data.tagline || '',
    overview: data.overview,
    budget: data.budget || 0,
    revenue: data.revenue || 0,
    vote_average: data.vote_average,
    vote_count: data.vote_count,
    runtime: data.runtime || 0,
    genres: data.genres?.map(g => g.name) || [],
    director: data.director,
    profit: (data.revenue || 0) - (data.budget || 0)
  });

  const formatCurrency = (amount) => {
    if (amount === 0 || amount === null) return '$0M';
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatRuntime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

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

  const createComparisonChartData = () => {
    if (!movies[0] || !movies[1]) return null;
    
    const labels = activeTab === 'financial'
      ? ['Budget', 'Revenue', 'Profit']
      : ['Rating', 'Votes', 'Runtime'];
    
    return {
      labels,
      datasets: movies.map((movie, index) => ({
        label: movie?.title || '',
        data: activeTab === 'financial'
          ? [movie?.budget || 0, movie?.revenue || 0, movie?.profit || 0]
          : [
              (movie?.vote_average || 0) * 10,
              Math.min((movie?.vote_count || 0) / 10000, 100),
              movie?.runtime || 0
            ],
        backgroundColor: index === 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)',
        borderColor: index === 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }))
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            let value = context.raw;
            
            if (activeTab === 'financial') {
              value = formatCurrency(value);
            } else if (context.label === 'Rating') {
              value = `${(value / 10).toFixed(1)}/10`;
            } else if (context.label === 'Votes') {
              value = `${(value * 10000).toLocaleString()} votes`;
            } else if (context.label === 'Runtime') {
              value = formatRuntime(value);
            }
            
            return `${label}: ${value}`;
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
        {movies[0] && movies[1] && (
          <div className="comparison-actions">
            <button onClick={swapMovies} className="action-button swap">
              Swap Movies
            </button>
            <button onClick={clearComparison} className="action-button clear">
              Clear Comparison
            </button>
          </div>
        )}
      </div>

      <div className="search-containers">
        {[0, 1].map(index => (
          <div key={index} className="movie-column">
            <div className="search-box">
              <h3>Movie {index + 1}</h3>
              <div className="search-input-container">
                <input
                  type="text"
                  value={searchTerms[index]}
                  onChange={(e) => {
                    const newTerms = [...searchTerms];
                    newTerms[index] = e.target.value;
                    setSearchTerms(newTerms);
                    searchMoviesHandler(e.target.value, index);
                  }}
                  placeholder={`Search movie ${index + 1}...`}
                  className="search-input"
                />
                {loading.search[index] && <div className="search-loading">Searching...</div>}
              </div>
              {searchResults[index].length > 0 && (
                <div className="search-results">
                  {searchResults[index].map(movie => (
                    <div 
                      key={movie.id}
                      className="result-item"
                      onClick={() => handleMovieSelect(movie.id, index)}
                    >
                      {movie.title} ({movie.release_date?.substring(0, 4) || 'N/A'})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {movies[index] && (
              <div className="movie-display">
                <div className="poster-column">
                  <img 
                    src={movies[index].poster_path} 
                    alt={movies[index].title}
                    className="movie-poster"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/500x750?text=Poster+Not+Available';
                    }}
                  />
                </div>
                <div className="info-column">
                  <h2 className="movie-title">{movies[index].title}</h2>
                  <div className="movie-meta">
                    <span>{new Date(movies[index].release_date).getFullYear()}</span>
                    <span>•</span>
                    <span>{formatRuntime(movies[index].runtime)}</span>
                    <span>•</span>
                    <span>{movies[index].director}</span>
                  </div>

                  <div className="rating-container">
                    {renderRating(movies[index].vote_average)}
                    <span className="vote-count">({movies[index].vote_count.toLocaleString()} votes)</span>
                  </div>

                  {movies[index].tagline && <p className="tagline">"{movies[index].tagline}"</p>}

                  <div className="overview-box">
                    <h3>Overview</h3>
                    <p>{movies[index].overview}</p>
                  </div>

                  <div className="stats-container">
                    <div className="stat-box">
                      <span className="stat-label">BUDGET</span>
                      <span className="stat-value">{formatCurrency(movies[index].budget)}</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">REVENUE</span>
                      <span className="stat-value">{formatCurrency(movies[index].revenue)}</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">PROFIT</span>
                      <span className="stat-value">{formatCurrency(movies[index].profit)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="vs-circle">VS</div>
      </div>

      {/* Differences Summary */}
      {differences && (
        <div className="differences-section">
          <h3>Key Differences</h3>
          <div className="differences-grid">
            <div className="difference-item">
              <span className="difference-label">Budget</span>
              <span className={`difference-value ${differences.budget > 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(Math.abs(differences.budget))} {differences.budget > 0 ? 'higher' : 'lower'}
              </span>
            </div>
            <div className="difference-item">
              <span className="difference-label">Revenue</span>
              <span className={`difference-value ${differences.revenue > 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(Math.abs(differences.revenue))} {differences.revenue > 0 ? 'higher' : 'lower'}
              </span>
            </div>
            <div className="difference-item">
              <span className="difference-label">Rating</span>
              <span className={`difference-value ${differences.rating > 0 ? 'positive' : 'negative'}`}>
                {Math.abs(differences.rating).toFixed(1)} points {differences.rating > 0 ? 'higher' : 'lower'}
              </span>
            </div>
            <div className="difference-item">
              <span className="difference-label">Release Year</span>
              <span className={`difference-value ${differences.year > 0 ? 'positive' : 'negative'}`}>
                {Math.abs(differences.year)} years {differences.year > 0 ? 'newer' : 'older'}
              </span>
            </div>
          </div>
        </div>
      )}

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
            <div className="chart">
              <Bar 
                data={createComparisonChartData()} 
                options={chartOptions}
                height={400}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
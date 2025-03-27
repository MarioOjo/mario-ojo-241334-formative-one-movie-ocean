import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './ComparePage.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// API configuration details
const API_URL = 'https://api.themoviedb.org/3/search/movie';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZjEyZmYwNTQyMTQ1Zjk2OTMwN2UxMjhlYWU0NjY3MyIsInN1YiI6IjY2ZTk1NjFlODJmZjg3M2Y3ZDFlYTZmMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Gi_-5IleLtUa4XCv8VwUkHKjJaQNwWPAVOw5Ed3LOUg'
  }
};

const ComparePage = () => {
  const [movies, setMovies] = useState([null, null]);
  const [loading, setLoading] = useState([false, false]);
  const [searchTerm, setSearchTerm] = useState(['', '']);
  const [searchResults, setSearchResults] = useState([[], []]);

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

      const response = await axios.get(`${API_URL}?query=${query}&include_adult=false&language=en-US&page=1`, options);
      
      const results = response.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'https://via.placeholder.com/500x750?text=No+Poster',
        release_date: movie.release_date,
        tagline: '', // TMDB doesn't provide tagline in search results
        overview: movie.overview,
        budget: movie.budget || 0,
        revenue: movie.revenue || 0,
        weekend_gross: 0, // TMDB doesn't provide weekend gross in search
        vote_average: movie.vote_average,
        runtime: movie.runtime || 0
      }));

      setSearchResults(prev => {
        const newResults = [...prev];
        newResults[index] = results;
        return newResults;
      });
    } catch (error) {
      console.error('Search error:', error);
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
    searchMovies(value, index);
  };

  const fetchMovieDetails = async (movieId, index) => {
    try {
      setLoading(prev => {
        const newLoad = [...prev];
        newLoad[index] = true;
        return newLoad;
      });

      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, options);
      const details = response.data;

      // Additional call for release dates to get weekend gross (approximation)
      const releaseResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/release_dates`, options);
      const usRelease = releaseResponse.data.results.find(r => r.iso_3166_1 === 'US');
      const releaseDate = usRelease?.release_dates[0]?.release_date || details.release_date;

      const movie = {
        id: details.id,
        title: details.title,
        poster_path: details.poster_path 
          ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
          : 'https://via.placeholder.com/500x750?text=No+Poster',
        release_date: details.release_date,
        tagline: details.tagline,
        overview: details.overview,
        budget: details.budget || 0,
        revenue: details.revenue || 0,
        weekend_gross: Math.floor(details.revenue * 0.3), // Approximation since TMDB doesn't provide
        vote_average: details.vote_average,
        runtime: details.runtime || 0
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
    const formattedMovie = {
      ...movie,
      profit: movie.revenue - movie.budget
    };
    setMovies(prev => {
      const newMovies = [...prev];
      newMovies[index] = formattedMovie;
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

  // Format currency in millions
  const formatCurrency = (amount) => {
    if (amount === 0 || amount === null) return '$0M';
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  // Create chart data for individual movie
  const createMovieChartData = (movie) => {
    if (!movie) return null;
    
    return {
      labels: ['Budget', 'Revenue', 'Profit'],
      datasets: [{
        label: 'Financials (USD)',
        data: [movie.budget, movie.revenue, movie.profit],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    };
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
            return `$${(context.raw / 1000000).toFixed(1)}M`;
          }
        }
      },
      title: {
        display: true,
        text: 'Financial Performance (USD Millions)',
        color: '#fff',
        font: {
          size: 14
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#ccc',
          callback: function(value) {
            return `$${(value / 1000000).toFixed(0)}M`;
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#ccc'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  const SearchBar = ({ value, onChange, onSelect, results, placeholder, index }) => (
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
            <li key={movie.id} onClick={() => fetchMovieDetails(movie.id, index)}>
              {movie.title} ({movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'})
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1>Movie Comparison Tool</h1>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>

      <div className="search-containers">
        {/* First Movie Column */}
        <div className="movie-column">
          <div className="search-box">
            <h3>First Movie</h3>
            <SearchBar
              value={searchTerm[0]}
              onChange={handleSearchChange}
              results={searchResults[0]}
              placeholder="Search first movie..."
              index={0}
            />
            {loading[0] && <div className="loading-spinner">Loading...</div>}
            {movies[0] && !loading[0] && (
              <div className="selected-movie">
                <img 
                  src={movies[0].poster_path} 
                  alt={movies[0].title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h4>{movies[0].title}</h4>
                  {movies[0].release_date && (
                    <p>({new Date(movies[0].release_date).getFullYear()})</p>
                  )}
                  {movies[0].tagline && (
                    <p className="movie-tagline">{movies[0].tagline}</p>
                  )}
                  {movies[0].overview && (
                    <p className="movie-overview">{movies[0].overview}</p>
                  )}
                  <div className="movie-stats">
                    <div className="stat-box">
                      <span>WEEKEND GROSS</span>
                      <span>{formatCurrency(movies[0].weekend_gross)}</span>
                    </div>
                    <div className="stat-box">
                      <span>TOTAL GROSS</span>
                      <span>{formatCurrency(movies[0].revenue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {movies[0] && !loading[0] && (
            <div className="chart-container">
              <div className="chart-wrapper">
                <Bar 
                  data={createMovieChartData(movies[0])} 
                  options={chartOptions}
                />
              </div>
              <div className="chart-summary">
                <p><strong>Budget:</strong> {formatCurrency(movies[0].budget)}</p>
                <p><strong>Revenue:</strong> {formatCurrency(movies[0].revenue)}</p>
                <p><strong>Profit:</strong> {formatCurrency(movies[0].profit)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="vs-circle">VS</div>

        {/* Second Movie Column */}
        <div className="movie-column">
          <div className="search-box">
            <h3>Second Movie</h3>
            <SearchBar
              value={searchTerm[1]}
              onChange={handleSearchChange}
              results={searchResults[1]}
              placeholder="Search second movie..."
              index={1}
            />
            {loading[1] && <div className="loading-spinner">Loading...</div>}
            {movies[1] && !loading[1] && (
              <div className="selected-movie">
                <img 
                  src={movies[1].poster_path} 
                  alt={movies[1].title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h4>{movies[1].title}</h4>
                  {movies[1].release_date && (
                    <p>({new Date(movies[1].release_date).getFullYear()})</p>
                  )}
                  {movies[1].tagline && (
                    <p className="movie-tagline">{movies[1].tagline}</p>
                  )}
                  {movies[1].overview && (
                    <p className="movie-overview">{movies[1].overview}</p>
                  )}
                  <div className="movie-stats">
                    <div className="stat-box">
                      <span>WEEKEND GROSS</span>
                      <span>{formatCurrency(movies[1].weekend_gross)}</span>
                    </div>
                    <div className="stat-box">
                      <span>TOTAL GROSS</span>
                      <span>{formatCurrency(movies[1].revenue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {movies[1] && !loading[1] && (
            <div className="chart-container">
              <div className="chart-wrapper">
                <Bar 
                  data={createMovieChartData(movies[1])} 
                  options={chartOptions}
                />
              </div>
              <div className="chart-summary">
                <p><strong>Budget:</strong> {formatCurrency(movies[1].budget)}</p>
                <p><strong>Revenue:</strong> {formatCurrency(movies[1].revenue)}</p>
                <p><strong>Profit:</strong> {formatCurrency(movies[1].profit)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Summary */}
      {movies[0] && movies[1] && !loading[0] && !loading[1] && (
        <div className="comparison-summary">
          <h3>Key Differences</h3>
          <div className="difference-grid">
            <div className="difference-item">
              <span>Budget Difference</span>
              <span>{formatCurrency(Math.abs(movies[0].budget - movies[1].budget))}</span>
            </div>
            <div className="difference-item">
              <span>Revenue Difference</span>
              <span>{formatCurrency(Math.abs(movies[0].revenue - movies[1].revenue))}</span>
            </div>
            <div className="difference-item">
              <span>Profit Difference</span>
              <span>{formatCurrency(Math.abs(movies[0].profit - movies[1].profit))}</span>
            </div>
            <div className="difference-item">
              <span>Weekend Gross Difference</span>
              <span>{formatCurrency(Math.abs(movies[0].weekend_gross - movies[1].weekend_gross))}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
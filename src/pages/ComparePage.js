// ComparePage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/Search/SearchBar';
import BarChart from '../components/Charts/BarChart';
import './ComparePage.css';

// Register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

const ComparePage = () => {
  const [movies, setMovies] = useState([null, null]);

  const handleMovieSelect = (movie, index) => {
    const newMovies = [...movies];
    newMovies[index] = {
      ...movie,
      profit: movie.revenue - movie.budget
    };
    setMovies(newMovies);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Create chart data for individual movie
  const createMovieChartData = (movie) => {
    return {
      labels: ['Budget', 'Revenue', 'Profit'],
      datasets: [{
        label: 'Financials',
        data: [
          movie?.budget || 0,
          movie?.revenue || 0,
          movie?.profit || 0
        ],
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
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return formatCurrency(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1>Movie Comparison Tool</h1>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>

      <div className="search-containers">
        {/* First Movie */}
        <div className="movie-column">
          <div className="search-box">
            <h3>First Movie</h3>
            <SearchBar 
              onSearch={(movie) => handleMovieSelect(movie, 0)} 
              placeholder="Search first movie..."
            />
            {movies[0] && (
              <div className="selected-movie">
                <img 
                  src={movies[0].poster_path || 'https://via.placeholder.com/200x300?text=No+Poster'} 
                  alt={movies[0].title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h4>{movies[0].title}</h4>
                  {movies[0].release_date && (
                    <p>({new Date(movies[0].release_date).getFullYear()})</p>
                  )}
                  <p className="movie-tagline">{movies[0].tagline}</p>
                  <p className="movie-overview">{movies[0].overview}</p>
                  <div className="movie-stats">
                    <div className="stat-box">
                      <span>WEEKEND GROSS</span>
                      <span>{formatCurrency(movies[0].weekend_gross || 0)}</span>
                    </div>
                    <div className="stat-box">
                      <span>TOTAL GROSS</span>
                      <span>{formatCurrency(movies[0].revenue || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {movies[0] && (
            <div className="chart-container">
              <h4>Financial Performance</h4>
              <BarChart 
                data={createMovieChartData(movies[0])} 
                options={chartOptions} 
                height={300}
              />
            </div>
          )}
        </div>

        <div className="vs-circle">VS</div>

        {/* Second Movie */}
        <div className="movie-column">
          <div className="search-box">
            <h3>Second Movie</h3>
            <SearchBar 
              onSearch={(movie) => handleMovieSelect(movie, 1)} 
              placeholder="Search second movie..."
            />
            {movies[1] && (
              <div className="selected-movie">
                <img 
                  src={movies[1].poster_path || 'https://via.placeholder.com/200x300?text=No+Poster'} 
                  alt={movies[1].title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h4>{movies[1].title}</h4>
                  {movies[1].release_date && (
                    <p>({new Date(movies[1].release_date).getFullYear()})</p>
                  )}
                  <p className="movie-tagline">{movies[1].tagline}</p>
                  <p className="movie-overview">{movies[1].overview}</p>
                  <div className="movie-stats">
                    <div className="stat-box">
                      <span>WEEKEND GROSS</span>
                      <span>{formatCurrency(movies[1].weekend_gross || 0)}</span>
                    </div>
                    <div className="stat-box">
                      <span>TOTAL GROSS</span>
                      <span>{formatCurrency(movies[1].revenue || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {movies[1] && (
            <div className="chart-container">
              <h4>Financial Performance</h4>
              <BarChart 
                data={createMovieChartData(movies[1])} 
                options={chartOptions} 
                height={300}
              />
            </div>
          )}
        </div>
      </div>

      {/* Comparison Summary */}
      {movies[0] && movies[1] && (
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
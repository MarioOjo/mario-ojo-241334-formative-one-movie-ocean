import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/Search/SearchBar';
import BarChart from '../components/Charts/BarChart'; // Add this import
import RadarChart from '../components/Charts/RadarChart'; // Add this import
import './ComparePage.css';

// Register Chart.js components at the top
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

const ComparePage = () => {
  const [movies, setMovies] = useState([null, null]);

  const handleMovieSelect = (movie, index) => {
    const newMovies = [...movies];
    newMovies[index] = movie;
    setMovies(newMovies);
  };

  // Define chart data before using in JSX
  const barChartData = movies[0] && movies[1] ? {
    labels: ['Budget ($M)', 'Revenue ($M)', 'Profit ($M)'],
    datasets: [
      {
        label: movies[0].title || 'Movie 1',
        data: [
          movies[0].budget / 1000000 || 0,
          movies[0].revenue / 1000000 || 0,
          (movies[0].revenue - movies[0].budget) / 1000000 || 0,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: movies[1].title || 'Movie 2',
        data: [
          movies[1].budget / 1000000 || 0,
          movies[1].revenue / 1000000 || 0,
          (movies[1].revenue - movies[1].budget) / 1000000 || 0,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  const radarChartData = movies[0] && movies[1] ? {
    labels: ['Rating', 'Popularity', 'Runtime', 'Vote Count'],
    datasets: [
      {
        label: movies[0].title || 'Movie 1',
        data: [
          movies[0].vote_average || 0,
          movies[0].popularity || 0,
          movies[0].runtime || 0,
          movies[0].vote_count || 0,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: movies[1].title || 'Movie 2',
        data: [
          movies[1].vote_average || 0,
          movies[1].popularity || 0,
          movies[1].runtime || 0,
          movies[1].vote_count || 0,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  } : null;

  // Define chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Financial Comparison ($M)',
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
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance Metrics Comparison',
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)'
        },
        suggestedMin: 0,
        pointLabels: {
          color: '#333'
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
        {/* First Movie Search */}
        <div className="search-box">
          <h3>First Movie</h3>
          <SearchBar onSelect={(movie) => handleMovieSelect(movie, 0)} />
          {movies[0] && (
            <div className="selected-movie">
              <img 
                src={movies[0].poster_path 
                  ? `https://image.tmdb.org/t/p/w200${movies[0].poster_path}` 
                  : 'https://via.placeholder.com/200x300?text=No+Image'} 
                alt={movies[0].title || 'No Title'}
              />
              <h4>{movies[0].title || 'Unknown Title'}</h4>
            </div>
          )}
        </div>

        <div className="vs-circle">VS</div>

        {/* Second Movie Search */}
        <div className="search-box">
          <h3>Second Movie</h3>
          <SearchBar onSelect={(movie) => handleMovieSelect(movie, 1)} />
          {movies[1] && (
            <div className="selected-movie">
              <img 
                src={movies[1].poster_path 
                  ? `https://image.tmdb.org/t/p/w200${movies[1].poster_path}` 
                  : 'https://via.placeholder.com/200x300?text=No+Image'} 
                alt={movies[1].title || 'No Title'}
              />
              <h4>{movies[1].title || 'Unknown Title'}</h4>
            </div>
          )}
        </div>
      </div>

      {/* Charts - Only show when both movies are selected */}
      {movies[0] && movies[1] && (
        <div className="charts-container">
          <div className="chart-wrapper">
            <BarChart data={barChartData} options={barChartOptions} />
          </div>
          <div className="chart-wrapper">
            <RadarChart data={radarChartData} options={radarChartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
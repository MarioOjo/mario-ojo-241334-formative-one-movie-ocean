import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
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

// API configuration
const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZjEyZmYwNTQyMTQ1Zjk2OTMwN2UxMjhlYWU0NjY3MyIsInN1YiI6IjY2ZTk1NjFlODJmZjg3M2Y3ZDFlYTZmMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Gi_-5IleLtUa4XCv8VwUkHKjJaQNwWPAVOw5Ed3LOUg';

const ComparePage = () => {
  const [movies, setMovies] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState(['', '']);
  const [searchResults, setSearchResults] = useState([[], []]);
  const [loading, setLoading] = useState([false, false]);

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
      setLoading(prev => {
        const newLoad = [...prev];
        newLoad[index] = true;
        return newLoad;
      });

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
        newResults[index] = response.data.results.slice(0, 5); // Show top 5 results
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

  // Fetch full movie details including financials
  const fetchMovieDetails = async (movieId, index) => {
    try {
      setLoading(prev => {
        const newLoad = [...prev];
        newLoad[index] = true;
        return newLoad;
      });

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
        tagline: detailsResponse.data.tagline,
        overview: detailsResponse.data.overview,
        budget: detailsResponse.data.budget || 0,
        revenue: detailsResponse.data.revenue || 0,
        // Estimate weekend gross as 30% of total revenue (TMDB doesn't provide this)
        weekend_gross: Math.floor((detailsResponse.data.revenue || 0) * 0.3),
        vote_average: detailsResponse.data.vote_average,
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

  // Create chart data for a movie
  const createChartData = (movie) => {
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
    <div style={styles.page}>
      <h1 style={styles.header}>Movie Comparison Tool</h1>
      
      <div style={styles.columnsContainer}>
        {/* First Movie Column */}
        <div style={styles.movieColumn}>
          <div style={styles.searchBox}>
            <input
              type="text"
              value={searchTerm[0]}
              onChange={(e) => handleSearchChange(e, 0)}
              placeholder="Search first movie..."
              style={styles.searchInput}
            />
            {loading[0] && <div style={styles.loading}>Loading...</div>}
            {searchResults[0].length > 0 && (
              <div style={styles.resultsDropdown}>
                {searchResults[0].map(movie => (
                  <div 
                    key={movie.id}
                    style={styles.resultItem}
                    onClick={() => fetchMovieDetails(movie.id, 0)}
                  >
                    {movie.title} ({movie.release_date?.substring(0, 4) || 'N/A'})
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {movies[0] && (
            <>
              <div style={styles.movieCard}>
                <img 
                  src={movies[0].poster_path} 
                  alt={movies[0].title}
                  style={styles.poster}
                />
                <div style={styles.movieInfo}>
                  <h3 style={styles.movieTitle}>{movies[0].title}</h3>
                  <p style={styles.movieYear}>
                    ({new Date(movies[0].release_date).getFullYear()}) • {movies[0].runtime} min
                  </p>
                  <p style={styles.tagline}>{movies[0].tagline}</p>
                  <p style={styles.overview}>{movies[0].overview}</p>
                  
                  <div style={styles.statsContainer}>
                    <div style={styles.statBox}>
                      <span style={styles.statLabel}>WEEKEND GROSS</span>
                      <span style={styles.statValue}>
                        {formatCurrency(movies[0].weekend_gross)}
                      </span>
                    </div>
                    <div style={styles.statBox}>
                      <span style={styles.statLabel}>TOTAL GROSS</span>
                      <span style={styles.statValue}>
                        {formatCurrency(movies[0].revenue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={styles.chartContainer}>
                <Bar 
                  data={createChartData(movies[0])} 
                  options={chartOptions}
                  height={300}
                />
              </div>
            </>
          )}
        </div>

        <div style={styles.vsCircle}>VS</div>

        {/* Second Movie Column */}
        <div style={styles.movieColumn}>
          <div style={styles.searchBox}>
            <input
              type="text"
              value={searchTerm[1]}
              onChange={(e) => handleSearchChange(e, 1)}
              placeholder="Search second movie..."
              style={styles.searchInput}
            />
            {loading[1] && <div style={styles.loading}>Loading...</div>}
            {searchResults[1].length > 0 && (
              <div style={styles.resultsDropdown}>
                {searchResults[1].map(movie => (
                  <div 
                    key={movie.id}
                    style={styles.resultItem}
                    onClick={() => fetchMovieDetails(movie.id, 1)}
                  >
                    {movie.title} ({movie.release_date?.substring(0, 4) || 'N/A'})
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {movies[1] && (
            <>
              <div style={styles.movieCard}>
                <img 
                  src={movies[1].poster_path} 
                  alt={movies[1].title}
                  style={styles.poster}
                />
                <div style={styles.movieInfo}>
                  <h3 style={styles.movieTitle}>{movies[1].title}</h3>
                  <p style={styles.movieYear}>
                    ({new Date(movies[1].release_date).getFullYear()}) • {movies[1].runtime} min
                  </p>
                  <p style={styles.tagline}>{movies[1].tagline}</p>
                  <p style={styles.overview}>{movies[1].overview}</p>
                  
                  <div style={styles.statsContainer}>
                    <div style={styles.statBox}>
                      <span style={styles.statLabel}>WEEKEND GROSS</span>
                      <span style={styles.statValue}>
                        {formatCurrency(movies[1].weekend_gross)}
                      </span>
                    </div>
                    <div style={styles.statBox}>
                      <span style={styles.statLabel}>TOTAL GROSS</span>
                      <span style={styles.statValue}>
                        {formatCurrency(movies[1].revenue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={styles.chartContainer}>
                <Bar 
                  data={createChartData(movies[1])} 
                  options={chartOptions}
                  height={300}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  page: {
    padding: '2rem',
    backgroundColor: '#1a1a1a',
    color: 'white',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    color: '#4bc0c0',
    marginBottom: '2rem'
  },
  columnsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '2rem',
    '@media (max-width: 768px)': {
      flexDirection: 'column'
    }
  },
  movieColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    position: 'relative'
  },
  searchBox: {
    padding: '1rem',
    backgroundColor: '#2d2d2d',
    borderRadius: '8px',
    position: 'relative'
  },
  searchInput: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '4px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: 'white',
    fontSize: '1rem'
  },
  resultsDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#333',
    borderRadius: '4px',
    zIndex: 10,
    marginTop: '0.5rem',
    maxHeight: '300px',
    overflowY: 'auto',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
  },
  resultItem: {
    padding: '0.8rem 1rem',
    cursor: 'pointer',
    borderBottom: '1px solid #444',
    ':hover': {
      backgroundColor: '#444'
    }
  },
  loading: {
    padding: '0.5rem',
    color: '#4bc0c0',
    textAlign: 'center'
  },
  movieCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: '8px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  poster: {
    width: '100%',
    maxWidth: '300px',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  movieInfo: {
    textAlign: 'center',
    width: '100%'
  },
  movieTitle: {
    fontSize: '1.4rem',
    margin: '0.5rem 0',
    color: 'white'
  },
  movieYear: {
    color: '#aaa',
    margin: '0 0 1rem 0'
  },
  tagline: {
    fontStyle: 'italic',
    color: '#4bc0c0',
    margin: '0.5rem 0'
  },
  overview: {
    color: '#ccc',
    lineHeight: '1.5',
    margin: '1rem 0'
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
    flexWrap: 'wrap'
  },
  statBox: {
    backgroundColor: 'rgba(75, 192, 192, 0.1)',
    padding: '1rem',
    borderRadius: '6px',
    textAlign: 'center',
    minWidth: '120px'
  },
  statLabel: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#aaa',
    marginBottom: '0.3rem',
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: '1.1rem',
    color: '#4bc0c0',
    fontWeight: 'bold'
  },
  chartContainer: {
    backgroundColor: '#2d2d2d',
    padding: '1.5rem',
    borderRadius: '8px',
    height: '400px'
  },
  vsCircle: {
    width: '60px',
    height: '60px',
    backgroundColor: '#4bc0c0',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    alignSelf: 'center',
    '@media (max-width: 768px)': {
      margin: '1rem 0',
      transform: 'rotate(90deg)'
    }
  }
};

export default ComparePage;
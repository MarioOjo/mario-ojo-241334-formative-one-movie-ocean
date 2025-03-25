import React, { useState, useEffect } from 'react';
import { Bar, Radar } from 'react-chartjs-2';
import axios from 'axios';

const API_URL = "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/search";
const API_HEADERS = {
  "x-apihub-key": "YDoVJUPRVRQPoDRzkuiuccJDV1-6FgluIpO3QSuoFPSdQMW174",
  "x-apihub-host": "Movies-Verse.allthingsdev.co",
  "x-apihub-endpoint": "5122e0f8-a949-45a9-aedf-5eaf61c6085b"
};

const HomePage = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  // Fetch default movie on page load
  useEffect(() => {
    const fetchDefaultMovie = async () => {
      try {
        const response = await axios.get(`${API_URL}?query=The Monkey`, { headers: API_HEADERS });
        setMovie(response.data.results[0]); // Set the first result as the default movie
      } catch (error) {
        console.error("Error fetching default movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultMovie();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?query=${query}`, { headers: API_HEADERS });
      setMovie(response.data.results[0]); // Set the first result as the searched movie
    } catch (error) {
      console.error("Error searching for movie:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for the charts
  const barChartData = movie
    ? {
        labels: ['Weekend Gross', 'Total Gross'],
        datasets: [
          {
            label: movie.title,
            data: [movie.weekendGross / 1000000, movie.totalGross / 1000000],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const radarChartData = movie
    ? {
        labels: ['IMDb Rating', 'Popularity', 'Vote Count'],
        datasets: [
          {
            label: movie.title,
            data: [movie.imdbRating || 0, movie.popularity || 0, movie.voteCount || 0],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Inline styles
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    hero: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    heroTitle: {
      fontSize: '2.5rem',
      marginBottom: '10px',
    },
    heroDescription: {
      fontSize: '1.2rem',
      marginBottom: '20px',
    },
    ctaButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
    },
    btn: {
      padding: '10px 20px',
      borderRadius: '5px',
      textDecoration: 'none',
      color: 'white',
      fontWeight: 'bold',
    },
    btnPrimary: {
      backgroundColor: '#4bc0c0',
    },
    searchBar: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    input: {
      padding: '10px',
      width: '300px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 20px',
      marginLeft: '10px',
      borderRadius: '5px',
      backgroundColor: '#4bc0c0',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    movieDetails: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    chartContainer: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.2rem',
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Discover & Compare Movies</h1>
        <p style={styles.heroDescription}>Explore box office hits, ratings, and detailed comparisons</p>
        <div style={styles.ctaButtons}>
          <a href="/compare" style={{ ...styles.btn, ...styles.btnPrimary }}>Compare Movies</a>
        </div>
      </section>

      {/* Search Bar */}
      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : movie ? (
        <div style={styles.grid}>
          {/* Movie Details */}
          <div style={styles.movieDetails}>
            <h2>{movie.title}</h2>
            <p>{movie.overview}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Runtime:</strong> {movie.runtime} mins</p>
            <p><strong>Budget:</strong> ${(movie.budget / 1000000).toFixed(1)}M</p>
          </div>

          {/* Charts */}
          <div style={styles.chartContainer}>
            <h3>Box Office Gross</h3>
            {barChartData && (
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Gross ($M)',
                      },
                    },
                  },
                }}
              />
            )}
          </div>
          <div style={styles.chartContainer}>
            <h3>Movie Metrics</h3>
            {radarChartData && (
              <Radar
                data={radarChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      angleLines: { display: true },
                      suggestedMin: 0,
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div style={styles.loading}>No movie found</div>
      )}
    </div>
  );
};

export default HomePage;
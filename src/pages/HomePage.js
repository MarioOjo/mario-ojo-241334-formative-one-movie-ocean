import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Radar } from 'react-chartjs-2';
import axios from 'axios';

const API_URL = "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/top-box-office";
const API_HEADERS = {
  "x-apihub-key": "YDoVJUPRVRQPoDRzkuiuccJDV1-6FgluIpO3QSuoFPSdQMW174",
  "x-apihub-host": "Movies-Verse.allthingsdev.co",
  "x-apihub-endpoint": "5122e0f8-a949-45a9-aedf-5eaf61c6085b"
};

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(API_URL, { headers: API_HEADERS });
        setMovies(response.data.movies.slice(0, 6)); // Fetch top 6 movies
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Prepare data for the charts
  const barChartData = {
    labels: movies.map((movie) => movie.title),
    datasets: [
      {
        label: 'Weekend Gross ($M)',
        data: movies.map((movie) => movie.weekendGross / 1000000),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Gross ($M)',
        data: movies.map((movie) => movie.totalGross / 1000000),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const radarChartData = {
    labels: ['IMDb Rating', 'Popularity', 'Vote Count'],
    datasets: movies.map((movie, index) => ({
      label: movie.title,
      data: [
        movie.imdbRating || 0,
        movie.popularity || 0,
        movie.voteCount || 0,
      ],
      backgroundColor: `rgba(${index * 50}, ${100 + index * 30}, 192, 0.2)`,
      borderColor: `rgba(${index * 50}, ${100 + index * 30}, 192, 1)`,
      borderWidth: 1,
    })),
  };

  // Inline styles
  const styles = {
    homePage: {
      padding: '20px',
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
    btnSecondary: {
      backgroundColor: '#ff6384',
    },
    dashboard: {
      marginTop: '40px',
    },
    chartContainer: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.2rem',
    },
  };

  return (
    <div style={styles.homePage}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Discover & Compare Movies</h1>
        <p style={styles.heroDescription}>Explore box office hits, ratings, and detailed comparisons</p>
        <div style={styles.ctaButtons}>
          <Link to="/compare" style={{ ...styles.btn, ...styles.btnPrimary }}>Compare Movies</Link>
        </div>
      </section>

      {/* Dashboard Section */}
      <section style={styles.dashboard}>
        <h2 style={styles.heroTitle}>Movie Insights</h2>
        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <>
            <div style={styles.chartContainer}>
              <h3>Box Office Gross</h3>
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
            </div>
            <div style={styles.chartContainer}>
              <h3>Movie Metrics</h3>
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
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Bar, Radar } from 'react-chartjs-2';
import axios from 'axios';

const API_URL = "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/search";
const API_HEADERS = {
  "x-apihub-key": "YDoVJUPRVRQPoDRzkuiuccJDV1-6FgluIpO3QSuoFPSdQMW174",
  "x-apihub-host": "Movies-Verse.allthingsdev.co",
  "x-apihub-endpoint": "5122e0f8-a949-45a9-aedf-5eaf61c6085b"
};

function ComparisonCharts({ movie1Query, movie2Query }) {
  const [movie1, setMovie1] = useState(null);
  const [movie2, setMovie2] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch movie data for both movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(`${API_URL}?query=${movie1Query}`, { headers: API_HEADERS }),
          axios.get(`${API_URL}?query=${movie2Query}`, { headers: API_HEADERS }),
        ]);

        setMovie1(response1.data.results[0] || null); // Set the first result for movie1
        setMovie2(response2.data.results[0] || null); // Set the first result for movie2
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [movie1Query, movie2Query]);

  // Prepare comparison data for the charts
  const comparisonData = {
    ratings: {
      labels: ['IMDb', 'Rotten Tomatoes', 'Metacritic'],
      datasets: [
        {
          label: movie1?.title || 'Movie 1',
          data: [
            movie1?.vote_average ? movie1.vote_average * 10 : 0, // IMDb rating
            Math.random() * 30 + 70, // Placeholder for Rotten Tomatoes
            Math.random() * 30 + 50, // Placeholder for Metacritic
          ],
          backgroundColor: 'rgba(65, 146, 254, 0.7)',
          borderColor: 'rgba(65, 146, 254, 1)',
          borderWidth: 1,
        },
        {
          label: movie2?.title || 'Movie 2',
          data: [
            movie2?.vote_average ? movie2.vote_average * 10 : 0, // IMDb rating
            Math.random() * 30 + 70, // Placeholder for Rotten Tomatoes
            Math.random() * 30 + 50, // Placeholder for Metacritic
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    },
    metrics: {
      labels: ['Popularity', 'Vote Count', 'Revenue ($M)'],
      datasets: [
        {
          label: movie1?.title || 'Movie 1',
          data: [
            movie1?.popularity || 0,
            movie1?.vote_count || 0,
            movie1?.revenue ? movie1.revenue / 1000000 : 0,
          ],
          backgroundColor: 'rgba(65, 146, 254, 0.7)',
          borderColor: 'rgba(65, 146, 254, 1)',
          borderWidth: 1,
        },
        {
          label: movie2?.title || 'Movie 2',
          data: [
            movie2?.popularity || 0,
            movie2?.vote_count || 0,
            movie2?.revenue ? movie2.revenue / 1000000 : 0,
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    },
  };

  // Inline styles
  const styles = {
    comparisonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      margin: '20px',
    },
    movieTitles: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    movieTitle: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#333',
    },
    chartsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    chartContainer: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!movie1 || !movie2) {
    return <p>One or both movies could not be found.</p>;
  }

  return (
    <Container style={styles.comparisonContainer}>
      <Row style={styles.movieTitles}>
        <Col md={6}>
          <h2 style={styles.movieTitle}>{movie1.title}</h2>
        </Col>
        <Col md={6}>
          <h2 style={styles.movieTitle}>{movie2.title}</h2>
        </Col>
      </Row>

      <Row style={styles.chartsRow}>
        <Col md={6}>
          <div style={styles.chartContainer}>
            <h3>Ratings Comparison</h3>
            <Bar
              data={comparisonData.ratings}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, max: 100 },
                },
              }}
            />
          </div>
        </Col>
        <Col md={6}>
          <div style={styles.chartContainer}>
            <h3>Key Metrics</h3>
            <Radar
              data={comparisonData.metrics}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: { beginAtZero: true },
                },
              }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ComparisonCharts;
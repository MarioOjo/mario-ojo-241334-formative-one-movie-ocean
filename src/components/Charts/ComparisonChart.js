import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Bar, Radar } from 'react-chartjs-2';

function ComparisonCharts({ movie1, movie2 }) {
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

  const comparisonData = {
    ratings: {
      labels: ['IMDb', 'Rotten Tomatoes', 'Metacritic'],
      datasets: [
        {
          label: movie1.title,
          data: [
            movie1.vote_average * 10,
            Math.random() * 30 + 70,
            Math.random() * 30 + 50,
          ],
          backgroundColor: 'rgba(65, 146, 254, 0.7)',
          borderColor: 'rgba(65, 146, 254, 1)',
          borderWidth: 1,
        },
        {
          label: movie2.title,
          data: [
            movie2.vote_average * 10,
            Math.random() * 30 + 70,
            Math.random() * 30 + 50,
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
          label: movie1.title,
          data: [
            movie1.popularity || 0,
            movie1.vote_count || 0,
            movie1.revenue ? movie1.revenue / 1000000 : 0,
          ],
          backgroundColor: 'rgba(65, 146, 254, 0.7)',
          borderColor: 'rgba(65, 146, 254, 1)',
          borderWidth: 1,
        },
        {
          label: movie2.title,
          data: [
            movie2.popularity || 0,
            movie2.vote_count || 0,
            movie2.revenue ? movie2.revenue / 1000000 : 0,
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    },
  };

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
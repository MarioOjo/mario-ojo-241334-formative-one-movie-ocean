import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import BarChart from '../BarChart'; // Keep only the necessary imports
import './Compare.css';

const Compare = () => {
  const [data, setData] = useState(null);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    axios
      .get('https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/top-box-office')
      .then((response) => {
        console.log('API Response:', response.data);
        setData(response.data.movies); // Store the list of movies
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleMovieSelection = (event) => {
    const selected = event.target.value;
    setSelectedMovies(selected);

    // Prepare comparison data
    const comparison = {
      labels: selected.map((movie) => movie.title),
      datasets: [
        {
          label: 'Weekend Gross',
          data: selected.map((movie) => movie.weekendGross),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Total Gross',
          data: selected.map((movie) => movie.totalGross),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };

    setComparisonData(comparison);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Compare Movies
      </Typography>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Select Movies</InputLabel>
        <Select
          multiple
          value={selectedMovies}
          onChange={handleMovieSelection}
          renderValue={(selected) => selected.map((movie) => movie.title).join(', ')}
        >
          {data.map((movie) => (
            <MenuItem key={movie.id} value={movie}>
              {movie.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {comparisonData && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 400,
                backgroundColor: 'rgba(70, 68, 68, 0.8)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Movie Comparison
              </Typography>
              <BarChart data={comparisonData} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Compare;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';
import SearchBar from './SearchBar'; // Import the SearchBar component
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    axios
      .get('https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/top-box-office')
      .then((response) => {
        console.log('API Response:', response.data);
        setData(response.data);
        setFilteredData(response.data); // Initialize filtered data
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSearch = (query) => {
    if (!data) return;

    const filtered = {
      ...data,
      movies: data.movies.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      ),
    };

    setFilteredData(filtered);
  };

  if (!filteredData) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <SearchBar onSearch={handleSearch} /> {/* Add the SearchBar */}
      <Grid container spacing={3}>
        {/* Main Description Box */}
        <Grid item xs={12}>
          <Paper
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              height: 200,
              backgroundColor: 'rgba(70, 68, 68, 0.8)',
              color: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Box
              component="img"
              sx={{
                height: 150,
                width: 100,
                borderRadius: 2,
                mr: 2,
              }}
              alt="Movie Poster"
              src={filteredData.moviePosterUrl}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                {filteredData.movieTitle}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {filteredData.movieDescription}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {/* Charts */}
        <Grid item xs={12} md={6}>
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
              Movie Box Office Performance
            </Typography>
            <BarChart data={filteredData.barChartData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
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
              IMDb Rating and Number of Ratings
            </Typography>
            <DoughnutChart data={filteredData.doughnutChartData} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
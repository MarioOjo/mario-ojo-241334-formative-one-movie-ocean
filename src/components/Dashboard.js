import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
              backgroundColor: 'rgba(70, 68, 68, 0.8)', // Dark background with transparency
              color: 'white', // Set text color to white
              borderRadius: 2, // Add rounded corners
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add subtle shadow
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
              src="https://m.media-amazon.com/images/M/MV5BNzZhMTc5MWUtOTE2MS00MjUwLTljYWEtYTk1ZmVjNzhmMzYzXkEyXkFqcGc@.300_.jpg" // Replace with actual movie poster URL
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                The Monkey
              </Typography>
              <Typography variant="body1" gutterBottom>
                Two brothers find a cursed cymbal-clapping monkey toy, triggering deadly events. They must uncover its dark origins to break the curse.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#4bc0c0', mr: 1 }} />
                  <Typography variant="body2">Weekend Gross: 14M</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#ff6384', mr: 1 }} />
                  <Typography variant="body2">Total Gross: 16M</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        {/* Bar Chart and Doughnut Chart Side by Side */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 400,
              backgroundColor: 'rgba(70, 68, 68, 0.8)', // Dark background with transparency
              color: 'white', // Set text color to white
              borderRadius: 2, // Add rounded corners
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add subtle shadow
            }}
          >
            <Typography variant="h6" gutterBottom>
              Movie Box Office Performance
            </Typography>
            <BarChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 400,
              backgroundColor: 'rgba(70, 68, 68, 0.8)', // Dark background with transparency
              color: 'white', // Set text color to white
              borderRadius: 2, // Add rounded corners
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add subtle shadow
            }}
          >
            <Typography variant="h6" gutterBottom>
              IMDb Rating and Number of Ratings
            </Typography>
            <DoughnutChart />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
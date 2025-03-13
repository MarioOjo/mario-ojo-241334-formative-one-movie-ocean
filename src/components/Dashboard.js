import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import BarChart from './BarChart';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Main Description Box */}
        <Grid item xs={12}>
          <Paper className="main-description-box">
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
        {/* Bar Chart */}
        <Grid item xs={12}>
          <Paper className="chart-box">
            <Typography variant="h6" gutterBottom>
              Movie Box Office Performance
            </Typography>
            <BarChart />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
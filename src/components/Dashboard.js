import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import BarChart from './BarChart';
import BubbleChart from './BubbleChart';

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 400,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Bar Chart Example
            </Typography>
            <BarChart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Deposits
            </Typography>
            <BubbleChart style={{ height: '200px', width: '100%' }} />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            {/* Add content here */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const data = {
    labels: ['IMDb Rating', 'Number of Ratings'],
    datasets: [
      {
        label: 'The Monkey',
        data: [6, 72000], // Updated data: 6 IMDb rating, 72,000 ratings
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'black', // Set legend text color to black
        },
      },
      title: {
        display: true,
        text: 'IMDb Rating and Number of Ratings',
        color: 'black', // Set title text color to black
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Set tooltip background color to dark with transparency
        titleColor: 'white', // Set tooltip title color to white
        bodyColor: 'white', // Set tooltip body color to white
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
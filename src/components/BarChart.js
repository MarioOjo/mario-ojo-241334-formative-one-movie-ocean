import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const data = {
    labels: ['Total Gross Box Office', 'Weeks Released'],
    datasets: [
      {
        label: 'Movie Title',
        data: [19, 4], // 19 million total gross, 4 weeks released
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // This will make the bar chart horizontal
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white', // Set legend text color to white
        },
      },
      title: {
        display: true,
        text: 'Movie Box Office Performance',
        color: 'white', // Set title text color to white
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: 'white', // Set x-axis ticks color to white
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', // Set x-axis grid color to white with transparency
        },
      },
      y: {
        ticks: {
          color: 'white', // Set y-axis ticks color to white
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', // Set y-axis grid color to white with transparency
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
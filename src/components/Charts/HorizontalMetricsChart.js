import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HorizontalMetricsChart = ({ data, options, title = "Movie Metrics" }) => {
  const enhancedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // This makes it horizontal
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        display: false // Hide legend for cleaner look
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#4bc0c0',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed.x;
            
            switch(label) {
              case 'Rating (x10)':
                return `Rating: ${(value/10).toFixed(1)}/10`;
              case 'Runtime (/10)':
                return `Runtime: ${(value*10)} minutes`;
              case 'Vote Count (/1000)':
                return `Votes: ${(value*1000).toLocaleString()}`;
              case 'Popularity':
                return `Popularity: ${value.toFixed(1)}`;
              default:
                return `${label}: ${value}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            weight: 'bold',
            size: 12
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 8,
        borderSkipped: false,
      }
    },
    ...options
  };

  if (!data) {
    return (
      <div className="chart-wrapper">
        <div className="chart-title">{title}</div>
        <div style={{ 
          height: '300px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#666'
        }}>
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <div className="chart-title">{title}</div>
      <Bar data={data} options={enhancedOptions} />
    </div>
  );
};

export default HorizontalMetricsChart;
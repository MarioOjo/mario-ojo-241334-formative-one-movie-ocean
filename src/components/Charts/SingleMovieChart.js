import React from 'react';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';


// Register ChartJS components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const ComparisonChart = ({ movie1, movie2 }) => {
  // Data for Bar Chart (Financial Comparison)
  const barData = {
    labels: ['Budget ($M)', 'Revenue ($M)', 'Profit ($M)'],
    datasets: [
      {
        label: movie1.title,
        data: [
          movie1.budget / 1000000,
          movie1.revenue / 1000000,
          (movie1.revenue - movie1.budget) / 1000000
        ],
        backgroundColor: 'rgba(65, 146, 254, 0.7)',
        borderColor: 'rgba(65, 146, 254, 1)',
        borderWidth: 1
      },
      {
        label: movie2.title,
        data: [
          movie2.budget / 1000000,
          movie2.revenue / 1000000,
          (movie2.revenue - movie2.budget) / 1000000
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  // Data for Radar Chart (Feature Comparison)
  const radarData = {
    labels: ['Rating', 'Popularity', 'Runtime', 'Vote Count', 'Profit Margin'],
    datasets: [
      {
        label: movie1.title,
        data: [
          movie1.vote_average,
          movie1.popularity,
          movie1.runtime,
          movie1.vote_count / 1000,
          ((movie1.revenue - movie1.budget) / movie1.budget) * 100
        ],
        backgroundColor: 'rgba(65, 146, 254, 0.2)',
        borderColor: 'rgba(65, 146, 254, 1)',
        borderWidth: 2
      },
      {
        label: movie2.title,
        data: [
          movie2.vote_average,
          movie2.popularity,
          movie2.runtime,
          movie2.vote_count / 1000,
          ((movie2.revenue - movie2.budget) / movie2.budget) * 100
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="comparison-container">
      <div className="chart-section">
        <h3>Financial Comparison</h3>
        <div className="chart-wrapper">
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Millions (USD)'
                  }
                }
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return `${context.dataset.label}: $${context.raw.toFixed(1)}M`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="chart-section">
        <h3>Feature Comparison</h3>
        <div className="chart-wrapper">
          <Radar
            data={radarData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  angleLines: {
                    display: true
                  },
                  suggestedMin: 0
                }
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.dataset.label || '';
                      let value = context.raw;
                      if (context.label === 'Vote Count') value = `${value}k votes`;
                      else if (context.label === 'Profit Margin') value = `${value.toFixed(1)}%`;
                      else if (context.label === 'Runtime') value = `${value} mins`;
                      return `${label}: ${value}`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;
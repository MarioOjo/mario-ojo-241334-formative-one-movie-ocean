import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const PolarChart = ({ data, options, title = "Movie Metrics" }) => {
  const enhancedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
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
            const value = context.parsed.r;
            
            switch(label) {
              case 'Rating':
                return `${label}: ${value}/10`;
              case 'Runtime':
                return `${label}: ${value} minutes`;
              case 'Vote Count':
                return `${label}: ${value.toLocaleString()} votes`;
              case 'Popularity':
                return `${label}: ${value.toFixed(1)}`;
              default:
                return `${label}: ${value}`;
            }
          }
        }
      }
    },
    scales: {
      r: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          color: '#333',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        ticks: {
          display: false,
        },
        suggestedMin: 0,
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
      <PolarArea data={data} options={enhancedOptions} />
    </div>
  );
};

export default PolarChart;
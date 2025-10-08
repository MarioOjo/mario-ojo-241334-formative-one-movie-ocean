import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const EnhancedRadarChart = ({ data, options, title = "Performance Metrics" }) => {
  const enhancedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'top',
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
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#4bc0c0',
        borderWidth: 2,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed.r;
            
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
      r: {
        angleLines: {
          display: true,
          color: 'rgba(75, 192, 192, 0.2)',
          lineWidth: 2
        },
        grid: {
          color: 'rgba(75, 192, 192, 0.3)',
          lineWidth: 1,
        },
        pointLabels: {
          color: '#333',
          font: {
            size: 13,
            weight: 'bold'
          }
        },
        ticks: {
          display: true,
          color: 'rgba(75, 192, 192, 0.6)',
          font: {
            size: 10
          },
          backdropColor: 'rgba(255, 255, 255, 0.8)',
          backdropPadding: 2,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      }
    },
    elements: {
      point: {
        radius: 8,
        hoverRadius: 12,
        backgroundColor: '#4bc0c0',
        borderColor: '#fff',
        borderWidth: 3,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowBlur: 5,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      },
      line: {
        borderWidth: 4,
        tension: 0.2,
        borderCapStyle: 'round',
        borderJoinStyle: 'round'
      }
    },
    interaction: {
      intersect: false,
      mode: 'point'
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
      <Radar data={data} options={enhancedOptions} />
    </div>
  );
};

export default EnhancedRadarChart;
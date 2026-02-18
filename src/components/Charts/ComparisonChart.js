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
import './ComparisonChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ComparisonChart = ({ movie1, movie2, metricData1, metricData2, categoryTitle }) => {
  if (!movie1 || !movie2 || !metricData1 || !metricData2) {
    return (
      <div className="comparison-chart-empty">
        <p>Select two movies to compare</p>
      </div>
    );
  }

  // Create side-by-side comparison data
  const chartData = {
    labels: metricData1.labels,
    datasets: [
      {
        label: movie1.title,
        data: metricData1.data,
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 40,
      },
      {
        label: movie2.title,
        data: metricData2.data,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 40,
      }
    ]
  };

  const options = {
    indexAxis: 'y', // Horizontal bars for better comparison
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            weight: '600'
          },
          color: '#fff',
          boxWidth: 15,
          boxHeight: 15,
        }
      },
      title: {
        display: true,
        text: `${categoryTitle} Comparison`,
        color: '#4bc0c0',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#4bc0c0',
        bodyColor: '#fff',
        borderColor: '#4bc0c0',
        borderWidth: 2,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.x;
            
            // Format based on the metric type
            let formattedValue = value;
            const metricLabel = context.label;
            
            if (metricLabel.includes('Budget') || metricLabel.includes('Revenue') || metricLabel.includes('Profit')) {
              formattedValue = `$${(value / 1000000).toFixed(1)}M`;
            } else if (metricLabel.includes('Rating') || metricLabel.includes('Score')) {
              formattedValue = `${value}/10`;
            } else if (metricLabel.includes('Runtime')) {
              formattedValue = `${value} min`;
            } else if (metricLabel.includes('Count') || metricLabel.includes('Votes')) {
              formattedValue = value.toLocaleString();
            } else {
              formattedValue = value.toFixed(1);
            }
            
            return `${label}: ${formattedValue}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: { 
          color: '#ccc',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: { 
          display: false
        },
        ticks: { 
          color: '#fff',
          font: {
            size: 12,
            weight: '600'
          },
          padding: 10
        }
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    }
  };

  // Calculate winners for each metric
  const calculateWinners = () => {
    const winners = metricData1.data.map((value1, index) => {
      const value2 = metricData2.data[index];
      if (value1 > value2) return { winner: 0, diff: value1 - value2 };
      if (value2 > value1) return { winner: 1, diff: value2 - value1 };
      return { winner: null, diff: 0 };
    });
    return winners;
  };

  const winners = calculateWinners();
  const movie1Wins = winners.filter(w => w.winner === 0).length;
  const movie2Wins = winners.filter(w => w.winner === 1).length;
  const ties = winners.filter(w => w.winner === null).length;

  return (
    <div className="comparison-chart-container">
      {/* Score Summary */}
      <div className="comparison-score-summary">
        <div className={`movie-score ${movie1Wins > movie2Wins ? 'winning' : ''}`}>
          <span className="movie-name">{movie1.title}</span>
          <span className="score">{movie1Wins}</span>
          <span className="label">wins</span>
        </div>
        
        <div className="vs-divider">
          <span>VS</span>
          {ties > 0 && <span className="ties">{ties} ties</span>}
        </div>
        
        <div className={`movie-score ${movie2Wins > movie1Wins ? 'winning' : ''}`}>
          <span className="movie-name">{movie2.title}</span>
          <span className="score">{movie2Wins}</span>
          <span className="label">wins</span>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-canvas">
        <Bar data={chartData} options={options} />
      </div>

      {/* Metric-by-Metric Breakdown */}
      <div className="metric-breakdown">
        <h4>📊 Metric Breakdown</h4>
        <div className="breakdown-grid">
          {metricData1.labels.map((label, index) => {
            const value1 = metricData1.data[index];
            const value2 = metricData2.data[index];
            const winner = winners[index];
            
            return (
              <div key={index} className="breakdown-item">
                <div className="breakdown-header">
                  <span className="metric-name">{label}</span>
                  {winner.winner !== null && (
                    <span className="winner-indicator">
                      {winner.winner === 0 ? '👑' : '🏆'}
                    </span>
                  )}
                </div>
                
                <div className="breakdown-comparison">
                  <div className={`breakdown-value ${winner.winner === 0 ? 'winning' : ''}`}>
                    <span className="movie-initial">{movie1.title[0]}</span>
                    <span className="value">{value1.toFixed(1)}</span>
                  </div>
                  
                  <div className="comparison-bar">
                    <div 
                      className="bar-fill movie1"
                      style={{ width: `${(value1 / (value1 + value2)) * 100}%` }}
                    ></div>
                    <div 
                      className="bar-fill movie2"
                      style={{ width: `${(value2 / (value1 + value2)) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className={`breakdown-value ${winner.winner === 1 ? 'winning' : ''}`}>
                    <span className="value">{value2.toFixed(1)}</span>
                    <span className="movie-initial">{movie2.title[0]}</span>
                  </div>
                </div>
                
                {winner.winner !== null && (
                  <div className="difference">
                    Difference: {winner.diff.toFixed(1)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;

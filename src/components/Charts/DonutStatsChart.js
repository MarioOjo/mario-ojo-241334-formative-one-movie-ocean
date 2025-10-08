import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './DonutStatsChart.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const DonutStatsChart = ({ data, options, title = "Movie Metrics" }) => {
  if (!data || !data.datasets || data.datasets.length === 0) {
    return (
      <div className="chart-wrapper">
        <div className="chart-no-data">
          <h3>📊 {title}</h3>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const dataset = data.datasets[0];
  const totalValue = dataset.data?.reduce((sum, val) => sum + val, 0) || 0;
  const maxValue = Math.max(...(dataset.data || [0]));
  const maxLabel = data.labels?.[dataset.data?.indexOf(maxValue)] || 'N/A';

  const enhancedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%', // Creates the donut hole
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
            weight: '600'
          },
          color: '#fff',
          generateLabels: function(chart) {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
            const labels = original.call(this, chart);
            
            labels.forEach((label, index) => {
              const value = dataset.data[index];
              const percentage = totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : 0;
              label.text = `${label.text}: ${percentage}%`;
            });
            
            return labels;
          }
        }
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
            const label = context.label || '';
            const value = context.parsed;
            const percentage = totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : 0;
            
            // Format based on metric type
            let formattedValue = value;
            if (label.includes('Budget') || label.includes('Revenue') || label.includes('Profit')) {
              formattedValue = `$${(value / 1000000).toFixed(1)}M`;
            } else if (label.includes('Rating')) {
              formattedValue = `${value}/10`;
            } else if (label.includes('Runtime')) {
              formattedValue = `${value} min`;
            } else if (label.includes('Count')) {
              formattedValue = value.toLocaleString();
            } else {
              formattedValue = value.toFixed(1);
            }
            
            return `${label}: ${formattedValue} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 3,
        borderColor: '#1a1a1a',
        hoverBorderWidth: 5,
        hoverBorderColor: '#fff'
      }
    },
    ...options
  };

  return (
    <div className="donut-chart-container">
      <div className="chart-header">
        <h3 className="chart-title">📊 {title}</h3>
      </div>
      
      <div className="donut-chart-wrapper">
        <div className="chart-canvas-container">
          <Doughnut data={data} options={enhancedOptions} />
          
          {/* Center Statistics */}
          <div className="donut-center-stats">
            <div className="center-stat">
              <span className="stat-value">{dataset.data?.length || 0}</span>
              <span className="stat-label">Metrics</span>
            </div>
            <div className="center-stat">
              <span className="stat-value">{maxValue?.toFixed(1) || '0'}</span>
              <span className="stat-label">Top Score</span>
            </div>
          </div>
        </div>
        
        {/* Side Statistics Panel */}
        <div className="stats-panel">
          <h4>📈 Key Insights</h4>
          
          <div className="insight-item">
            <span className="insight-icon">🏆</span>
            <div className="insight-content">
              <span className="insight-label">Best Metric</span>
              <span className="insight-value">{maxLabel}</span>
            </div>
          </div>
          
          <div className="insight-item">
            <span className="insight-icon">📊</span>
            <div className="insight-content">
              <span className="insight-label">Total Score</span>
              <span className="insight-value">{totalValue.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="insight-item">
            <span className="insight-icon">⭐</span>
            <div className="insight-content">
              <span className="insight-label">Average</span>
              <span className="insight-value">
                {dataset.data?.length > 0 ? (totalValue / dataset.data.length).toFixed(1) : '0'}
              </span>
            </div>
          </div>
          
          {/* Performance Indicator */}
          <div className="performance-indicator">
            <div className="performance-bar">
              <div 
                className="performance-fill"
                style={{ 
                  width: `${Math.min((totalValue / (dataset.data?.length * 100)) * 100, 100)}%` 
                }}
              ></div>
            </div>
            <span className="performance-text">Overall Performance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutStatsChart;
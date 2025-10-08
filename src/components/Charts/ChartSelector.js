import React, { useState } from 'react';
import RadarChart from './RadarChart';
import EnhancedRadarChart from './EnhancedRadarChart';
import PolarChart from './PolarChart';
import HorizontalMetricsChart from './HorizontalMetricsChart';
import './ChartSelector.css';

const ChartSelector = ({ data, title = "Movie Metrics" }) => {
  const [activeChart, setActiveChart] = useState('enhanced-radar');

  const chartTypes = [
    { id: 'enhanced-radar', name: '🕸️ Enhanced Radar', component: EnhancedRadarChart },
    { id: 'polar', name: '🎯 Polar Area', component: PolarChart },
    { id: 'horizontal', name: '📊 Horizontal Bars', component: HorizontalMetricsChart },
    { id: 'original-radar', name: '📡 Original Radar', component: RadarChart }
  ];

  const ActiveChartComponent = chartTypes.find(chart => chart.id === activeChart)?.component || EnhancedRadarChart;

  // Transform data for different chart types
  const getChartData = () => {
    if (!data) return null;

    switch(activeChart) {
      case 'polar':
        return {
          labels: data.labels,
          datasets: [{
            label: data.datasets[0].label,
            data: data.datasets[0].data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 205, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 2,
          }]
        };
      
      case 'horizontal':
        return {
          labels: data.labels,
          datasets: [{
            label: data.datasets[0].label,
            data: data.datasets[0].data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 205, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }]
        };
      
      case 'enhanced-radar':
        return {
          ...data,
          datasets: data.datasets.map(dataset => ({
            ...dataset,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 3,
          }))
        };
      
      default:
        return data;
    }
  };

  return (
    <div className="chart-selector-container">
      <div className="chart-type-selector">
        <h4>Chart Type:</h4>
        <div className="chart-buttons">
          {chartTypes.map(chart => (
            <button
              key={chart.id}
              className={`chart-button ${activeChart === chart.id ? 'active' : ''}`}
              onClick={() => setActiveChart(chart.id)}
            >
              {chart.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="chart-display">
        <ActiveChartComponent 
          data={getChartData()} 
          title={title}
        />
      </div>
    </div>
  );
};

export default ChartSelector;
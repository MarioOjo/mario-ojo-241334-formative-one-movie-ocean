import React, { useState } from 'react';
import DonutStatsChart from './DonutStatsChart';
import PolarChart from './PolarChart';
import HorizontalMetricsChart from './HorizontalMetricsChart';
import { movieMetrics, metricSets, getMetricData } from '../../utils/movieMetrics';
import './AdvancedChartSelector.css';

const AdvancedChartSelector = ({ movie }) => {
  const [activeMetricSet, setActiveMetricSet] = useState('audience');
  const [activeChartType, setActiveChartType] = useState('polar');

  const chartTypes = [
    { id: 'polar', name: '🎯 Polar', component: PolarChart },
    { id: 'donut', name: '🍩 Donut Stats', component: DonutStatsChart },
    { id: 'horizontal', name: '📊 Bars', component: HorizontalMetricsChart }
  ];

  const metricOptions = Object.keys(metricSets).map(key => ({
    id: key,
    name: metricSets[key].title,
    icon: {
      financial: '💰',
      audience: '👥', 
      production: '🎬',
      analytics: '📈'
    }[key] || '📊'
  }));

  const ActiveChartComponent = chartTypes.find(chart => chart.id === activeChartType)?.component || PolarChart;

  const getChartData = () => {
    if (!movie) return null;

    const metricData = getMetricData(movie, activeMetricSet);
    if (!metricData) return null;

    const colors = {
      financial: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
      audience: ['#ffeaa7', '#fd79a8', '#fdcb6e', '#e17055'],
      production: ['#74b9ff', '#0984e3', '#6c5ce7', '#a29bfe'],
      analytics: ['#e84393', '#fd79a8', '#fdcb6e', '#6c5ce7']
    };

    const colorSet = colors[activeMetricSet] || colors.audience;

    switch(activeChartType) {
      case 'polar':
        return {
          labels: metricData.labels,
          datasets: [{
            label: movie.title,
            data: metricData.data,
            backgroundColor: colorSet.map(color => color + '80'),
            borderColor: colorSet,
            borderWidth: 2,
          }]
        };
      
      case 'horizontal':
        return {
          labels: metricData.labels,
          datasets: [{
            label: movie.title,
            data: metricData.data,
            backgroundColor: colorSet.map(color => color + 'CC'),
            borderColor: colorSet,
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }]
        };
      
      default: // radar
        return {
          labels: metricData.labels,
          datasets: [{
            label: movie.title,
            data: metricData.data,
            backgroundColor: colorSet[0] + '40',
            borderColor: colorSet[0],
            pointBackgroundColor: colorSet[0],
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: colorSet[0],
            borderWidth: 3,
          }]
        };
    }
  };

  const getInsights = () => {
    if (!movie) return [];

    const insights = [];

    // Financial insights
    const roi = movieMetrics.financial.roi(movie);
    const profit = movieMetrics.financial.profit(movie);
    
    if (roi > 300) {
      insights.push({ type: 'success', text: `Outstanding ROI of ${roi.toFixed(0)}%!` });
    } else if (roi < 0) {
      insights.push({ type: 'warning', text: `Loss of $${Math.abs(profit/1000000).toFixed(1)}M` });
    }

    // Audience insights
    const rating = movie.vote_average || 0;
    const votes = movie.vote_count || 0;
    
    if (rating > 8.0 && votes > 10000) {
      insights.push({ type: 'success', text: 'Critically acclaimed blockbuster!' });
    } else if (rating < 5.0) {
      insights.push({ type: 'warning', text: 'Poor audience reception' });
    }

    // Diversity insights
    const genderBalance = movieMetrics.people.genderDiversity(movie);
    if (genderBalance > 80) {
      insights.push({ type: 'info', text: 'Excellent gender diversity in cast' });
    }

    // Success insights
    const successIndex = movieMetrics.analytics.successIndex(movie);
    if (successIndex > 100) {
      insights.push({ type: 'success', text: `High success index: ${successIndex.toFixed(0)}` });
    }

    return insights.slice(0, 3); // Show max 3 insights
  };

  const insights = getInsights();

  return (
    <div className="advanced-chart-selector">
      {/* Metric Set Selector */}
      <div className="metric-selector">
        <h4>📊 Metric Categories</h4>
        <div className="metric-buttons">
          {metricOptions.map(option => (
            <button
              key={option.id}
              className={`metric-button ${activeMetricSet === option.id ? 'active' : ''}`}
              onClick={() => setActiveMetricSet(option.id)}
              title={option.name}
            >
              {option.icon} {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="chart-type-selector">
        <h4>📈 Visualization</h4>
        <div className="chart-type-buttons">
          {chartTypes.map(chart => (
            <button
              key={chart.id}
              className={`chart-type-button ${activeChartType === chart.id ? 'active' : ''}`}
              onClick={() => setActiveChartType(chart.id)}
            >
              {chart.name}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Panel */}
      {insights.length > 0 && (
        <div className="insights-panel">
          <h4>💡 Key Insights</h4>
          <div className="insights-list">
            {insights.map((insight, index) => (
              <div key={index} className={`insight ${insight.type}`}>
                {insight.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart Display */}
      <div className="chart-display">
        <ActiveChartComponent 
          data={getChartData()} 
          title={metricSets[activeMetricSet]?.title || 'Movie Metrics'}
        />
      </div>

      {/* Metric Values Display */}
      {movie && (
        <div className="metric-values">
          <h4>📋 Detailed Values</h4>
          <div className="values-grid">
            {metricSets[activeMetricSet]?.metrics.map((metric, index) => {
              const category = Object.keys(movieMetrics).find(cat => movieMetrics[cat][metric.key]);
              const value = movieMetrics[category]?.[metric.key]?.(movie) || 0;
              return (
                <div key={index} className="value-item">
                  <span className="value-label">{metric.label}:</span>
                  <span className="value-number">{metric.formatter(value)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedChartSelector;
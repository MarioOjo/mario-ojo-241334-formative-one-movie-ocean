import React from 'react';
import { Line } from 'react-chartjs-2';

const PopularityTimeline = ({ popularityHistory }) => {
  if (!popularityHistory || popularityHistory.length === 0) return null;

  // popularityHistory: [{ date: 'YYYY-MM-DD', popularity: number }]
  const labels = popularityHistory.map(p => p.date);
  const dataPoints = popularityHistory.map(p => p.popularity);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Popularity',
        data: dataPoints,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointRadius: 4,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        fill: true,
        tension: 0.2,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Popularity Timeline' }
    },
    scales: {
      x: {
        title: { display: true, text: 'Date' },
        ticks: { autoSkip: true, maxTicksLimit: 10 }
      },
      y: {
        title: { display: true, text: 'Popularity' },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} height={180} />
    </div>
  );
};

export default PopularityTimeline;

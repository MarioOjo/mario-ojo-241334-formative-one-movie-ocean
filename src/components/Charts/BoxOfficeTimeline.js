import React from 'react';
import { Line } from 'react-chartjs-2';

const BoxOfficeTimeline = ({ boxOfficeHistory }) => {
  if (!boxOfficeHistory || boxOfficeHistory.length === 0) {
    return <div className="no-results" style={{textAlign:'center',margin:'1.5rem 0',color:'#4bc0c0',fontWeight:600}}>No box office timeline data available for this movie.</div>;
  }

  const labels = boxOfficeHistory.map(b => `Week ${b.week}`);
  const dataPoints = boxOfficeHistory.map(b => b.gross);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Weekly Gross ($)',
        data: dataPoints,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointRadius: 4,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        fill: true,
        tension: 0.2,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Box Office Timeline' }
    },
    scales: {
      x: {
        title: { display: true, text: 'Week' },
        ticks: { autoSkip: true, maxTicksLimit: 10 }
      },
      y: {
        title: { display: true, text: 'Gross ($)' },
        beginAtZero: true,
        ticks: {
          callback: value => `$${value.toLocaleString()}`
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} height={180} />
    </div>
  );
};

export default BoxOfficeTimeline;

import React from 'react';
import { Line } from 'react-chartjs-2';

// Example milestones: [{ label: 'Filming Start', date: 'YYYY-MM-DD' }, ...]
function getProductionMilestones(movie) {
  // Try to extract from movie.credits or movie.production_dates if available
  // For demo, use static sample data
  return [
    { label: 'Filming Start', date: movie.filming_start || '2022-01-10' },
    { label: 'Filming End', date: movie.filming_end || '2022-03-15' },
    { label: 'Trailer Release', date: movie.trailer_release || '2022-04-01' },
    { label: 'Premiere', date: movie.premiere || movie.release_date || '2022-05-10' }
  ];
}

const ProductionTimeline = ({ movie }) => {
  if (!movie) return null;
  const milestones = getProductionMilestones(movie);
  const labels = milestones.map(m => m.label);
  const dataPoints = milestones.map(m => new Date(m.date).getTime());

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Production Milestones',
        data: dataPoints,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        pointRadius: 7,
        pointBackgroundColor: 'rgba(255, 206, 86, 1)',
        fill: false,
        showLine: false,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Production Timeline' }
    },
    scales: {
      x: {
        title: { display: true, text: 'Milestone' },
        ticks: { autoSkip: false }
      },
      y: {
        type: 'time',
        time: { unit: 'day' },
        title: { display: true, text: 'Date' },
        ticks: {
          callback: value => new Date(value).toLocaleDateString()
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

export default ProductionTimeline;

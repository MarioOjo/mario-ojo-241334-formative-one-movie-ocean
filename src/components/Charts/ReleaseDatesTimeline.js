import React from 'react';
import { Line } from 'react-chartjs-2';

function groupReleaseDates(allDates, groupType) {
  if (groupType === 'year') {
    // Group by year
    const grouped = {};
    allDates.forEach(d => {
      const year = new Date(d.date).getFullYear();
      grouped[year] = (grouped[year] || 0) + 1;
    });
    return {
      labels: Object.keys(grouped),
      data: Object.values(grouped)
    };
  }
  if (groupType === 'month') {
    // Group by month (YYYY-MM)
    const grouped = {};
    allDates.forEach(d => {
      const dt = new Date(d.date);
      const key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return {
      labels: Object.keys(grouped),
      data: Object.values(grouped)
    };
  }
  if (groupType === 'country') {
    // Group by country
    const grouped = {};
    allDates.forEach(d => {
      grouped[d.country] = (grouped[d.country] || 0) + 1;
    });
    return {
      labels: Object.keys(grouped),
      data: Object.values(grouped)
    };
  }
  if (groupType === 'type') {
    // Group by type
    const grouped = {};
    allDates.forEach(d => {
      grouped[d.type] = (grouped[d.type] || 0) + 1;
    });
    return {
      labels: Object.keys(grouped),
      data: Object.values(grouped)
    };
  }
  // Default: show all
  return {
    labels: allDates.map(d => `${d.country} (${d.type})`),
    data: allDates.map(d => new Date(d.date).getTime())
  };
}

const ReleaseDatesTimeline = ({ releaseDates, groupType = 'all' }) => {
  if (!releaseDates || releaseDates.length === 0) return null;

  // Flatten and sort all release dates
  const allDates = releaseDates
    .flatMap(country => country.release_dates.map(rd => ({
      country: country.iso_3166_1,
      type: rd.type,
      date: rd.release_date
    })))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const grouped = groupReleaseDates(allDates, groupType);

  const data = {
    labels: grouped.labels,
    datasets: [
      {
        label: groupType === 'all' ? 'Release Dates' : `Release Dates by ${groupType.charAt(0).toUpperCase()+groupType.slice(1)}`,
        data: groupType === 'all' ? grouped.data : grouped.data,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointRadius: 6,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        fill: false,
        showLine: false,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Release Dates Timeline' }
    },
    scales: {
      x: {
        title: { display: true, text: groupType === 'all' ? 'Country (Type)' : groupType.charAt(0).toUpperCase()+groupType.slice(1) },
        ticks: { autoSkip: false, maxRotation: 45, minRotation: 30 }
      },
      y: groupType === 'all' ? {
        type: 'time',
        time: { unit: 'day' },
        title: { display: true, text: 'Date' },
        ticks: {
          callback: value => new Date(value).toLocaleDateString()
        }
      } : {
        beginAtZero: true,
        title: { display: true, text: 'Count' }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} height={180} />
    </div>
  );
};

export default ReleaseDatesTimeline;

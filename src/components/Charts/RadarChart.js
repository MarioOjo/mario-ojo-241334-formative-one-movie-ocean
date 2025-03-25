import React from 'react';
import { Radar } from 'react-chartjs-2';

const RadarChart = ({ data, title }) => {
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <h3>{title}</h3>
      <Radar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              angleLines: { display: true },
              suggestedMin: 0,
            },
          },
        }}
      />
    </div>
  );
};

export default RadarChart;
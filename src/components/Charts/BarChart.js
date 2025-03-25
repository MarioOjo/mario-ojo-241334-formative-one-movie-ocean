import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data, title }) => {
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <h3>{title}</h3>
      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Value',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
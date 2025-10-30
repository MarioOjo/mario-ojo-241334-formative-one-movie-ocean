import { Line } from 'react-chartjs-2';

const MovieTimeline = ({ movie, boxOfficeData }) => {
  if (!boxOfficeData || !movie) return null;

  const movieData = boxOfficeData.find(m => m.tmdb_id === movie.id);
  if (!movieData?.weekly_performance) return null;

  const data = {
    labels: movieData.weekly_performance.map((_, index) => `Week ${index + 1}`),
    datasets: [{
      label: 'Weekly Gross ($)',
      data: movieData.weekly_performance,
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1,
      fill: true
    }]
  };

  return (
    <div style={{
      background: '#2d2d2d',
      padding: '20px',
      borderRadius: '10px',
      marginTop: '30px'
    }}>
      <h3 style={{ 
        color: '#4bc0c0', 
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        {movie.title} Box Office Performance
      </h3>
      <div style={{ height: '400px' }}>
        <Line 
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: value => `$${value.toLocaleString()}`
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default MovieTimeline;
import { Pie } from 'react-chartjs-2';

const BoxOfficeComparison = ({ movies, boxOfficeData }) => {
  if (!boxOfficeData || !movies[0] || !movies[1]) return null;

  const movie1Data = boxOfficeData.find(m => m.tmdb_id === movies[0].id);
  const movie2Data = boxOfficeData.find(m => m.tmdb_id === movies[1].id);

  if (!movie1Data || !movie2Data) return <p>No box office data available</p>;

  const data = {
    labels: [
      `${movies[0].title} (${movie1Data.weeks_released} weeks)`,
      `${movies[1].title} (${movie2Data.weeks_released} weeks)`
    ],
    datasets: [{
      data: [movie1Data.weekend_gross, movie2Data.weekend_gross],
      backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
      borderWidth: 1
    }]
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h3>Weekend Gross Comparison</h3>
      <Pie data={data} />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        marginTop: '20px'
      }}>
        <div>
          <strong>{movies[0].title}</strong>
          <p>Total Gross: ${movie1Data.total_gross.toLocaleString()}</p>
          <p>Weeks Released: {movie1Data.weeks_released}</p>
        </div>
        <div>
          <strong>{movies[1].title}</strong>
          <p>Total Gross: ${movie2Data.total_gross.toLocaleString()}</p>
          <p>Weeks Released: {movie2Data.weeks_released}</p>
        </div>
      </div>
    </div>
  );
};
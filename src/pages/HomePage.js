import React, { useState, useEffect } from 'react';
import BarChart from '../components/Charts/BarChart';
import RadarChart from '../components/Charts/RadarChart';
import axios from 'axios';

const API_URL = "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/search";
const API_HEADERS = {
  "x-apihub-key": "YDoVJUPRVRQPoDRzkuiuccJDV1-6FgluIpO3QSuoFPSdQMW174",
  "x-apihub-host": "Movies-Verse.allthingsdev.co",
  "x-apihub-endpoint": "5122e0f8-a949-45a9-aedf-5eaf61c6085b"
};

const HomePage = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  // Fetch default movie on page load
  useEffect(() => {
    const fetchDefaultMovie = async () => {
      try {
        const response = await axios.get(`${API_URL}?query=The Monkey`, { headers: API_HEADERS });
        console.log("API Response:", response.data.results[0]); // Debugging
        setMovie(response.data.results[0]); // Set the first result as the default movie
      } catch (error) {
        console.error("Error fetching default movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultMovie();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!query.trim()) {
      console.error("Search query is empty");
      return; // Prevent empty searches
    }
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?query=${query}`, { headers: API_HEADERS });
      if (response.data.results && response.data.results.length > 0) {
        setMovie(response.data.results[0]); // Set the first result as the searched movie
      } else {
        console.warn("No results found for the query:", query);
        setMovie(null); // No results found
      }
    } catch (error) {
      console.error("Error searching for movie:", error);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for the charts
  const barChartData = movie
    ? {
        labels: ['Weekend Gross', 'Total Gross'],
        datasets: [
          {
            label: movie.title || 'N/A',
            data: [
              parseFloat(movie.weekendGross?.replace('$', '').replace('M', '')) || 0,
              parseFloat(movie.totalGross?.replace('$', '').replace('M', '')) || 0,
            ],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const radarChartData = movie
    ? {
        labels: ['IMDb Rating', 'Popularity', 'Vote Count'],
        datasets: [
          {
            label: movie.title || 'N/A',
            data: [movie.imdbRating || 0, movie.popularity || 0, movie.voteCount || 0],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      }
    : null;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Discover & Compare Movies</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Explore box office hits, ratings, and detailed comparisons</p>
      </section>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            borderRadius: '5px',
            backgroundColor: '#4bc0c0',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>Loading...</div>
      ) : movie ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Movie Details */}
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2>{movie.title}</h2>
            <p>{movie.overview}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Runtime:</strong> {movie.runtime} mins</p>
            <p><strong>Budget:</strong> {movie.budget ? `$${(movie.budget / 1000000).toFixed(1)}M` : 'N/A'}</p>
          </div>

          {/* Charts */}
          <div>
            <BarChart data={barChartData} title="Box Office Gross" />
            <RadarChart data={radarChartData} title="Movie Metrics" />
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>No movie found</div>
      )}
    </div>
  );
};

export default HomePage;
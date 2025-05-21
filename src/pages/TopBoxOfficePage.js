import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TopBoxOfficePage.css';

const API_URL = "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/top-box-office";
const API_HEADERS = {
  "x-apihub-key": "YDoVJUPRVRQPoDRzkuiuccJDV1-6FgluIpO3QSuoFPSdQMW174",
  "x-apihub-host": "Movies-Verse.allthingsdev.co",
  "x-apihub-endpoint": "5122e0f8-a949-45a9-aedf-5eaf61c6085b"
};

const TopBoxOfficePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchTopBoxOffice = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: API_HEADERS,
          cancelToken: source.token
        });
        setMovies(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err.message);
          console.error("API Error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopBoxOffice();

    return () => source.cancel("Component unmounted");
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading Top Box Office...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="top-box-office-page">
      <div className="page-header">
        <h1>Top Box Office</h1>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>

      <div className="movies-list">
        {movies.map((movie, index) => (
          <div key={`${movie.id}-${index}`} className="box-office-card">
            <div className="rank">#{index + 1}</div>
            <div className="movie-content">
              <h3>{movie.title}</h3>
              <div className="movie-stats">
                <span>Gross: {formatCurrency(movie.gross)}</span>
                <span>Weeks: {movie.weeks}</span>
                {movie.change && <span>Change: {movie.change}%</span>}
              </div>
              <Link to={`/movie/${movie.id}`} className="details-link">
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBoxOfficePage;
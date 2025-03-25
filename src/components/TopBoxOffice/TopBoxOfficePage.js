import React, { useState, useEffect } from 'react';
import MovieCard from '../components/TopBoxOffice/MovieCard';
import './TopBoxOfficePage.css';
import axios from 'axios';

const boxOfficeAPI = axios.create({
  baseURL: 'https://Movies-Verse.proxy-production.allthingsdev.co/api',
  headers: {
    "x-apihub-key": "YDoVJUPRVRQPoDRzkuiuccJDV1-6FgluIpO3QSuoFPSdQMW174",
    "x-apihub-host": "Movies-Verse.allthingsdev.co",
    "x-apihub-endpoint": "5122e0f8-a949-45a9-aedf-5eaf61c6085b"
  }
});

const fetchTopBoxOfficeMovies = async () => {
  try {
    const response = await boxOfficeAPI.get('/movies/top-box-office');
    return response.data.movies || []; // Ensure it returns an array
  } catch (error) {
    console.error('Error fetching top box office movies:', error);
    throw error;
  }
};

const TopBoxOfficePage = () => {
  const [movies, setMovies] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await fetchTopBoxOfficeMovies();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="top-box-office-page">
      <h1>Top Box Office Movies</h1>
      <div className="movie-grid">
        {Array.isArray(movies) && movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default TopBoxOfficePage;
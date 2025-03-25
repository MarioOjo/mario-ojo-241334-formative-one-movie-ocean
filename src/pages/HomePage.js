import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/TopBoxOffice/MovieCard'; // Corrected path to MovieCard
import './HomePage.css';
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
    return response.data.movies;
  } catch (error) {
    console.error('Error fetching top box office movies:', error);
    throw error;
  }
};

const HomePage = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPopularMovies = async () => {
      try {
        const movies = await fetchTopBoxOfficeMovies(); // Integrated function
        setPopularMovies(movies.slice(0, 6)); // Show top 6
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoading(false);
      }
    };

    getPopularMovies();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Discover & Compare Movies</h1>
        <p>Explore box office hits, ratings, and detailed comparisons</p>
        <div className="cta-buttons">
          <Link to="/top-box-office" className="btn primary">Top Box Office</Link>
          <Link to="/compare" className="btn secondary">Compare Movies</Link>
        </div>
      </section>

      <section className="popular-movies">
        <h2>Popular This Week</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="movie-grid">
            {popularMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
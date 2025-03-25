import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTopBoxOfficeMovies, fetchMovieDetails } from '../utils/movieAPI';
import MovieCard from '../components/Movie/MovieCard';
import './HomePage.css';

const HomePage = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPopularMovies = async () => {
      try {
        const movies = await fetchPopularMovies();
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
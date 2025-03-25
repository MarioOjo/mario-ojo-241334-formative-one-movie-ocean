import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovies, getMovieDetails } from '../../utils/helpers/utils/movieAPI';
import SingleMovieChart from '../components/Charts/SingleMovieChart';
import './MoviePage.css';

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-page">
      <div className="movie-header">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster"
        />
        <div className="movie-info">
          <h1>{movie.title} <span>({new Date(movie.release_date).getFullYear()})</span></h1>
          <div className="movie-meta">
            <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{movie.runtime} mins</span>
            <span>{movie.release_date}</span>
          </div>
          <div className="genres">
            {movie.genres.map(genre => (
              <span key={genre.id} className="genre-tag">{genre.name}</span>
            ))}
          </div>
          <p className="overview">{movie.overview}</p>
        </div>
      </div>

      <div className="movie-stats">
        <SingleMovieChart movie={movie} />
      </div>
    </div>
  );
};

export default MoviePage;
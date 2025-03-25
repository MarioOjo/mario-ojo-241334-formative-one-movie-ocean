import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/Search/SearchBar';
import ComparisonChart from '../components/Charts/ComparisonChart';
import './ComparePage.css';

const ComparePage = () => {
  const [movies, setMovies] = useState([null, null]);

  const handleMovieSelect = (movie, index) => {
    const newMovies = [...movies];
    newMovies[index] = movie;
    setMovies(newMovies);
  };

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1>Movie Comparison Tool</h1>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>

      <div className="search-containers">
        <div className="search-box">
          <h3>First Movie</h3>
          <SearchBar onSelect={(movie) => handleMovieSelect(movie, 0)} />
          {movies[0] && (
            <div className="selected-movie">
              <img 
                src={`https://image.tmdb.org/t/p/w200${movies[0].poster_path}`} 
                alt={movies[0].title}
              />
              <h4>{movies[0].title}</h4>
            </div>
          )}
        </div>

        <div className="vs-circle">VS</div>

        <div className="search-box">
          <h3>Second Movie</h3>
          <SearchBar onSelect={(movie) => handleMovieSelect(movie, 1)} />
          {movies[1] && (
            <div className="selected-movie">
              <img 
                src={`https://image.tmdb.org/t/p/w200${movies[1].poster_path}`} 
                alt={movies[1].title}
              />
              <h4>{movies[1].title}</h4>
            </div>
          )}
        </div>
      </div>

      {movies[0] && movies[1] && (
        <div className="charts-container">
          <ComparisonChart movie1={movies[0]} movie2={movies[1]} />
        </div>
      )}
    </div>
  );
};

export default ComparePage;
import React from 'react';
import './TopBoxOfficeCard.css';

const TopBoxOfficeCard = ({ movie, rank }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <article className="movie-card">
      <span className="rank">#{rank}</span>
      <div className="movie-details">
        <h3>{movie.title}</h3>
        <div className="movie-stats">
          <span>Gross: {formatCurrency(movie.gross)}</span>
          <span>Weeks: {movie.weeks}</span>
          {movie.change && <span>Change: {movie.change}%</span>}
        </div>
      </div>
    </article>
  );
};

export default TopBoxOfficeCard;
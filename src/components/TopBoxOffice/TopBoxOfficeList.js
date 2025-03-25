import React from 'react';
import TopBoxOfficeCard from './TopBoxOfficeCard';
import './TopBoxOfficeList.css';

const TopBoxOfficeList = ({ movies }) => {
  return (
    <div className="movie-list">
      {movies.map((movie, index) => (
        <TopBoxOfficeCard 
          key={`${movie.id}-${index}`}
          movie={movie}
          rank={index + 1}
        />
      ))}
    </div>
  );
};

export default TopBoxOfficeList;
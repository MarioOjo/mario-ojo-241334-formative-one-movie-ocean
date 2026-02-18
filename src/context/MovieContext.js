import React, { createContext, useContext, useState } from 'react';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [popularityHistory, setPopularityHistory] = useState([]);
  const [boxOfficeHistory, setBoxOfficeHistory] = useState([]);

  return (
    <MovieContext.Provider value={{ selectedMovie, setSelectedMovie, popularityHistory, setPopularityHistory, boxOfficeHistory, setBoxOfficeHistory }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => useContext(MovieContext);

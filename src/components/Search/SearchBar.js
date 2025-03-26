import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search for a movie..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // TMDB API configuration
  const API_KEY = 'bf12ff0542145f969307e128eae46673';
  const BASE_URL = 'https://api.themoviedb.org/3';

  // ✅ Wrap fetchSuggestions in useCallback so it doesn't recreate on every render
  const fetchSuggestions = useCallback(async () => {
    if (query.length < 3) return;

    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: query,
          language: 'en-US',
          page: 1
        }
      });
      setSuggestions(response.data.results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, [query]); // ✅ query is now a dependency, so fetchSuggestions updates only when query changes

  useEffect(() => {
    if (query.length > 2) {
      const timer = setTimeout(() => {
        fetchSuggestions();
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query, fetchSuggestions]); // ✅ fetchSuggestions is now properly included

  const handleSearch = () => {
    if (selectedMovie) {
      onSearch(selectedMovie);
    } else if (query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = (movie) => {
    setSelectedMovie(movie);
    setQuery(movie.title);
    setShowSuggestions(false);
    onSearch(movie);
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((movie) => (
            <li 
              key={movie.id} 
              onClick={() => handleSelect(movie)}
              className="suggestion-item"
            >
              <img 
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                  : 'https://via.placeholder.com/92x138?text=No+Poster'}
                alt={movie.title}
                className="suggestion-poster"
              />
              <div className="suggestion-info">
                <span className="suggestion-title">{movie.title}</span>
                {movie.release_date && (
                  <span className="suggestion-year">
                    ({new Date(movie.release_date).getFullYear()})
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

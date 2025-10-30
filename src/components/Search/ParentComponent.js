import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar'; // Adjust the path if necessary
import { Link } from 'react-router-dom';

const API_URL = "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/search";
const API_HEADERS = {
  "x-apihub-key": "YDoVJUPRVRQPoDRzkuiuccJDV1-6FgluIpO3QSuoFPSdQMW174",
  "x-apihub-host": "Movies-Verse.allthingsdev.co",
  "x-apihub-endpoint": "5122e0f8-a949-45a9-aedf-5eaf61c6085b"
};

const ParentComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle the search query
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}?query=${query}`, {
        headers: API_HEADERS,
      });
      setSearchResults(response.data.results || []); // Assuming the API returns results in `data.results`
    } catch (err) {
      setError(err.message);
      console.error("Search API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Movies</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <div>Loading search results...</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && searchResults.length === 0 && searchQuery && (
        <div>No results found for "{searchQuery}"</div>
      )}
      <div className="search-results">
        {searchResults.map((movie) => (
          <div key={movie.id} className="search-result-card">
            <h3>{movie.title}</h3>
            <p>Release Date: {movie.release_date}</p>
            <Link to={`/movie/${movie.id}`} className="details-link">
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentComponent;
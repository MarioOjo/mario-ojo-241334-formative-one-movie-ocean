import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search for a movie..." }) => {
  const [query, setQuery] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{
          padding: '10px',
          width: '300px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={() => onSearch(query)}
        style={{
          padding: '10px 20px',
          borderRadius: '5px',
          backgroundColor: '#4bc0c0',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
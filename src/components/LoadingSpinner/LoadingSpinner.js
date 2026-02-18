import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'medium',
  overlay = false 
}) => {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }[size];

  const LoadingContent = () => (
    <div className={`loading-container ${sizeClass}`}>
      <div className="movie-spinner">
        <div className="film-reel">
          <div className="reel-hole"></div>
          <div className="reel-hole"></div>
          <div className="reel-hole"></div>
          <div className="reel-hole"></div>
        </div>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        <LoadingContent />
      </div>
    );
  }

  return <LoadingContent />;
};

export default LoadingSpinner;
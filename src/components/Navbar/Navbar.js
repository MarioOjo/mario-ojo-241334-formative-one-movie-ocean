import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiBarChart2, FiFilm } from 'react-icons/fi'; // Replaced FiCompare with FiBarChart2
import './Navbar.css';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? '→' : '←'}
        </button>
        {!isCollapsed && <h2 className="logo">MovieVerse</h2>}
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">
            <FiHome className="nav-icon" />
            {!isCollapsed && <span>Home</span>}
          </Link>
        </li>
        <li>
          <Link to="/top-box-office" className="nav-link">
            <FiTrendingUp className="nav-icon" />
            {!isCollapsed && <span>Top Box Office</span>}
          </Link>
        </li>
        <li>
          <Link to="/compare" className="nav-link">
            <FiBarChart2 className="nav-icon" /> {/* Replaced FiCompare */}
            {!isCollapsed && <span>Compare</span>}
          </Link>
        </li>
        <li>
          <Link to="/movie/example" className="nav-link">
            <FiFilm className="nav-icon" />
            {!isCollapsed && <span>Movie Details</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
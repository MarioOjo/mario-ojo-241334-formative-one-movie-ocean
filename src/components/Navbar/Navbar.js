import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiBarChart2, FiClock } from 'react-icons/fi'; // Added FiClock
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
          <Link to="/compare" className="nav-link">
            <FiBarChart2 className="nav-icon" />
            {!isCollapsed && <span>Compare</span>}
          </Link>
        </li>

        <li>
          <Link to="/timeline" className="nav-link">
            <FiClock className="nav-icon" />
            {!isCollapsed && <span>Timelines</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
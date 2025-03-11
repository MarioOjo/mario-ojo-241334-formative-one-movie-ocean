import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidenav ${isOpen ? 'open' : 'closed'}`}>
      {/* Keep the button inside but make it always visible */}
      <button className="toggle-btn" onClick={toggleNavbar}>
        ☰
      </button>

      <h1 className="logo">MOVIE OCEAN</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/compare">Compare</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;

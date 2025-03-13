import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button className="toggle-btn" onClick={toggleNavbar} aria-label="Toggle navigation">
        ☰
      </button>
      <nav className={`sidenav ${isOpen ? "open" : ""}`}>
        <h1 className="logo">MOVIE OCEAN</h1>
        <ul>
          <li>
            <Link to="/" onClick={closeNavbar}>Home</Link>
          </li>
          <li>
            <Link to="/compare" onClick={closeNavbar}>Compare</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;

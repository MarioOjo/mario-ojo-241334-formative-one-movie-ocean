import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Navbar for navigation
import Home from './components/pages/Home'; // Home page
import Compare from './components/pages/Compare'; // Compare page
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Include the Navbar */}
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Route for Home page */}
            <Route path="/compare" element={<Compare />} /> {/* Route for Compare page */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
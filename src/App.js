import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';
import MoviePage from './pages/MoviePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/compare" element={<ComparePage />} />
                     <Route path="/movie/:id" element={<MoviePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
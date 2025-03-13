import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LineChart from './components/LineChart';
import BubbleChart from './components/BubbleChart';
import TopBoxOfficeMovies from './components/TopBoxOfficeMovies';
import './App.css';

function Home() {
  return (
    <div>
      <h2>Home Page</h2>
      <Dashboard />
      <LineChart />
      <BubbleChart />
      <TopBoxOfficeMovies /> {/* Include the TopBoxOfficeMovies component */}
    </div>
  );
}

function Compare() {
  return <h2>Compare Page</h2>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
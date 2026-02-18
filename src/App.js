import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Navbar from './components/Navbar/Navbar';
import { MovieProvider } from './context/MovieContext';
import './App.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));

function App() {
  return (
    <MovieProvider>
      <ErrorBoundary>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Suspense fallback={<div style={{textAlign:'center',marginTop:'2rem',fontFamily:'Exo'}}>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/timeline" element={<TimelinePage />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </ErrorBoundary>
    </MovieProvider>
  );
}

export default App;
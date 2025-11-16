# Movieverse

Movieverse is a React web app for exploring, visualizing, and comparing movie data using TMDb and a custom box-office API. It provides searchable movie dashboards, multi-chart visualizations, side-by-side comparisons, and timeline analysis.

## Main features

- Search and preview movie details
- Interactive charts (bar, radar, timelines)
- Compare two movies side-by-side with metric highlights
- Responsive UI with accessible color contrasts

## Tech stack

- React 19
- React Router DOM
- Chart.js + react-chartjs-2
- Axios for API requests
- Material UI (MUI)
- gh-pages (optional) for GitHub Pages deployment

## Quick start

1. Install dependencies

```powershell
npm install
```

2. Add your TMDb API key to a `.env` file at the project root:

```
REACT_APP_TMDB_KEY=your_tmdb_key_here
```

3. Start the dev server

```powershell
npm start
```

4. Build for production

```powershell
npm run build
```

Optional: Deploy with `gh-pages` (if configured)

```powershell
npm run deploy
```

## Important source snippets (exact from `main` branch)

App routing (`src/App.js`):

```js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
```

Home page: core fetch helpers and usage (`src/pages/HomePage.js`)

```js
// TMDB API configuration
const API_KEY = 'bf12ff0542145f969307e128eae46673';
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchMovieById = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: { api_key: API_KEY, append_to_response: 'release_dates' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
};

const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: { api_key: API_KEY, query: query, language: 'en-US', page: 1 }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};
```

Centralized API helper (`src/movieAPI.js`):

```js
import axios from 'axios';

const tmdbAPI = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: process.env.REACT_APP_TMDB_KEY, language: 'en-US' }
});

const makeRequest = async (apiInstance, config) => {
  const source = axios.CancelToken.source();
  // ... track cancellation token
  try {
    const response = await apiInstance({ ...config, cancelToken: source.token });
    return response.data;
  } catch (error) {
    if (!axios.isCancel(error)) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
```

Package scripts (excerpt from `package.json`):

```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

## Notes & next steps

- I restored this README with canonical code snippets from the `main` branch.
- If you'd like, I can: (A) commit these files locally and push to the remote, (B) recreate missing source files from `main` into the current `gh-pages` branch, or (C) open the `main` branch and switch the working tree back to it so you can continue development there.

Tell me which next step you prefer (commit only, commit+push, or restore source files into the current branch). I'll proceed accordingly.

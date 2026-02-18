# Movieverse — Presentation

This slide-style markdown walks through the project, features, tech, APIs, and selected code snippets.

---

## Presentation Plan & Timing

- Total time: 40 minutes (recommended)
- 2 minutes: Introduction & project overview (this slide)
- 30-33 minutes: Live demonstration and feature walkthrough
- 5 minutes: Final summary, lessons learned, and Q&A

Use the structure below during a live presentation: start with this short intro, then follow a clear demo path (priority features first), and close with a concise conclusion and time for questions.

---

## Slide 0 — Intro (2-minute scripted overview)

Speaker goal: Give a clear, confident elevator pitch that tells the audience what Movieverse is, why it exists, which problems it solves, and what they will see in the demo.

Script (approx. 2 minutes):

"Hello — I'm Mario Surprise Ojo. Thank you for joining this presentation of Movieverse, a movie data visualization and comparison web app I developed using React and TMDb.

In two minutes I'll give a quick overview: Movieverse helps film fans and analysts explore movie metrics — from budget and revenue to audience reception and production details — using interactive charts and side-by-side comparisons. It centralizes TMDb data and augments it with timelines and visual metrics for quick insight.

During the demo I'll show three core flows: searching for a single movie and reading its dashboard, comparing two movies side-by-side (you'll see winner highlighting and metric breakdowns), and a timeline view to analyze release and box-office patterns. I'll focus on features that show performance, clarity, and design decisions: lazy-loaded pages for speed, a centralized API service to minimize calls, and accessible UI components.

At the end I'll summarize key takeaways and take a few questions. If anything fails during the live demo, I'll fall back to screenshots and a short recorded clip I prepared — so the demo will continue smoothly.

Let's start with the home page and a quick search for a movie." 

Speaker checklist (before demo):
- Ensure `REACT_APP_TMDB_API_KEY` is set and network access is available.
- Open the live site or local dev server tab in the browser (home/search ready).
- Have a backup screenshot folder or short recorded clip available in case external APIs or video playback fail.

Timing cues:
- 0:00–0:30 — Personal intro + project name and one-line elevator pitch
- 0:30–1:15 — Problem statement + high-level solution and core features
- 1:15–1:50 — Demo plan: which three features you'll show and why
- 1:50–2:00 — Transition to live demo (open the site and begin search)

---

## Slide 1 — What is Movieverse?

- A React-based movie data visualization and comparison tool.
- Uses TMDb for movie metadata and media.
- Provides dashboards, timelines and side-by-side comparisons.

---

## Slide 2 — Main features

- Search & preview
- Movie detail page (cast, trailers, reviews)
- Multi-chart visualizations
- Compare two movies with winner highlights
- Timeline visualizations

---

## Slide 3 — Tech stack & packages

- React 19, React Router DOM
- Chart.js + react-chartjs-2
- Axios for API requests
- Material UI
- gh-pages for deployment

---

## Slide 4 — API & data flow

- TMDb used for primary movie data.
- Centralized `movieAPI.js` wraps Axios calls.
- Example helper: `getMovieDetails(id)` combines TMDb details with appended responses.

---

## Slide 5 — Architecture

- `App.js` sets up routes with `react-router-dom`.
- Components are organized under `src/components` and pages under `src/pages`.
- Charts live in `src/components/Charts/` and are configured for responsive display.

---

## Slide 6 — Key code snippet: App routing

```js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';

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

---

## Slide 7 — Key code snippet: Home page fetch helpers

```js
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

---

## Slide 8 — Key code snippet: movieAPI wrapper

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

---

## Slide 9 — Styling examples

- Home page uses a warm gradient background in the source and translucent content cards for readability.
- Charts use gradient fills and accessible color contrasts.

---

## Slide 10 — Deployment & maintenance

- Deploy with `npm run build` and `npm run deploy` (if `gh-pages` configured)
- Keep `REACT_APP_TMDB_KEY` in `.env`
- Update `browserslist` data periodically: `npx update-browserslist-db@latest`

---

## Slide 11 — Next steps & improvements

- Add user accounts & favorites
- Persist comparison history
- Add export (CSV/PDF) for comparisons
- Improve test coverage & CI for deploys

---

## Slide 12 — Contact & repo

- Repo: https://github.com/MarioOjo/mario-ojo-241334-formative-one-movie-verse
- Live: https://marioojo.github.io/mario-ojo-241334-formative-one-movie-verse/

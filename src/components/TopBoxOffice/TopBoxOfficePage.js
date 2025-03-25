import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBoxOfficeList from '../components/TopBoxOffice/TopBoxOfficeList';
import './TopBoxOfficePage.css';

const API_URL = "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/top-box-office";
const API_HEADERS = {
  "x-apihub-key": "YDoVJUPRVRQPoDRzkuiuccJDV1-6FgluIpO3QSuoFPSdQMW174",
  "x-apihub-host": "Movies-Verse.allthingsdev.co",
  "x-apihub-endpoint": "5122e0f8-a949-45a9-aedf-5eaf61c6085b"
};

const TopBoxOfficePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: API_HEADERS,
          cancelToken: source.token
        });
        setMovies(response.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => source.cancel("Component unmounted");
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <main className="top-box-office">
      <h1>Top Box Office</h1>
      <TopBoxOfficeList movies={movies} />
    </main>
  );
};

export default TopBoxOfficePage;
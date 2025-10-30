import React, { useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://Movies-Verse.proxy-production.allthingsdev.co/api/movies/top-box-office";
const API_HEADERS = {
  "x-apihub-key": "YDoVJUPRVRQPoDRzkuiuccJDV1-6FgluIpO3QSuoFPSdQMW174",
  "x-apihub-host": "Movies-Verse.allthingsdev.co",
  "x-apihub-endpoint": "5122e0f8-a949-45a9-aedf-5eaf61c6085b"
};

const TopBoxOfficeMovies = () => {
  useEffect(() => {
    const fetchTopBoxOfficeMovies = async () => {
      try {
        console.log("Fetching top box office movies...");
        const response = await axios.get(API_URL, {
          headers: API_HEADERS
        });

        console.log("API Response:", response);

        const movies = response.data;

        console.log("Fetched Movies:", movies);
      } catch (error) {
        console.error("Error fetching top box office movies:", error);
      }
    };

    fetchTopBoxOfficeMovies();
  }, []);

  return (
    <div>
      <h2>Top Box Office Movies</h2>
      <p>Check the console for the fetched data.</p>
    </div>
  );
};

export default TopBoxOfficeMovies;
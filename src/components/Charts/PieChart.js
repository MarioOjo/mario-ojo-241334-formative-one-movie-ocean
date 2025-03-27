const createBoxOfficePieData = () => {
    // Check if data exists and is in expected format
    if (!boxOfficeData || !movies[0] || !movies[1]) return null;
  
    try {
      // Handle different response formats
      let dataArray;
      if (Array.isArray(boxOfficeData)) {
        dataArray = boxOfficeData;
      } else if (boxOfficeData.data && Array.isArray(boxOfficeData.data)) {
        dataArray = boxOfficeData.data;
      } else if (boxOfficeData.results && Array.isArray(boxOfficeData.results)) {
        dataArray = boxOfficeData.results;
      } else {
        console.warn("Unexpected box office data format:", boxOfficeData);
        return null;
      }
  
      // Find movies in the box office data
      const movie1Data = dataArray.find(m => m.id === movies[0].id || m.tmdb_id === movies[0].id);
      const movie2Data = dataArray.find(m => m.id === movies[1].id || m.tmdb_id === movies[1].id);
  
      if (!movie1Data || !movie2Data) {
        console.warn("Couldn't find box office data for one or both movies");
        return null;
      }
  
      // Ensure we have the required fields
      const movie1Gross = movie1Data.weekend_gross ?? movie1Data.weekendGross ?? 0;
      const movie2Gross = movie2Data.weekend_gross ?? movie2Data.weekendGross ?? 0;
      const movie1Weeks = movie1Data.weeks_released ?? movie1Data.weeksReleased ?? "N/A";
      const movie2Weeks = movie2Data.weeks_released ?? movie2Data.weeksReleased ?? "N/A";
  
      return {
        labels: [
          `${movies[0].title} (${movie1Weeks} weeks)`,
          `${movies[1].title} (${movie2Weeks} weeks)`
        ],
        datasets: [{
          data: [movie1Gross, movie2Gross],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1
        }]
      };
    } catch (error) {
      console.error("Error creating box office chart data:", error);
      return null;
    }
  };
// Enhanced Movie Metrics Utilities
export const movieMetrics = {
  // Financial Performance Metrics
  financial: {
    budget: (movie) => movie.budget || 0,
    revenue: (movie) => movie.revenue || 0,
    profit: (movie) => (movie.revenue || 0) - (movie.budget || 0),
    roi: (movie) => {
      const budget = movie.budget || 0;
      const revenue = movie.revenue || 0;
      return budget > 0 ? ((revenue - budget) / budget * 100) : 0;
    },
    profitMargin: (movie) => {
      const revenue = movie.revenue || 0;
      const profit = (movie.revenue || 0) - (movie.budget || 0);
      return revenue > 0 ? (profit / revenue * 100) : 0;
    }
  },

  // Audience & Critical Reception
  reception: {
    userRating: (movie) => movie.vote_average || 0,
    voteCount: (movie) => movie.vote_count || 0,
    popularity: (movie) => movie.popularity || 0,
    // Calculated engagement score
    engagementScore: (movie) => {
      const rating = movie.vote_average || 0;
      const votes = movie.vote_count || 0;
      const popularity = movie.popularity || 0;
      // Weighted score considering all factors
      return (rating * 10 + Math.log(votes + 1) * 5 + popularity) / 3;
    }
  },

  // Production Metrics
  production: {
    runtime: (movie) => movie.runtime || 0,
    releaseYear: (movie) => movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
    genreCount: (movie) => movie.genres?.length || 0,
    languageSupport: (movie) => movie.spoken_languages?.length || 0,
    productionCountries: (movie) => movie.production_countries?.length || 0,
    productionCompanies: (movie) => movie.production_companies?.length || 0,
    // Age of movie (years since release)
    movieAge: (movie) => {
      if (!movie.release_date) return 0;
      const releaseYear = new Date(movie.release_date).getFullYear();
      return new Date().getFullYear() - releaseYear;
    }
  },

  // Cast & Crew Metrics
  people: {
    castSize: (movie) => movie.credits?.cast?.length || 0,
    crewSize: (movie) => movie.credits?.crew?.length || 0,
    femaleActors: (movie) => {
      if (!movie.credits?.cast) return 0;
      return movie.credits.cast.filter(person => person.gender === 1).length;
    },
    maleActors: (movie) => {
      if (!movie.credits?.cast) return 0;
      return movie.credits.cast.filter(person => person.gender === 2).length;
    },
    genderDiversity: (movie) => {
      const total = movieMetrics.people.castSize(movie);
      if (total === 0) return 0;
      const female = movieMetrics.people.femaleActors(movie);
      // Calculate diversity index (closer to 50% = more diverse)
      const femaleRatio = female / total;
      return 100 - Math.abs(50 - (femaleRatio * 100));
    }
  },

  // Content Metrics
  content: {
    adultContent: (movie) => movie.adult ? 100 : 0,
    hasVideo: (movie) => movie.video ? 100 : 0,
    trailerCount: (movie) => movie.videos?.results?.length || 0,
    backdropCount: (movie) => movie.images?.backdrops?.length || 0,
    posterCount: (movie) => movie.images?.posters?.length || 0,
    reviewCount: (movie) => movie.reviews?.total_results || 0,
    // Content richness score
    contentRichness: (movie) => {
      const trailers = movieMetrics.content.trailerCount(movie);
      const backdrops = movieMetrics.content.backdropCount(movie);
      const posters = movieMetrics.content.posterCount(movie);
      const reviews = movieMetrics.content.reviewCount(movie);
      return (trailers * 10 + backdrops + posters + reviews) / 4;
    }
  },

  // Market Performance
  market: {
    recommendationScore: (movie) => movie.recommendations?.total_results || 0,
    similarMoviesCount: (movie) => movie.similar?.total_results || 0,
    // Market penetration score
    marketPenetration: (movie) => {
      const countries = movieMetrics.production.productionCountries(movie);
      const languages = movieMetrics.production.languageSupport(movie);
      const popularity = movie.popularity || 0;
      return (countries * 20 + languages * 15 + popularity) / 3;
    }
  },

  // Advanced Analytics
  analytics: {
    // Success index combining multiple factors
    successIndex: (movie) => {
      const roi = movieMetrics.financial.roi(movie);
      const rating = movie.vote_average || 0;
      const popularity = movie.popularity || 0;
      const votes = Math.log(movie.vote_count + 1) || 0;
      
      // Weighted success score
      return (roi * 0.3 + rating * 10 * 0.25 + popularity * 0.25 + votes * 5 * 0.2);
    },
    
    // Risk assessment (higher = riskier investment)
    riskScore: (movie) => {
      const budget = movie.budget || 0;
      const genreRisk = movieMetrics.analytics.getGenreRisk(movie);
      const runtimeRisk = movieMetrics.analytics.getRuntimeRisk(movie);
      
      return (Math.log(budget + 1) + genreRisk + runtimeRisk) / 3;
    },

    getGenreRisk: (movie) => {
      if (!movie.genres) return 50;
      const riskGenres = ['Horror', 'Documentary', 'Foreign'];
      const safeGenres = ['Action', 'Adventure', 'Comedy', 'Family'];
      
      let riskScore = 50;
      movie.genres.forEach(genre => {
        if (riskGenres.includes(genre.name)) riskScore += 20;
        if (safeGenres.includes(genre.name)) riskScore -= 15;
      });
      
      return Math.max(0, Math.min(100, riskScore));
    },

    getRuntimeRisk: (movie) => {
      const runtime = movie.runtime || 0;
      if (runtime < 90) return 70; // Too short
      if (runtime > 180) return 60; // Too long
      if (runtime >= 90 && runtime <= 120) return 20; // Sweet spot
      return 40; // Moderate
    }
  }
};

// Predefined metric sets for different chart types
export const metricSets = {
  financial: {
    title: "Financial Performance",
    metrics: [
      { key: 'budget', label: 'Budget ($M)', formatter: (val) => `$${(val/1000000).toFixed(1)}M` },
      { key: 'revenue', label: 'Revenue ($M)', formatter: (val) => `$${(val/1000000).toFixed(1)}M` },
      { key: 'profit', label: 'Profit ($M)', formatter: (val) => `$${(val/1000000).toFixed(1)}M` },
      { key: 'roi', label: 'ROI (%)', formatter: (val) => `${val.toFixed(1)}%` }
    ]
  },

  audience: {
    title: "Audience Reception",
    metrics: [
      { key: 'userRating', label: 'User Rating', formatter: (val) => `${val.toFixed(1)}/10` },
      { key: 'voteCount', label: 'Vote Count', formatter: (val) => val.toLocaleString() },
      { key: 'popularity', label: 'Popularity', formatter: (val) => val.toFixed(1) },
      { key: 'engagementScore', label: 'Engagement', formatter: (val) => val.toFixed(1) }
    ]
  },

  production: {
    title: "Production Metrics",
    metrics: [
      { key: 'runtime', label: 'Runtime (min)', formatter: (val) => `${val} min` },
      { key: 'castSize', label: 'Cast Size', formatter: (val) => val.toString() },
      { key: 'genreCount', label: 'Genres', formatter: (val) => val.toString() },
      { key: 'languageSupport', label: 'Languages', formatter: (val) => val.toString() }
    ]
  },

  analytics: {
    title: "Advanced Analytics",
    metrics: [
      { key: 'successIndex', label: 'Success Index', formatter: (val) => val.toFixed(1) },
      { key: 'riskScore', label: 'Risk Score', formatter: (val) => val.toFixed(1) },
      { key: 'contentRichness', label: 'Content Richness', formatter: (val) => val.toFixed(1) },
      { key: 'movieAge', label: 'Age (years)', formatter: (val) => `${val} years` }
    ]
  }
};

// Helper function to calculate metric values
export const calculateMetricValue = (movie, metricKey) => {
  const parts = metricKey.split('.');
  let value = movieMetrics;
  
  for (const part of parts) {
    if (typeof value[part] === 'function') {
      return value[part](movie);
    }
    value = value[part];
  }
  
  return 0;
};

// Helper function to get metric data for charts
export const getMetricData = (movie, metricSetKey) => {
  if (!movie || !metricSets[metricSetKey]) return null;
  
  const metricSet = metricSets[metricSetKey];
  const labels = metricSet.metrics.map(m => m.label);
  const data = metricSet.metrics.map(m => {
    const category = m.key.includes('.') ? m.key.split('.')[0] : 
                    Object.keys(movieMetrics).find(cat => movieMetrics[cat][m.key]);
    return movieMetrics[category][m.key](movie);
  });
  
  return { labels, data, title: metricSet.title };
};
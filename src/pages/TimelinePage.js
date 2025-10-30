import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import ReleaseDatesTimeline from '../components/Charts/ReleaseDatesTimeline';
import BoxOfficeTimeline from '../components/Charts/BoxOfficeTimeline';
import ProductionTimeline from '../components/Charts/ProductionTimeline';

const TimelinePage = () => {
  const { selectedMovie, popularityHistory, boxOfficeHistory } = useMovie();
  const [valueType, setValueType] = useState('release');
  const [groupType, setGroupType] = useState('all');
  if (!selectedMovie) return <div>No movie selected.</div>;
  const releaseDates = selectedMovie.release_dates?.results || [];
  return (
    <div className="timeline-page">
      <h2>{selectedMovie.title} Timeline</h2>
      <div className="button-group timeline-button-group">
        <button
          className={valueType === 'release' ? 'active' : ''}
          onClick={() => setValueType('release')}
        >Release Dates</button>
        <button
          className={valueType === 'production' ? 'active' : ''}
          onClick={() => setValueType('production')}
        >Production Timeline</button>
      </div>
      {valueType === 'release' && (
        <div className="timeline-group-select">
          <label htmlFor="groupType">Group by:</label>
          <select id="groupType" value={groupType} onChange={e => setGroupType(e.target.value)}>
            <option value="all">All</option>
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="country">Country</option>
            <option value="type">Type</option>
          </select>
        </div>
      )}
      {valueType === 'production' && (
        <div className="timeline-group-select">
          <label htmlFor="productionGroup">View:</label>
          <select id="productionGroup" disabled>
            <option value="milestones">Production Milestones</option>
          </select>
        </div>
      )}
      {valueType === 'release' ? (
        <ReleaseDatesTimeline releaseDates={releaseDates} groupType={groupType} />
      ) : valueType === 'production' ? (
        <ProductionTimeline movie={selectedMovie} />
      ) : null}
    </div>
  );
};

export default TimelinePage;

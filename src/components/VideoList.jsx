import React from 'react';

const VideoList = ({ videos, onRemove }) => {
  if (videos.length === 0) return null;

  return (
    <div className="video-list">
      <h3>Queue ({videos.length})</h3>
      {videos.map((video, index) => (
        <div key={`${video.path}-${index}`} className={`video-item ${video.status}`}>
          <div className="video-info">
            <span className="video-name">{video.name}</span>
            <span className="video-status">{video.status}</span>
          </div>
          {video.status === 'pending' && (
            <button className="remove-btn" onClick={() => onRemove(index)}>
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default VideoList;

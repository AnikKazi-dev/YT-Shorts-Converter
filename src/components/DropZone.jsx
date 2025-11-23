import React, { useCallback } from 'react';

const DropZone = ({ onFilesAdded }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('video/'));
    if (files.length > 0) {
      onFilesAdded(files);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('video/'));
    if (files.length > 0) {
      onFilesAdded(files);
    }
  };

  return (
    <div 
      className="drop-zone"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput').click()}
    >
      <input 
        type="file" 
        id="fileInput" 
        multiple 
        accept="video/*" 
        onChange={handleFileInput} 
        style={{ display: 'none' }} 
      />
      <div className="drop-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <p>Drag & Drop videos here or click to browse</p>
      </div>
    </div>
  );
};

export default DropZone;

import React, { useState } from 'react';
import DropZone from './components/DropZone';
import VideoList from './components/VideoList';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleFilesAdded = (files) => {
    console.log('Files added:', files);
    files.forEach(f => console.log('File path:', f.path, 'Name:', f.name));
    
    const newVideos = files.map(file => ({
      file,
      path: file.path || (window.electron.getFilePath && window.electron.getFilePath(file)), // Try to get path if missing
      name: file.name,
      status: 'pending' // pending, converting, completed, error
    }));
    setVideos(prev => [...prev, ...newVideos]);
  };

  const handleRemove = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const convertAll = async () => {
    if (isConverting) return;
    setIsConverting(true);

    const pendingVideos = videos.map((v, i) => ({ ...v, index: i })).filter(v => v.status === 'pending');

    for (const video of pendingVideos) {
      // Update status to converting
      setVideos(prev => prev.map((v, i) => i === video.index ? { ...v, status: 'converting' } : v));

      try {
        await window.electron.convertVideo(video.path);
        // Update status to completed
        setVideos(prev => prev.map((v, i) => i === video.index ? { ...v, status: 'completed' } : v));
      } catch (error) {
        console.error(error);
        // Update status to error
        setVideos(prev => prev.map((v, i) => i === video.index ? { ...v, status: 'error' } : v));
      }
    }

    setIsConverting(false);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Shorts Converter</h1>
        <p>Convert landscape videos to portrait with blurred background</p>
      </header>
      
      <main>
        <DropZone onFilesAdded={handleFilesAdded} />
        
        <div className="actions">
          <button 
            className="convert-btn" 
            onClick={convertAll} 
            disabled={isConverting || videos.filter(v => v.status === 'pending').length === 0}
          >
            {isConverting ? 'Converting...' : 'Convert All'}
          </button>
        </div>

        <VideoList videos={videos} onRemove={handleRemove} />
      </main>
    </div>
  );
}

export default App;

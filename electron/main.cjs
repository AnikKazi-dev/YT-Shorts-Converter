const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

// Set ffmpeg path
console.log('FFmpeg Path:', ffmpegPath);
console.log('Dirname:', __dirname);
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  console.error('FFmpeg path is missing!');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    backgroundColor: '#1a1a1a',
  });

  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('convert-video', async (event, args) => {
  console.log('Received convert-video request:', args);
  const { filePath, outputDir } = args;
  return new Promise((resolve, reject) => {
    if (!filePath) {
      console.error('FilePath is undefined!');
      return reject('FilePath is undefined');
    }
    const fileName = path.basename(filePath, path.extname(filePath));
    const outputPath = path.join(outputDir || path.dirname(filePath), `${fileName}_portrait.mp4`);

    // Complex filter to create blurred background and centered foreground
    // 1. Split input into two streams
    // 2. Stream 0 (Background): Scale to 1080x1920 (fill), crop to 1080x1920, boxblur
    // 3. Stream 1 (Foreground): Scale to 1080 width (maintain aspect ratio)
    // 4. Overlay Foreground on Background
    
    ffmpeg(filePath)
      .complexFilter([
        '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:10[bg]',
        '[0:v]scale=1080:-1[fg]',
        '[bg][fg]overlay=(W-w)/2:(H-h)/2'
      ])
      .outputOptions([
        '-c:v libx264',
        '-preset fast',
        '-crf 23',
        '-c:a copy'
      ])
      .save(outputPath)
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(err.message);
      });
  });
});

const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  convertVideo: (filePath) => ipcRenderer.invoke('convert-video', { filePath }),
  getFilePath: (file) => {
    if (webUtils && webUtils.getPathForFile) {
      return webUtils.getPathForFile(file);
    }
    return file.path;
  }
});

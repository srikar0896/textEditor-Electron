// author: chaitanyachavali
// web: http://chaitanyachavali.com

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
// const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
let window;

function startUp() {
  window = new BrowserWindow({
    width: 1100,
    height: 800
  });
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true,
  }));
  window.webContents.openDevTools();
  window.on('closed', () => {
    window = null;
  });
}

app.on('ready', startUp);

//Mac OS X specific
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
app.on('activate', function () {
  if (window === null) {
    startUp();
  }
})

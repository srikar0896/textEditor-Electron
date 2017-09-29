// author: chaitanyachavali
// web: http://chaitanyachavali.com

const electron = require('electron');
const app = electron.app;
const {ipcMain} = require('electron');
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
let window;
let willQuitApp = false;
var buttons = ["close without saving","save","save as"];
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
  window.on('close', (e) => {
    if(willQuitApp == false){

      e.preventDefault();
      window.webContents.send('checkFileStatus');
      dialog.showMessageBox(window,{ type: 'question', buttons:buttons, message: 'Exit?' }, function (buttonIndex) {
              if(buttonIndex== 1){
                willQuitApp = true;
                window.webContents.send('saveFile');
              }else if(buttonIndex == 2){
                willQuitApp = true;
                window.webContents.send('saveAsNewFile');
              }else{
                willQuitApp = true;
                window.close();
              }
        });
    }

  });
  ipcMain.on("success-file-save",function(event,arg){
    window.close();
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

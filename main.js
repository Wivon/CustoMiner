const { app, BrowserWindow, ipcMain, ipcRenderer, globalShortcut } = require('electron');
const ipc = ipcRenderer
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1040,
    height: 655,
    resizable: true,
    backgroundColor: '#1f1f1f',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    // icon: path.join(__dirname, 'src/img/logoX512.png')
  });

  mainWindow.loadFile('front_ui/index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
    createWindow()
    console.log(`app version: ${app.getVersion()}`)
  
    globalShortcut.register('Alt+CommandOrControl+I', () => {
      mainWindow.webContents.send('goto-main-panel')
      mainWindow.show()
      console.log('app maximazed')
    })
});
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

    // open dev tools 
    mainWindow.webContents.openDevTools()

    // hide menubar  
    mainWindow.setMenu(null)
}

app.on('ready', () => {
    createWindow()
    console.log(`app version: ${app.getVersion()}`)
});
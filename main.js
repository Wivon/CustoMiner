const { app, BrowserWindow, ipcMain, ipcRenderer, globalShortcut } = require('electron');
const ipc = ipcRenderer
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1240,
        height: 720,
        minWidth: 1040,
        minHeight: 620,
        frame: false,
        resizable: true,
        backgroundColor: '#1f1f1f',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        icon: path.join(__dirname, 'assets/icons/CustoMinerICONx128.ico')
    });

    mainWindow.loadFile('front_ui/index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // mainWindow.webContents.openDevTools()
}

ipcMain.on('open-devtools', () => {
    console.log('opening dev tools')
    // open dev tools 
    mainWindow.webContents.openDevTools()
})

ipcMain.on('minimize', () => {
    console.log('app minimized')
    mainWindow.minimize()
})

ipcMain.on('quit', () => {
    console.log('closing app...')
    app.quit()
})

app.on('ready', () => {
    createWindow()
    console.log(`app version: ${app.getVersion()}`)
});
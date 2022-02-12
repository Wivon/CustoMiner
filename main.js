const { app, BrowserWindow, ipcMain, ipcRenderer, globalShortcut } = require('electron');
const ipc = ipcRenderer
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

let OS = ""

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

ipcMain.on('toggle-maximize', () => {
    if (!mainWindow.isMaximized()) {
        mainWindow.maximize()
        console.log('maximized app')
    } else {
        mainWindow.unmaximize()
        console.log('unmaximized app')
    }
})

app.on('ready', () => {
    createWindow()
    console.log(`app version: ${app.getVersion()}`)
});

function getOS() {
    if (process.platform === "win32") {
        return "win"
    } else if (process.platform === "darwin") {
        return "mac"
    } else if (process.platform === "linux") {
        return "lin"
    } else {
        return "unsupported"
    }
}

OS = getOS()

console.log(`OS: ${OS}`)

function loadDefaultMinecraftFolder() {
    
}

loadDefaultMinecraftFolder()
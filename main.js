const { app, BrowserWindow, ipcMain, ipcRenderer, globalShortcut, dialog } = require('electron')
const ipc = ipcRenderer
const { autoUpdater } = require('electron-updater')
const path = require('path')
const log = require('electron-log');
const fs = require('fs')
const childProcess = require('child_process')

autoUpdater.logger = log;
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
        icon: path.join(__dirname, 'assets/icons/CustoMinerICONx512.ico')
    });

    mainWindow.loadFile('front_ui/index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify()
    })
}

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('ready', () => {
    createWindow()
    console.log(`app version: ${app.getVersion()}`)
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})

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

ipcMain.handle('select-folder', () => {
    if (OS == "win") {
        return dialog.showOpenDialog({
            title: "Select Minecraft game directory",
            properties: ['openDirectory', 'dontAddToRecent'],
            defaultPath: process.env.APPDATA
        })
    } else {
        return dialog.showOpenDialog({
            title: "Select Minecraft game directory",
            properties: ['openDirectory']
        })
    }
})

ipcMain.handle('select-file', () => {
    let title = "CustoMiner: Select a file"
    let path
    if (OS == "win") {
        path = dialog.showOpenDialog({
            title: title,
            properties: ['openFile', 'dontAddToRecent']
        })
    } else {
        let path = dialog.showOpenDialog({
            title: title,
            properties: ['openFile']
        })
    }

    return path
})

ipcMain.on('copy-file', (event, args) => {
    args = JSON.parse(args)
    let source = args[0],
        destination = args[1]

    fs.copyFile(source, destination, (err) => {
        if (err) throw err;
        // console.log(`${source} was copied to ${destination}`);
    })
})

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

function getDefaultMinecraftFolderPath() {
    if (OS == "win") {
        return process.env.APPDATA + "\\.minecraft"
    } else if (OS == "lin") {
        return process.env.HOME + "/.minecraft"
    } else {
        return "unsupported"
    }
}

function checkFolder(dir) {
    // check if directory exists
    if (fs.existsSync(dir)) {
        return true
    } else {
        return false
    }
}


ipcMain.handle('game-directory', (event, arg) => {
    const MinecraftFolderExists = checkFolder(getDefaultMinecraftFolderPath())
    return MinecraftFolderExists ? getDefaultMinecraftFolderPath() : "not-detected"
})

// updates
autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
})
autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
})

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall()
})

ipcMain.on('check_updates', () => {
    autoUpdater.checkForUpdatesAndNotify()
})

ipcMain.handle('get-version', (event, arg) => {
    return app.getVersion()
})

autoUpdater.on('download-progress', (progressObj) => {
    // get values
    let bytePerSecond = progressObj.bytesPerSecond
    let dlPercent = progressObj.percent

    // send response
    let response = [bytePerSecond, dlPercent]
    mainWindow.webContents.send('download-progress', JSON.stringify(response));
})

// is dev check
const isDev = process.mainModule.filename.indexOf('app.asar') === -1;

ipcMain.handle('is-dev', () => {
    return JSON.stringify(isDev)
})

// single instance
if (isDev != true) {
    if (!app.requestSingleInstanceLock()) {
        app.quit()
    } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore()
                mainWindow.focus()
            }
        })
    }
}

// view folder in file explorer
function viewFolder(path) {
    childProcess.exec(`start "" ${path}`)
}

ipcMain.on('view-folder', (event, args) => {
    viewFolder(args)
})
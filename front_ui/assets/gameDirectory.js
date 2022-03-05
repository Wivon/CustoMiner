let gameDir

function detectMinecraftDir() {
    ipcRenderer.invoke('game-directory').then(path => {
        if (path != "not-detected") {
            gameDir = path
            localStorage.setItem('gameDir', gameDir)
            document.getElementById('gameDirectoryInput').value = gameDir
            console.log('default minecraft directory detected')
        } else {
            document.getElementById('gameDirectoryInput').focus()
            console.log('CustoMiner can\'t find minecraft directory')
        }
    })
}

if (localStorage.getItem('gameDir') === null) {
    detectMinecraftDir()
} else {
    gameDir = localStorage.getItem('gameDir')
    document.getElementById('gameDirectoryInput').value = gameDir
    console.log('default minecraft directory loaded')
}

function setGameDir(path) {
    gameDir = path
    localStorage.setItem('gameDir', gameDir)
    document.getElementById('gameDirectoryInput').value = gameDir
}

function selectMinecraftFolder() {
    ipcRenderer.invoke('select-folder').then(path => {
        if (path.canceled != true) {
            gameDirPath = path.filePaths
            setGameDir(gameDirPath)
            console.log('new game dir path:' + gameDirPath)
            console.log({ "path": path })
        }
    })
}

function detectMinecraftDirAndOpenPopup(newType) {
    hidePopup()
    detectMinecraftDir()

    setTimeout(() => {
        if (gameDir != "") {
            openAddNewPopup(newType)
        } else {
            sendNotification('Minecraft Directory', 'CustoMiner can\'t find minecraft directory')
        }
    }, 250)
}

document.querySelector("#gameDirectory .actions .input .fileSelector img").onclick = () => {
    selectMinecraftFolder()
}
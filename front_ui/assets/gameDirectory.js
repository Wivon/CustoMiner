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
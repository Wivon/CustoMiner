function openFolder(path) {
    shell.openPath(path)
}

function showFileInExplorer(path) {
    shell.showItemInFolder(path)
}

function copyFile(source, destination) {
    console.log('copy from: ' + addslashes(source) + 'to: ' + destination)
    ipcRenderer.send('copy-file', JSON.stringify([addslashes(source), addslashes(destination)]))
}
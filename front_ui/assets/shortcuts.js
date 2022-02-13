let DEV_SHORTCUTS = true

window.onkeyup = (e) => {
    // dev shortcuts
    if (DEV_SHORTCUTS) {
        if (e.keyCode == 116) {
            window.location.reload()
            console.log('reloading...')
        }
        if (e.keyCode == 123) {
            ipcRenderer.send('open-devtools')
        }
    }
}


document.getElementById('devshortcuts').onclick = () => {
    if (document.getElementById('devshortcuts').checked) {
        DEV_SHORTCUTS = true
        localStorage.setItem('devshortcuts', true)
    } else {
        DEV_SHORTCUTS = false
        localStorage.setItem('devshortcuts', false)
    }
}

// restore dev short
if (localStorage.getItem('devshortcuts') !== null) {
    DEV_SHORTCUTS = JSON.parse(localStorage.getItem('devshortcuts'))
    document.getElementById('devshortcuts').checked = DEV_SHORTCUTS
} else {
    localStorage.setItem('devshortcuts', false)
    DEV_SHORTCUTS = JSON.parse(localStorage.getItem('devshortcuts'))
    document.getElementById('devshortcuts').checked = DEV_SHORTCUTS
}
let ACTIVE_MENU = "HOME"

document.querySelectorAll('.nav .left a').forEach(a => {
    a.onclick = () => {
        openMenu(a)
    }
})

function openMenu(a) {
    if (!a.classList.contains('active') && a.getAttribute('href').slice(1, 2) != "!") {
        document.querySelectorAll('.actions a').forEach(b => {
            if (b == a) {
                a.classList.add('active')
                showMenu(a.getAttribute('href').slice(1), a)
                ACTIVE_MENU = a.getAttribute('href').slice(1).toUpperCase()
            } else {
                b.classList.remove('active')
            }
        })
    } else if (a.getAttribute('href').slice(1, 2) == "!") {
        window[a.getAttribute('href').slice(2)]()
    }
}

function renderActiveMenuIndicator(a = document.querySelector('.nav .left .actions a.active')) {
    // render active menu indicator
    let activeMenuIndicator = document.querySelector('.activeMenuIndicator')
    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = a.getBoundingClientRect(),
        offsetLeft = elemRect.left - bodyRect.left;

    activeMenuIndicator.style.left = offsetLeft + "px"
    activeMenuIndicator.style.width = a.offsetWidth + "px"
}

function showMenu(menuClassName, navElem) {
    document.querySelectorAll('.menu').forEach(menu => {
        if (menu.classList.contains(menuClassName)) {
            if (!menu.classList.contains('active')) {
                menu.classList.add('active')
                setTimeout(() => {
                    menu.style.height = "max-content"
                }, 120)
            }
        } else {
            menu.classList.remove('active')
            setTimeout(() => {
                menu.style.height = "0"
            }, 120)
        }
    })
    renderActiveMenuIndicator(navElem)
}

function highlight(elem) {
    elem.style.transform = "scale(1.025)"
    setTimeout(() => {
        elem.style.transform = "scale(1)"
    }, 400)
}

function saveInput(input) {
    localStorage.setItem(input.getAttribute('name'), input.value)
}

function scrollToElm(elemQuery) {
    document.querySelector(elemQuery).scrollIntoView()
}

// restore game directory input
if (localStorage.getItem('gameDir') !== null) {
    document.querySelector('#gameDirectoryInput').value = localStorage.getItem('gameDir')
}

setTimeout(() => {
    renderActiveMenuIndicator()
}, 200)

window.onload = () => {
    window.scrollTo({ top: 0 });
    setTimeout(() => {
        if (!document.body.classList.contains('reduced-motion')) {
            document.querySelector('.loader').style.transform = 'scale(1.5)'
            document.querySelector('.loader').style.opacity = 0
        }
        setTimeout(() => {
            document.body.classList.remove('loading')
        }, 300)
    }, 1000)
}

// dev tools 
document.getElementById('r-motion').onclick = () => {
    if (document.getElementById('r-motion').checked) {
        document.body.classList.add('reduced-motion')
        localStorage.setItem('r-motion', true)
    } else {
        document.body.classList.remove('reduced-motion')
        localStorage.setItem('r-motion', false)
    }
}

if (localStorage.getItem('r-motion') !== null) {
    document.getElementById('r-motion').checked = JSON.parse(localStorage.getItem('r-motion'))
    if (JSON.parse(localStorage.getItem('r-motion')) == true) {
        document.body.classList.add('reduced-motion')
    }
} else {
    localStorage.setItem('r-motion', false)
    document.getElementById('r-motion').checked = JSON.parse(localStorage.getItem('r-motion'))
}

// nav load animation
setTimeout(() => {
    document.querySelector('.nav').style.transform = 'translateY(0)'
    document.querySelector('.nav').style.opacity = 1
}, 500)

// add backslashes before backslashes for filepaths
function addslashes(string) {
    return string.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
}

function closeCustoMiner() {
    if(UPDATER_STATUS == "UPDATE_AV") {
        openPopup(
            localeTexts.popups.closeCMDuringDownloads.title, 
            localeTexts.popups.closeCMDuringDownloads.text, 
            true,
            '<button class="destructive-btn" onclick="ipcRenderer.send(\'quit\')">close</button onclick="hidePopup()"><button>cancel</cancel>'
        )
    } else {
        ipcRenderer.send('quit')
    }
}
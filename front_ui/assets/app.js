document.querySelectorAll('.actions a').forEach(a => {
    a.onclick = (e) => {
        // e.preventDefault();
        if (!a.classList.contains('active')) {
            document.querySelectorAll('.actions a').forEach(b => {
                if (b == a) {
                    a.classList.add('active')
                    renderActiveMenuIndicator(a)
                    showMenu(a.getAttribute('href').slice(1))
                } else {
                    b.classList.remove('active')
                }
            })
        }
    }
})

function renderActiveMenuIndicator(a = document.querySelector('.nav .left .actions a.active')) {
    // render active menu indicator
    let activeMenuIndicator = document.querySelector('.activeMenuIndicator')
    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = a.getBoundingClientRect(),
        offsetLeft = elemRect.left - bodyRect.left;

    activeMenuIndicator.style.left = offsetLeft + "px"
    activeMenuIndicator.style.width = a.offsetWidth + "px"
}

function showMenu(menuClassName) {
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

// restore game directory input
if (localStorage.getItem('gameDir') !== null) {
    document.querySelector('#gameDirectoryInput').value = localStorage.getItem('gameDir')
}

// restore locale
if (localStorage.getItem('locale') !== null) {
    document.querySelector('.localeSelector').value = localStorage.getItem('locale')
} else {
    localStorage.setItem('locale', 'en')
    document.querySelector('.localeSelector').value = localStorage.getItem('locale')
}

document.getElementById('nextGameDirectory').onclick = () => {
    document.getElementById('addNew').scrollIntoView()
    if (window.innerHeight > 870) {
        highlight(document.querySelector('#addNew'))
    }
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
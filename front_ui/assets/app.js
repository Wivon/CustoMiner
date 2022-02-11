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

function renderActiveMenuIndicator(a=document.querySelector('.nav .left .actions a.active')) {
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
if (localStorage.getItem('gameDirectory') !== null) {
    document.querySelector('#gameDirectoryInput').value = localStorage.getItem('gameDirectory')
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
        document.body.classList.remove('loading')
    }, 2000)
}
document.querySelectorAll('.actions a').forEach(a => {
    a.onclick = (e) => {
        // e.preventDefault();
        if (!a.classList.contains('active')) {
            document.querySelectorAll('.actions a').forEach(b => {
                if (b == a) {
                    a.classList.add('active')
                    renderActiveMenuIndicator(a)
                } else {
                    b.classList.remove('active')
                }
            })
        }
    }
})

function renderActiveMenuIndicator(a) {
    // render active menu indicator
    let activeMenuIndicator = document.querySelector('.activeMenuIndicator')
    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = a.getBoundingClientRect(),
        offsetLeft = elemRect.left - bodyRect.left;

    activeMenuIndicator.style.left = offsetLeft + "px"
    activeMenuIndicator.style.width = a.offsetWidth + "px"
    console.log(offsetLeft + 'px' + " | " + a.style.width + "px | ")
}

function saveInput(input) {
    localStorage.setItem(input.getAttribute('name'), input.value)
}

// restore game directory input
if (localStorage.getItem('gameDirectory') !== null) {
    document.querySelector('#gameDirectoryInput').value = localStorage.getItem('gameDirectory')
}

renderActiveMenuIndicator(document.querySelector('.nav .left .actions a.active'))
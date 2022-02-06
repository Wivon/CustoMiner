document.querySelectorAll('.actions a').forEach(a => {
    a.onclick = (e) => {
        // e.preventDefault();
        if (!a.classList.contains('active')) {
            document.querySelectorAll('.actions a').forEach(b => {
                if (b == a) {
                    a.classList.add('active')

                    // render active menu indicator
                    let activeMenuIndicator = document.querySelector('.activeMenuIndicator')
                    let bodyRect = document.body.getBoundingClientRect(),
                        elemRect = a.getBoundingClientRect(),
                        offsetLeft = elemRect.left - bodyRect.left;

                    activeMenuIndicator.style.left = offsetLeft + "px"
                    activeMenuIndicator.style.width = a.offsetWidth + "px"
                    console.log(offsetLeft + 'px' + " | " + a.style.width + "px | ")
                } else {
                    b.classList.remove('active')
                }
            })
        }
    }
})
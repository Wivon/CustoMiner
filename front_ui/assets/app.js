document.querySelectorAll('.actions a').forEach(a => {
    a.onclick = () => {
        if (!a.classList.contains('active')) {
            document.querySelectorAll('.actions a').forEach(b => {
                if (b == a) {
                    a.classList.add('active')
                } else {
                    b.classList.remove('active')
                }
            })
        }
    }
})
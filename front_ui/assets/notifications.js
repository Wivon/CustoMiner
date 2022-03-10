let notif = document.querySelector('#notification')

function hideNotification() {
    notif.classList.add('hidden-notif')
}

function sendNotification(title, text, openAction = null) {
    notif.classList.remove('hidden-notif')
    // change texts
    notif.querySelector('h3').textContent = title
    notif.querySelector('p').textContent = text

    // reload buttons
    notif.querySelector('.actions .main').replaceWith(notif.querySelector('.actions .main').cloneNode(true));
    if (openAction != null) {
        notif.querySelector('.actions .main').addEventListener('click', () => {
            openAction()
            hideNotification()
        })
        notif.querySelector('.actions .main').style.display = 'block';
    } else {
        notif.querySelector('.actions .main').style.display = 'none';
    }

    // auto hide notif after 30s
    setTimeout(() => {
        hideNotification()
    }, 30000)
}
// restore locale and ask the first time
if (localStorage.getItem('locale') !== null) {
    document.querySelector('.localeSelector').value = localStorage.getItem('locale')
    loadLocaleFile()
} else {
    ipcRenderer.invoke('get-sys-locale').then((sysLocale) => {
        if (sysLocale == 'fr') {
            openPopup('Changer la langue en français ?',
                'Change language to french ?',
                true,
                `<button onclick="changeLocale('fr')">change</button><button class="secondary-btn" onclick="hidePopup(); changeLocale('en')">cancel</button>`
            )
        } else if (sysLocale == 'es') {
            openPopup(
                'Cambiar el idioma a español?',
                'Change language to spanish ?',
                true,
                `<button onclick="changeLocale('es')">change</button><button class="secondary-btn" onclick="hidePopup(); changeLocale('en')">cancel</button>`
            )
        } else {
            changeLocale('en')
        }
    })
}

let toTranslate = document.querySelectorAll("*[translation-id]");

let localeTexts = {}
let localeLoaded = false

function loadLocaleFile(locale = localStorage.getItem('locale')) {
    fetch('assets/locales/' + locale + '.json').then(response => {
        response.json().then(res => {
            localeTexts = res
            setTexts()
        })
    }).catch(error => {
        console.error('Can\'t acces to locale file, try to reinstall CustoMiner', error)
    })
}

function setTexts() {
    // change texts and render
    toTranslate.forEach(elem => {
        let translationID = elem.getAttribute('translation-id')
        setTranslation(translationID, elem)
    })
    renderActiveMenuIndicator()
    tryLoadUpdateSection()
    localeLoaded = true
}

function setTranslation(id, elem, prefix = "") {
    let translation = getDictionnaryItemByStringName(localeTexts, id)
    elem.textContent = prefix + translation;
}

function changeLocale(locale) {
    localStorage.setItem('locale', locale)
    if (popupDisplayed) {
        hidePopup()
    }
    document.querySelector('.localeSelector').value = localStorage.getItem('locale')
    loadLocaleFile()
}

function getDictionnaryItemByStringName(dict, stringName) {
    // get JSON obj with translation id
    let lastObj = dict
    let y = stringName.split('.')

    y.forEach((elem, i) => {
        if (i < y.length) {
            lastObj = lastObj[elem]
        }
    })

    return lastObj;
}
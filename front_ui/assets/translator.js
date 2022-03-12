// restore locale and ask the first time
if (localStorage.getItem('locale') !== null) {
    document.querySelector('.localeSelector').value = localStorage.getItem('locale')
    loadLocaleFile()
} else {
    sysLocale = getSystemLocale()
    if (/^fr\b/.test(sysLocale)) {
        openPopup('Changer la langue en français ?',
            'Change language to french ?',
            true,
            `<button onclick="changeLocale('fr')">change</button><button class="secondary-btn" onclick="hidePopup(); changeLocale('en')">cancel</button>`,
            null,
            false
        )
    } else if (/^es\b/.test(sysLocale)) {
        openPopup(
            'Cambiar el idioma a español?',
            'Change language to spanish ?',
            true,
            `<button onclick="changeLocale('es')">change</button><button class="secondary-btn" onclick="hidePopup(); changeLocale('en')">cancel</button>`,
            null,
            false
        )
    } else {
        changeLocale('en')
    }
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
    RenderAddNewItemsInLibrary()
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

// sys default locale
function getSystemLocale(arr = false) {
    return !arr ? navigator.language : navigator.languages
}
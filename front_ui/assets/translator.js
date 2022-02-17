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
    toTranslate.forEach(elem => {
        let translationID = elem.getAttribute('translation-id')

        setTranslation(translationID, elem)
    })
    renderActiveMenuIndicator()
    tryLoadUpdateSection()
    localeLoaded = true
}

function setTranslation(id, elem) {
    // get JSON obj with translation id
    let lastObj = localeTexts
    let y = id.split('.')
    y.forEach((elem, i) => {
        if (i < y.length) {
            lastObj = lastObj[elem]
        }
    })

    // change texts and render
    elem.textContent = lastObj
}

loadLocaleFile()
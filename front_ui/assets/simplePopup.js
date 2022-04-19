let popupDisplayed = false

function openPopup(title, text, blur = true, buttonsHTML = '<button onclick="hidePopup()" class="Popupbutton">Cancel</button>', imageParams = null, HideWhenClickingOutside = true) {
    document.querySelector('.popup').style.display = 'flex';
    document.querySelector('.popup').style.transition = 'all .3 ease-out';
    document.querySelector('.popup h3').innerHTML = title;
    document.querySelector('.popup p').innerHTML = text;
    document.querySelector('.popup .buttons').innerHTML = buttonsHTML;
    if (imageParams != null) {
        document.querySelector('.popup img').style.display = "block;"
        document.querySelector('.popup img').src = imageParams.path;
        if (imageParams.invert == false) {
            document.querySelector('.popup img').classList.remove('invert');
        } else {
            document.querySelector('.popup img').classList.add('invert');
        }
    } else {
        document.querySelector('.popup img').style.display = "none"
    }
    if (blur == true) {
        document.querySelector('.popupBackground').classList.remove('popHidden')
    }
    popupDisplayed = true
    if (HideWhenClickingOutside) {
        document.querySelector('.popupBackground').setAttribute('onclick', 'hidePopup()')
    } else {
        document.querySelector('.popupBackground').setAttribute('onclick', '')
    }
}

function hidePopup() {
    document.querySelector('.popup').style.transition = 'all .3 ease-out';
    document.querySelector('.popup').style.transform = 'scale(.7)';
    document.querySelector('.popup').style.opacity = '0';

    setTimeout(() => {
        document.querySelector('.popup').style.transform = 'scale(1)';
        document.querySelector('.popup').style.opacity = '1';
        document.querySelector('.popup').style.display = 'none';
    }, 200)

    document.querySelector('.popupBackground').classList.add('popHidden')
    popupDisplayed = false
}
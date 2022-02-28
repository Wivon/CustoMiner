let addNewPopupDisplayed = false
let addNewPopup = document.querySelector('.addnew-popup')


function hideAddNewPopup() {
    addNewPopup.style.transform = 'scale(.9)';
    addNewPopup.style.opacity = '0';

    setTimeout(() => {
        addNewPopup.style.transform = 'scale(1)';
        addNewPopup.style.opacity = '1';
        addNewPopup.style.display = 'none';
    }, 200)
    document.querySelector('.popupBackground').classList.add('popHidden')
    popupDisplayed = false
}

function openPopup(newType) {
    addNewPopup.style.display = 'flex';
    addNewPopup.querySelector('.top h2').innerHTML = "Add new: " + newType;
    popupDisplayed = true
}
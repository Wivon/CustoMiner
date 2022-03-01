let addNewPopupDisplayed = false
let addNewPopup = document.querySelector('.addnew-popup')

const addNewItems = {
    "shaders": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.shaderPacks",
        "image": "banner_shaderpacks_card.png",
        "folderName": "shaderpacks"
    },
    "resourcepacks": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.resourcePacks",
        "image": "banner_resourcespacks_card.png",
        "folderName": "resourcepacks"
    },
    "mods": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.mods",
        "image": "banner_mods_card.png",
        "folderName": "mods"
    },
    "maps": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.maps",
        "image": "banner_mods_card.png",
        "folderName": "saves"
    },
    "screenshots": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.screenshots",
        "image": "banner_screenshots_card.png",
        "folderName": "screenshots"
    },
    "datapacks": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.datapacks",
        "image": "banner_datapacks_card.png",
        "folderName": "$$SelectSave-datapacks"
    }
}


function hideAddNewPopup() {
    addNewPopup.style.transform = 'scale(.9)';
    addNewPopup.style.opacity = '0';

    setTimeout(() => {
        addNewPopup.style.transform = 'scale(1)';
        addNewPopup.style.opacity = '1';
        addNewPopup.style.display = 'none';
    }, 200)
    document.querySelector('.popupBackground-lower').classList.add('popHidden')
    popupDisplayed = false

    // nav
    let popupNavItem = document.querySelector('.nav .left .actions a[href="#!addnew-popup"]')
    popupNavItem.style.transform = "translateY(-100%)"
    popupNavItem.style.opacity = 0
    setTimeout(() => {
        popupNavItem.style.display = 'none';
        popupNavItem.style.transform = "translateY(0)"
        popupNavItem.style.opacity = 1
    }, 500)
    renderActiveMenuIndicator()
    document.querySelectorAll('.nav .left .actions a').forEach(a => {
        if (a != popupNavItem) {
            a.classList.remove('disabled')
        }
    })
}

function openAddNewPopup(newType) {
    // display
    popupDisplayed = true
    addNewPopup.style.display = 'flex';

    // background
    document.querySelector('.popupBackground-lower').classList.remove('popHidden')

    // change texts and images
    setTranslation(addNewItems[newType].name, addNewPopup.querySelector('.top h2'), "Add new: ")
    setTranslation(addNewItems[newType].name, addNewPopup.querySelector('.container .preview span'))
    addNewPopup.querySelector('.container .preview img').src = `assets/img/banners/${addNewItems[newType].image}`;

    // nav
    let popupNavItem = document.querySelector('.nav .left .actions a[href="#!addnew-popup"]')
    // force display when animation is too fast
    popupNavItem.style.display = 'block';
    setTimeout(() => {
        popupNavItem.style.display = 'block';
    }, 500)
    renderActiveMenuIndicator(popupNavItem)
    document.querySelectorAll('.nav .left .actions a').forEach(a => {
        if (a != popupNavItem) {
            a.classList.add('disabled')
        }
    })
}
let addNewPopupDisplayed = false
let addNewPopup = document.querySelector('.addnew-popup')
let addNewCardsContainer = document.querySelector('#addNew .container')

let CURRENT_ITEM

const addNewItems = {
    "shaders": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.shaderPacks",
        "image": "shaders_banner.jpg",
        "folderName": "shaderpacks"
    },
    "mods": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.mods",
        "image": "mods_banner.jpg",
        "folderName": "mods"
    },
    "resourcepacks": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.resourcePacks",
        "image": "resourcepacks_banner.jpg",
        "folderName": "resourcepacks"
    },
    "maps": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.maps",
        "image": "maps_banner.jpg",
        "folderName": "saves"
    },
    "screenshots": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.screenshots",
        "image": "screenshots_banner.jpg",
        "folderName": "screenshots",
        "customBtnText": "menus.homeMenu.sections.addNew.view",
        "hideInLibrary": true
    },
    "datapacks": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.datapacks",
        "image": "datapacks_banner.jpg",
        "folderName": "$$SelectSave-datapacks",
        "hideInLibrary": true
    }
}

class addNewCard extends HTMLElement {
    constructor() {
        super()
    }

    getAddNewItem(returnObj = false) {
        this.addNewItemKey = this.getAttribute('add-new-item-key')
        if (returnObj == true) return addNewItems[this.addNewItemKey]
    }

    translate() {
        this.querySelector('.add .name').textContent = getDictionnaryItemByStringName(localeTexts, this.getAddNewItem(true).name)
        if (this.getAddNewItem(true).customBtnText) {
            this.querySelector('.add button').textContent = getDictionnaryItemByStringName(localeTexts, this.getAddNewItem(true).customBtnText)
        } else {
            this.querySelector('.add button').textContent = localeTexts.common.add
        }
    }

    disable() {
        this.querySelector('.add button').classList.add('disabled')
        this.style.pointerEvents = "none"
        this.style.opacity = .6
    }

    enable() {
        this.querySelector('.add button').classList.remove('disabled')
        this.style.pointerEvents = "auto"
        this.style.opacity = 1
    }

    customAction(HTMLEventAttribute) {
        this.querySelector('.add button').setAttribute('onclick', HTMLEventAttribute)
        this.querySelector('img').setAttribute('onclick', HTMLEventAttribute)
    }

    render() {
        this.innerHTML = `
        <img src="assets/img/banners/${this.getAddNewItem(true).image}" onclick="openAddNewPopup('${this.addNewItemKey}')" alt="mods banner">
        <div class="add">
            <p class="name"></p>
            <button class="addBtn" onclick="openAddNewPopup('${this.addNewItemKey}')"></button>
        </div>`
        this.classList.add('card')
    }
}

customElements.define('add-new-card', addNewCard)

function renderAddNewCards() {
    Object.keys(addNewItems).forEach(item => {
        let newCard = document.createElement('add-new-card')
        newCard.setAttribute('add-new-item-key', item)
        addNewCardsContainer.appendChild(newCard)

        // setup card
        newCard.getAddNewItem()
        newCard.render()

        if (item == 'datapacks') { newCard.disable() }
        if (item == 'screenshots') { newCard.customAction('openScreenshotsFolder()') }
    })
}

renderAddNewCards()


function hideAddNewPopup() {
    addNewPopup.style.transform = 'scale(.9)';
    addNewPopup.style.opacity = '0';

    setTimeout(() => {
        addNewPopup.style.transform = 'scale(1)';
        addNewPopup.style.opacity = '1';
        addNewPopup.style.display = 'none';
    }, 200)
    document.querySelector('.popupBackground-lower').classList.add('popHidden')
    addNewPopupDisplayed = false

    // nav
    let popupNavItem = document.querySelector('.nav .left .actions a[href="#!hideAddNewPopup"]')
    popupNavItem.style.transform = "translateY(-100%)"
    popupNavItem.style.opacity = 0
    setTimeout(() => {
        popupNavItem.style.display = 'none';
        popupNavItem.style.transform = "translateY(0)"
        popupNavItem.style.opacity = 1

        // clear inputs after animation end
        document.querySelectorAll('.addnew-popup input').forEach(a => {
            a.value = ""
        })
    }, 500)
    renderActiveMenuIndicator()
    document.querySelectorAll('.nav .left .actions a').forEach(a => {
        if (a != popupNavItem) {
            a.classList.remove('disabled')
        }
    })

    CURRENT_ITEM = null
}

function openAddNewPopup(newType) {
    if (gameDir != "") {
        // display
        addNewPopupDisplayed = true
        addNewPopup.style.display = 'flex';
        CURRENT_ITEM = newType;

        // background
        document.querySelector('.popupBackground-lower').classList.remove('popHidden')

        // change texts and images
        setTranslation(addNewItems[newType].name, addNewPopup.querySelector('.top h2'), localeTexts.common.add + ": ")
        setTranslation(addNewItems[newType].name, addNewPopup.querySelector('.container .preview span'))
        addNewPopup.querySelector('.container .preview img').src = `assets/img/banners/${addNewItems[newType].image}`;

        // change input labels
        document.querySelector('#selectorLabel').innerHTML = localeTexts.labels.addNew.selectorLabel.replace('{name}', "<span>" + getDictionnaryItemByStringName(localeTexts, addNewItems[newType].name) + "</span>")
        document.querySelector('#newNameLabel').textContent = localeTexts.labels.addNew.newNameLabel

        // nav
        let popupNavItem = document.querySelector('.nav .left .actions a[href="#!hideAddNewPopup"]')
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

        // focus first input
        document.querySelector("#fileSelector").focus()
    } else {
        openPopup(localeTexts.menus.homeMenu.sections.gameDirectory.title,
            'Minecraft directory not found',
            true,
            `<button onclick="detectMinecraftDirAndOpenPopup('${newType}')">${localeTexts.menus.homeMenu.sections.gameDirectory.autoDetect}</button>
        <button onclick="hidePopup(); selectMinecraftFolder()">${localeTexts.common.browse}</button>
        <button class="secondary-btn" onclick="hidePopup()">${localeTexts.common.cancel}</button>`
        )
    }
}

// selecting files
function selectNewFile(input) {
    ipcRenderer.invoke('select-file').then(path => {
        if (path.canceled != true) {
            filepath = path.filePaths
            input.value = filepath

            // change name input
            let src = document.getElementById('fileSelector').value
            let filename = src.split('\\')[src.split('\\').length - 1]

            let extension = filename.split('.').pop()

            filenameWithoutExtension = src.split('\\')[src.split('\\').length - 1].slice(0, this.length - (extension.length + 1))
            console.log(filenameWithoutExtension)


            console.log(filename.split('.').pop())

            document.querySelector('.addnew-popup .container .infos #newFileName').setAttribute('extension', extension)
            document.querySelector('.addnew-popup .container .infos #newFileName').value = filenameWithoutExtension

            // change preview text
            changePreviewName(filename)

            // refresh main action button
            checkAddNewPopupInputs()
        }
    })
}

function changePreviewName(name) {
    if (name == "") {
        document.querySelector('.container .preview span').textContent = getDictionnaryItemByStringName(localeTexts, addNewItems[CURRENT_LIBRARY_VIEW].name)
        return
    }
    if (name.length < 14) {
        document.querySelector('.container .preview span').textContent = name
    } else {
        document.querySelector('.container .preview span').textContent = name.slice(0, 10) + "..."
    }
}

function addFileToMCFolder() {
    let filenameInput = document.querySelector('.addnew-popup .container .infos #newFileName')

    let src = document.getElementById('fileSelector').value
    let MCFolder = gameDir + '\\' + addNewItems[CURRENT_ITEM].folderName
    let destination = MCFolder + '\\' + filenameInput.value + '.' + filenameInput.getAttribute('extension')
    copyFile(src, destination)
    hideAddNewPopup()
}

function checkAddNewPopupInputs() {
    let fileInput = document.querySelector("#fileSelector")
    let newFileNameInput = document.querySelector("#newFileName")
    let popupMainBtn = document.querySelector(".addnew-popup .actions .main-action")

    // remove unallowed file name
    const UNALLOWED = ['/', '\\', '*', '?', '"', "<", ">", "|", '@', "{", '}', '=', '+', '#', '%', '&', '$', '!', '\'', ':', '`']
    UNALLOWED.forEach(x => {
        if (newFileNameInput.value.includes(x)) {
            let oldValue = newFileNameInput.value
            let newValue = oldValue.replace(x, "")
            newFileNameInput.value = newValue
            sendNotification("Removed illegal character", "the character you typed isn't allowed, it has been removed")
        }
    })

    // max 31 characters
    let oldValue = newFileNameInput.value
    let newValue = oldValue.slice(0, 31)
    newFileNameInput.value = newValue

    if (fileInput.value != "" && newFileNameInput.value != "") {
        popupMainBtn.classList.remove('disabled')
        return true
    } else {
        popupMainBtn.classList.add('disabled')
        return false
    }
}

function openScreenshotsFolder() {
    openFolder(gameDir + '\\' + addNewItems.screenshots.folderName)
}

// shortcuts
document.onkeyup = (e) => {
    if (e.keyCode == 27) {
        if (addNewPopupDisplayed == true) {
            hideAddNewPopup()
        }
    }
    if (e.keyCode == 13) {
        if (addNewPopupDisplayed == true && checkAddNewPopupInputs() == true) {
            addFileToMCFolder()
        }
    }
}
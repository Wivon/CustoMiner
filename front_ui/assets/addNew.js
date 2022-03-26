let addNewPopupDisplayed = false
let addNewPopup = document.querySelector('.addnew-popup')
let addNewCardsContainer = document.querySelector('#addNew .container')

let CURRENT_ITEM

const addNewItems = {
    "shaders": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.shaderPacks",
        "image": "shaders_banner.png",
        "folderName": "shaderpacks"
    },
    "resourcepacks": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.resourcePacks",
        "image": "resourcepacks_banner.png",
        "folderName": "resourcepacks"
    },
    "mods": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.mods",
        "image": "mods_banner.png",
        "folderName": "mods"
    },
    "maps": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.maps",
        "image": "maps_banner.png",
        "folderName": "saves"
    },
    "screenshots": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.screenshots",
        "image": "screenshots_banner.png",
        "folderName": "screenshots",
        "hideInLibrary": true
    },
    "datapacks": {
        "name": "menus.homeMenu.sections.addNew.cardsNames.datapacks",
        "image": "datapacks_banner.png",
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
        this.querySelector('.add button').textContent = localeTexts.common.add
    }

    disable() {
        this.querySelector('.add button').classList.add('disabled')
        this.querySelector('img').removeAttribute('onclick')
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
    if (name.length < 14) {
        document.querySelector('.container .preview span').textContent = name
    } else {
        document.querySelector('.container .preview span').textContent = name.slice(0, 10) + "..."
    }
}

function copyFile(source, destination) {
    console.log('copy from: ' + addslashes(source) + 'to: ' + destination)
    ipcRenderer.send('copy-file', JSON.stringify([addslashes(source), addslashes(destination)]))
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

    if (fileInput.value != "" && newFileNameInput.value != "") {
        popupMainBtn.classList.remove('disabled')
    } else {
        popupMainBtn.classList.add('disabled')
    }
}

function openScreenshotsFolder() {
    ipcRenderer.send('view-folder', gameDir + '\\' + addNewItems.screenshots.folderName)
}
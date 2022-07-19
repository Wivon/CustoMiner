let NavFoldersContainer = document.querySelector('.libraryNav .localFolders')
let libraryContainer = document.querySelector('.menu.library')
let libraryAnimationContainer = document.querySelector('.menu.library .container')
let libraryFolderContent = document.querySelector('.menu.library .folderContent')
let CurseforgeContainer = document.querySelector('.menu.library .curseforgeContainer')
let DownloadsContainer = document.querySelector('.menu.library .downloads-container')
let libraryNavItems
let CURRENT_LIBRARY_VIEW
const specialLibraryView = [CurseforgeContainer, DownloadsContainer]

function RenderAddNewItemsInLibrary() {
    // clear old items if there are
    NavFoldersContainer.innerHTML = ""

    // render items
    Object.keys(addNewItems).forEach(item => {
        // detect items that are hidden in library
        let hideInLibrary = false
        if (addNewItems[item].hideInLibrary == true) {
            hideInLibrary = true
        }

        // render those that aren't hiddens
        if (!hideInLibrary) {
            // cut the name if it's too long
            let name = getDictionnaryItemByStringName(localeTexts, addNewItems[item].name)
            let fullName = name
            if (name.length > 10) {
                name = name.slice(0, 10) + "..."
            }

            let newItem = document.createElement('div')
            newItem.classList.add('item')
            newItem.setAttribute('add-new-items-key', item)
            newItem.innerHTML = `
            <div class="icon">
                <img src="assets/img/banners/${addNewItems[item].image}" alt="folder icon">
            </div>
            <div class="infos">
                <p class="name">${name}</p>
                <span>/${addNewItems[item].folderName}</span>
            </div>
            `
            newItem.setAttribute('title', `${fullName} in .minecraft/${addNewItems[item].folderName}`)
            newItem.setAttribute('alt', `${fullName} in .minecraft/${addNewItems[item].folderName}`)
            NavFoldersContainer.appendChild(newItem)
        }
    })

    libraryNavItems = document.querySelectorAll('.libraryNav .item')

    // default focus on first element
    libraryNavItems[0].classList.add('active')
    openView(libraryNavItems[0])

    // add listeners
    addLibraryNavItemsEventListener()
}

function addLibraryNavItemsEventListener() {
    libraryNavItems.forEach(item => {
        item.onclick = () => {
            openView(item)
            closeActionMenu()
        }
    })
}

function openView(item) {
    if (CURRENT_LIBRARY_VIEW != item.getAttribute('add-new-items-key')) {
        // change view in nav
        document.querySelector('.libraryNav .item.active').classList.remove('active')
        item.classList.add('active')

        // render new view
        CURRENT_LIBRARY_VIEW = item.getAttribute('add-new-items-key')
        scrollToTop()
        renderLibraryNavIndicator()
        renderLibraryContainer()

        let titleBx = document.querySelector('h2.title')
        titleBx.style.top = 0
        titleBx.classList.remove('sticky')
    }
}

function renderLibraryNavIndicator(a = document.querySelector('.libraryNav .item.active')) {
    // render active menu indicator
    let activeMenuIndicator = document.querySelector('.libraryNav .indicator')
    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = a.getBoundingClientRect(),
        offsetTop = elemRect.top - bodyRect.top

    activeMenuIndicator.style.top = (offsetTop + 16 - 45) + "px"
    activeMenuIndicator.style.height = (a.offsetHeight - 32) + "px"
}

function renderLibraryContainer() {
    // start animation
    libraryAnimationContainer.classList.add('animate')

    // load view
    if (CURRENT_LIBRARY_VIEW != "curseforge" && CURRENT_LIBRARY_VIEW != "downloads" ) {
        // change title
        libraryContainer.querySelector('h2.title').style.position = "absolute"
        let item = addNewItems[CURRENT_LIBRARY_VIEW]
        let name = getDictionnaryItemByStringName(localeTexts, item.name)
        libraryContainer.querySelector('h2.title').innerHTML = "<span>/" + item.folderName + "</span><br>" + name
        // display folder contents
        libraryFolderContent.style.display = "block"
        // hide others views
        hideSpecialLibraryView()
        // get files and render it.
        renderFolderContentInHTML(item.folderName)
    } else if (CURRENT_LIBRARY_VIEW == "curseforge") {
        // change title
        libraryContainer.querySelector('h2.title').innerHTML = "Curseforge"
        libraryContainer.querySelector('h2.title').style.position = "relative"
        // clear & hide folder content
        libraryFolderContent.innerHTML = ""
        libraryFolderContent.style.display = "none"
        // hide ohters views
        hideSpecialLibraryView()
        CurseforgeContainer.style.display = "block"
        // load curseforge view
        loadCurseforgeView()
    } else {
        // change title
        libraryContainer.querySelector('h2.title').innerHTML = "Downloads"
        libraryContainer.querySelector('h2.title').style.position = "relative"
        // clear & hide folder content
        libraryFolderContent.innerHTML = ""
        libraryFolderContent.style.display = "none"
        // hide others view
        hideSpecialLibraryView()
        DownloadsContainer.style.display = "block"
        // load downloads view
        loadDownloadsView()
    }

}

function hideSpecialLibraryView() {
    specialLibraryView.forEach(view => {
        view.style.display = "none"
    })
}

// render folder content in DOM
function renderFolderContentInHTML(minecraftFolder) {
    listFilesInDirectory(gameDir + '\\' + minecraftFolder).then(response => {
        console.log(response)
        let files = []

        if (response.includes('ENOENT')) {
            libraryFolderContent.innerHTML = `
            <div class="error">
                <span>>__<</span><br><br>Errors:-This folder hasn't been created.<br><br>CustoMiner was looking for ${minecraftFolder}<br>
                <button>create folder</button>
                <br><br>
                <span style="font-size: 18px font-weight: 400;">${e}</span>
            </div>
            `
            console.log('fichtgre')
            
            return
        }

        files = JSON.parse(response)

        if (files.length < 1) {
            libraryFolderContent.innerHTML = `
            <p class="error">
                <span>>__<</span><br><br>Errors:<br>-This folder is empty<br>-it hasn't been created.<br><br>CustoMiner was looking for ${minecraftFolder}<br>
            </p>
            `
        }

        libraryFolderContent.innerHTML = ""

        files.forEach(file => {
            let newItem = document.createElement('section')
            newItem.innerHTML = `
                <h2>${file}</h2>
                <div class="actions">
                    <button title="more options" onclick="openFolderItemActionMenu(this)"><img src="assets/img/icons/details_icon.png"></button>
                    <button title="rename"><img src="assets/img/icons/rename_icon.png"></button>
                    <button title="delete"><img src="assets/img/icons/close_icon.png"></button>
                </div>`
            libraryFolderContent.appendChild(newItem)
        })

        // end animation
        setTimeout(() => {
            libraryAnimationContainer.classList.remove('animate')
        }, 200)
    })
}

function listFilesInDirectory(path) {
    return new Promise((resolve, reject) => {
        ipcRenderer.invoke('list-files', path).then(response => {
            resolve(response)
        })
    })
}

function loadCurseforgeView() {
    // end animation
    setTimeout(() => {
        libraryAnimationContainer.classList.remove('animate')
    }, 200)
}

function loadDownloadsView() {
    // end animation
    setTimeout(() => {
        libraryAnimationContainer.classList.remove('animate')
    }, 200)
}

function openFolderItemActionMenu(FolderItemDOM) {
    if (ACTION_MENU_OPEN === false) {
        let pathToItem = addslashes(gameDir + "\\" + addNewItems[CURRENT_LIBRARY_VIEW].folderName + "\\" + FolderItemDOM.parentElement.parentElement.querySelector('h2').innerHTML)
        openActionMenu(
            [{ 'text': 'Open Folder', 
                'onclick': 'showFileInExplorer(\'' + pathToItem + '\')' 
            }, { 
                'text': 'Open Curseforge', 
                'onclick': '' 
            }], 
            FolderItemDOM
        )
    } else {
        closeActionMenu()
    }
}

// title scroll and sticky
document.onscroll = () => {
    if (CURRENT_LIBRARY_VIEW == "curseforge") return

    if (ACTIVE_MENU == "LIBRARY" && window.scrollY > 80) {
        let titleBx = document.querySelector('h2.title')
        titleBx.classList.add('sticky')
        titleBx.style.top = window.scrollY + "px"
    }
    if (window.scrollY <= 80) {
        let titleBx = document.querySelector('h2.title')
        titleBx.style.top = 0
        titleBx.classList.remove('sticky')
    }
}
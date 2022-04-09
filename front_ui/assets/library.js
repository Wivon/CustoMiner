let NavFoldersContainer = document.querySelector('.libraryNav .localFolders')
let libraryContainer = document.querySelector('.menu.library')
let libraryAnimationContainer = document.querySelector('.menu.library .container')
let libraryFolderContent = document.querySelector('.menu.library .folderContent')
let CurseforgeContainer = document.querySelector('.menu.library .curseforgeContainer')
let libraryNavItems
let CURRENT_LIBRARY_VIEW

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
        renderLibraryNavIndicator()
        renderLibraryContainer()
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
    if (CURRENT_LIBRARY_VIEW != "curseforge") {
        let item = addNewItems[CURRENT_LIBRARY_VIEW]
        let name = getDictionnaryItemByStringName(localeTexts, item.name)
        libraryContainer.querySelector('h2.title').innerHTML = "<span>/" + item.folderName + "</span><br>" + name
        libraryFolderContent.style.display = "block"
        CurseforgeContainer.style.display = "none"
        renderFolderContentInHTML(item.folderName)
    } else {
        libraryContainer.querySelector('h2.title').innerHTML = "Curseforge"
        libraryFolderContent.innerHTML = ""
        libraryFolderContent.style.display = "none"
        CurseforgeContainer.style.display = "block"
        loadCurseforgeView()
    }

}

// render folder content in html
function renderFolderContentInHTML(minecraftFolder) {
    listFilesInDirectory(gameDir + '\\' + minecraftFolder).then(response => {
        let files = JSON.parse(response)

        libraryFolderContent.innerHTML = ""

        files.forEach(file => {
            let newItem = document.createElement('section')
            newItem.innerHTML = `
                <h2>${file}</h2>
                <div class="actions">
                    <button>A</button>
                    <button>B</button>
                    <button>C</button>
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
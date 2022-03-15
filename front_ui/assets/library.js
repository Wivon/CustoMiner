let NavFoldersContainer = document.querySelector('.libraryNav .localFolders')
let libraryContainer = document.querySelector('.menu.library')
let libraryAnimationContainer = document.querySelector('.menu.library .container')
let libraryFolderContent = document.querySelector('.menu.library .folderContent')
let libraryNavItems
let CURRENT_LIBRARY_VIEW

function RenderAddNewItemsInLibrary() {
    // clear old items if there are
    NavFoldersContainer.innerHTML = ""

    // render items
    Object.keys(addNewItems).forEach(item => {
        // detect items that are hidden in library
        let hideInLibrary = false
        if (addNewItems[item].properties) {
            addNewItems[item].properties.forEach(i => {
                if (i == "hideInLibrary") {
                    hideInLibrary = true
                    return
                }
                return
            })
            return
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
    renderLibraryNavIndicator()

    // add listeners
    addLibraryNavItemsEventListener()
}

function addLibraryNavItemsEventListener() {

    libraryNavItems.forEach(item => {
        item.onclick = () => {
            document.querySelector('.libraryNav .item.active').classList.remove('active')
            item.classList.add('active')
            // save current view
            CURRENT_LIBRARY_VIEW = item.getAttribute('add-new-items-key')
            renderLibraryNavIndicator()
            renderLibraryContainer()
        }
    })
}

function renderLibraryNavIndicator(a = document.querySelector('.libraryNav .item.active')) {
    // render active menu indicator
    let activeMenuIndicator = document.querySelector('.libraryNav .indicator')
    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = a.getBoundingClientRect(),
        offsetTop = elemRect.top - bodyRect.top,
        offsetLeft = elemRect.left - bodyRect.left;

    activeMenuIndicator.style.top = (offsetTop + 16) + "px"
    activeMenuIndicator.style.height = (a.offsetHeight - 32) + "px"
}

function renderLibraryContainer() {
    libraryAnimationContainer.classList.add('animate')
    setTimeout(() => {
        console.log('animated')
        libraryAnimationContainer.classList.remove('animate')
    }, 1000)
    libraryAnimationContainer.classList.remove('animate')
    if (CURRENT_LIBRARY_VIEW != "curseforge") {
        let item = addNewItems[CURRENT_LIBRARY_VIEW]
        let name = getDictionnaryItemByStringName(localeTexts, item.name)
        libraryContainer.querySelector('h2.title').innerHTML = "<span>/" + item.folderName + "</span><br>" + name
        renderFolderContentInHTML(item.folderName)
    } else {
        libraryContainer.querySelector('h2.title').innerHTML = "<span>work in progress</span><br>Curseforge"
    }

}

// render folder content in html
function renderFolderContentInHTML(minecraftFolder) {
    let files = listFilesInFolder(gameDir + '\\' + minecraftFolder)
    files = JSON.parse(files)

    libraryFolderContent.innerHTML = ""

    files.forEach(file => {
        let newItem = document.createElement('section')
        newItem.innerHTML = `<h2>${file}</h2>`
        libraryFolderContent.appendChild()
    })
}

function listFilesInFolder(folderPath) {
    let response = ipcRenderer.invoke('list-files', folderPath)
    console.log(response)
    return response
}
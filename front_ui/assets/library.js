let localFoldersContainer = document.querySelector('.libraryNav .localFolders')
let libraryNavItems
let CURRENT_LIBRARY_VIEW

function RenderAddNewItemsInLibrary() {
    // clear old items if there are
    localFoldersContainer.innerHTML = ""

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
            newItem.innerHTML = `
            <div class="icon">
                <img src="assets/img/banners/${addNewItems[item].image}" alt="folder icon">
            </div>
            <div class="infos">
                <p class="name">${name}</p>
                <span>/${addNewItems[item].folderName}</span>
            </div>
            `
            localFoldersContainer.appendChild(newItem)
        }

        // save current view
        CURRENT_LIBRARY_VIEW = item
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
            libraryNavItems.forEach(i => {
                i.classList.remove('active');
            })
            item.classList.add('active')
            renderLibraryNavIndicator()
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
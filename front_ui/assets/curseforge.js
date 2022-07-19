const URL_BASE = 'https://api.curseforge.com'
let MC_VERSIONS_LOADED = false
let MinecraftVersions = []
let MinecraftVersionsSelector = document.querySelector('#gameVersion')
let CurseforgeSearchResultsContainer = document.querySelector('.curseforgeContainer .results')
let searchInput = document.querySelector('#curseforgeSearch .inputs div input')

const headers = {
    'Accept': 'application/json',
    // I know this shouldn't be here, but i don't care it's just a curseforge API key :]
    'x-api-key': '$2a$10$fxKx4A2JuaovI.Jycm1l8.y.HdTZperW5jDDCndKlJr1tx5ELODyG'
};

function fetchApi(urlAndArgs) {
    return new Promise((resolve, reject) => {
        fetch(URL_BASE + urlAndArgs, {
            method: 'GET',
            headers: headers
        })
            .then(res => {
                return res.json()
            }).then(body => {
                resolve(body)
            }).catch(err => reject(err))
    })
}

function getMinecraftVersions() {
    fetchApi('/v1/minecraft/version').then(response => {
        MinecraftVersions = Object.values(response.data)
        MinecraftVersionsSelector.innerHTML = ""

        // create an selector option for each version
        MinecraftVersions.forEach(version => {
            let newVersionOptionInHTMLSelect = document.createElement('option')
            newVersionOptionInHTMLSelect.setAttribute('value', version.versionString)
            newVersionOptionInHTMLSelect.textContent = version.versionString

            // add to DOM
            MinecraftVersionsSelector.appendChild(newVersionOptionInHTMLSelect)
            MC_VERSIONS_LOADED = true
        })
    })
}

function tryLoadVersions() {
    if (MC_VERSIONS_LOADED == true) return
    getMinecraftVersions()
    console.log('getting versions...')
}

function searchOnCurseforge(defaultQuery = null) {
    let query = defaultQuery ?? searchInput.value
    // let type = document.querySelector('#type').value
    let gameVersion = MinecraftVersionsSelector.value


    fetchApi(`/v1/mods/search?gameId=432&searchFilter=${query}&gameVersion=${gameVersion}&classId=6&sortField=6&sortOrder=desc`).then(response => {
        let results = Object.values(response.data)
        if (results.length == 0) {
            // no results
            CurseforgeSearchResultsContainer.innerHTML = `
            <p class="error">
                <span>(´。＿。｀)</span><br><br>Curseforge couldn't find what you were looking for.
            </p>
            `
        } else {
            CurseforgeSearchResultsContainer.innerHTML = ""
            results.forEach((item, index) => {
                // console.log(item)

                let newItem = document.createElement('section')
                if (index === 0) {
                    // first result
                    let screenshotsHTML = ""
                    item.screenshots.forEach((s, i) => {
                        if (i < 3) {
                            screenshotsHTML = `${screenshotsHTML}<img src="${s.url}">`
                        }
                    })

                    newItem.innerHTML = `
                    <h2>
                        <img src=${item.logo.url} class="logo">
                        ${item.name}
                    </h2>
                    <p>${item.summary}</p>
                    <div class="lower">
                        <div class="screenshots">${screenshotsHTML}</div>
                        <div class="actions">
                            <button class="secondary-btn" onclick="shell.openExternal('${item.links.websiteUrl}')">DETAILS</button>
                            <button class="primary-btn" onclick="getModFromCurseforge(${item.id})">DOWNLOAD</button>
                       </div>
                    </div>
                    `
                    if (screenshotsHTML == "") {
                        newItem.classList.add('no-img')
                    }
                    newItem.classList.add('primarySection')
                    CurseforgeSearchResultsContainer.appendChild(newItem)
                } else if (index < 5) {
                    // create horizontal container
                    let horizontalContainer = CurseforgeSearchResultsContainer.querySelector('.horizontalContainer')
                    if (horizontalContainer == null) {
                        horizontalContainer = document.createElement('div')
                        horizontalContainer.classList.add('horizontalContainer')
                        CurseforgeSearchResultsContainer.appendChild(horizontalContainer)
                        horizontalContainer = CurseforgeSearchResultsContainer.querySelector('.horizontalContainer')
                    }
                    // other firsts results | horizontal
                    let screenshotsHTML = ""
                    item.screenshots.forEach((s, i) => {
                        if (i < 3) {
                            screenshotsHTML = `${screenshotsHTML}<img src="${s.url}">`
                        }
                    })

                    newItem.innerHTML = `
                    <img src=${item.logo.url}>
                    <p>${item.name}</p>
                    <div class="actions">
                        <button class="secondary-btn" onclick="shell.openExternal('${item.links.websiteUrl}')"><img src="assets/img/icons/openExt_icon.png" alt="details"></button>
                        <button class="primary-btn" onclick="this.parentNode.parentNode.classList.add('downloading'); getModFromCurseforge(${item.id})"><img src="assets/img/icons/download_icon.png" alt="download"></button>
                    </div>
                    `
                    newItem.classList.add('horizontalSection')
                    horizontalContainer.appendChild(newItem)
                } else {
                    newItem.textContent = item.name
                    CurseforgeSearchResultsContainer.appendChild(newItem)
                }
            })
        }
    }).catch(err => {
        // API error
        CurseforgeSearchResultsContainer.innerHTML = `
        <p class="error">
            <span>>__<</span><br><br>It looks like you're not connected to the internet.<br>${err}
        </p>
        `
    })
}

// fetchApi('/v1/categories?classId=7').then(response => {
//     let results = response.data
//     console.log(results)
// })

function getModFromCurseforge(id) {
    console.log(id)
}

searchInput.onkeydown = (e) => {
    if (e.keyCode === 13) {
        searchOnCurseforge()
    }
}
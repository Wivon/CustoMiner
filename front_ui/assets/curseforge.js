const URL_BASE = 'https://api.curseforge.com'
let MinecraftVersions = []
let MinecraftVersionsSelector = document.querySelector('#gameVersion')
let CurseforgeSearchResultsContainer = document.querySelector('.curseforgeContainer .results')
let searchInput = document.querySelector('#curseforgeSearch .inputs div input')

const headers = {
    'Accept': 'application/json',
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
            })
    })
}

function getMinecraftVersions() {
    fetchApi('/v1/minecraft/version').then(response => {
        MinecraftVersions = Object.values(response.data)

        // create an selector option for each version
        MinecraftVersions.forEach(version => {
            let newVersionOptionInHTMLSelect = document.createElement('option')
            newVersionOptionInHTMLSelect.setAttribute('value', version.versionString)
            newVersionOptionInHTMLSelect.textContent = version.versionString

            // add to DOM
            MinecraftVersionsSelector.appendChild(newVersionOptionInHTMLSelect)
        })
    })
}


function searchOnCurseforge() {
    let query = searchInput.value
    let type = document.querySelector('#type').value
    let gameVersion = MinecraftVersionsSelector.value


    fetchApi(`/v1/mods/search?gameId=432&searchFilter=${query}&gameVersion=${gameVersion}&classId=6&sortField=6&sortOrder=desc`).then(response => {
        let results = Object.values(response.data)

        CurseforgeSearchResultsContainer.innerHTML = ""
        results.forEach((item, index) => {
            let newItem = document.createElement('section')
            if (index === 0) {
                console.log(item)
                let screenshotsHTML = ""
                item.screenshots.forEach((s, i) => {
                    if (i < 3) {
                        screenshotsHTML = `${screenshotsHTML}<img src="${s.url}">`
                    }
                })

                newItem.innerHTML = `
                    <h2>${item.name}</h2>
                    <p>${item.summary}</p>
                    <div class="lower">
                        <div class="screenshots">${screenshotsHTML}</div>
                        <div class="actions">
                            <button class="secondary-btn" onclick="shell.openExternal('${item.links.websiteUrl}')">DETAILS</button>
                            <button class="primary-btn">DOWNLOAD</button>
                       </div>
                    </div>
                `
                newItem.classList.add('primarySection')
            } else {
                newItem.textContent = item.name
            }
            CurseforgeSearchResultsContainer.appendChild(newItem)
        })
    })
}

// fetchApi('/v1/categories?classId=7').then(response => {
//     let results = response.data
//     console.log(results)
// })

searchInput.onkeydown = (e) => {
    if (e.keyCode === 13) {
        searchOnCurseforge()
    }
}

getMinecraftVersions()
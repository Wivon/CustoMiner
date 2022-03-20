const URL_BASE = 'https://api.curseforge.com'
let MinecraftVersions = []
let MinecraftVersionsSelector = document.querySelector('#gameVersion')
let CurseforgeSearchResultsContainer = document.querySelector('library.menu .curseforgeContainer .results')

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
    let query = document.querySelector('#curseforgeSearch .inputs div input').value
    let type = document.querySelector('#type').value
    let gameVersion = MinecraftVersionsSelector.value

    fetchApi(`/v1/mods/search?gameId=432&searchFilter=${query}&gameVersion=${gameVersion}&sortField=6`).then(response => {
        let results = Object.values(response.data)

        results.forEach(i => {
            let newItem = document.createElement('section')
            newItem.textContent = i.name
            CurseforgeSearchResultsContainer.appendChild(newItem)
        })
    })
}

getMinecraftVersions()
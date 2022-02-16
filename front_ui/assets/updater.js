let UPDATER_STATUS = "UTD"

ipcRenderer.on('update_available', () => {
  UPDATER_STATUS = "UPDATE_AV"
})
ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.removeAllListeners('update_downloaded');
  UPDATER_STATUS = "UPDATE_DL"
})

// progress bar
var element = document.querySelector("#updates .actions .progress .displayer")

var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.type === "attributes") {
      let percent = element.getAttribute('value')
      document.querySelector("#updates .actions .progress .percentage").textContent = percent + "%"

      // calc displayer width
      let containerWidth = document.querySelector("#updates .actions .progress").offsetWidth
      element.style.width = percent * containerWidth / 100
      console.log('changing width...', `${percent} ${containerWidth} 100` + percent * containerWidth / 100)
    }
  })
})

observer.observe(element, {
  attributes: true
})

dlProgressObj = []

ipcRenderer.on('download-progress', (event, progress) => {
  dlProgressObj = JSON.parse(progress)
  console.log(progress)
})

function setDownloadProgress(progressArr) {
  // calc
  let speed = Math.round((progressArr[0] / 1000000 + Number.EPSILON) * 100) / 100 + "Mb/s"
  let percent = progressArr[1].slice(0, 3) + '%'

  // display
  document.querySelector('#updates .actions .progress .speed').textContent = speed
  document.querySelector('#updates .actions .progress .displayer').setAttribute('value', percent)
}
// [0] speed
// [1] percent
// [2] downloaded

function loadUpdateSection() {
  let updateSection = document.querySelector('#updates')
  let title = updateSection.querySelector('h2')

  if(UPDATER_STATUS == "UTD") {
    updateSection.classList.add('utd')
    updateSection.classList.remove('u-av')
    updateSection.classList.remove('u-dl')

    // title
    setTranslation('menus.settingsMenu.sections.updates.titles.UTD', title)
  } else if (UPDATER_STATUS == "UPDATE_AV") {
    updateSection.classList.add('u-av')
    updateSection.classList.remove('u-dl')
    updateSection.classList.remove('utd')

    // title
    setTranslation('menus.settingsMenu.sections.updates.titles.downloading', title)
  } else if (UPDATER_STATUS == "UPDATE_DL") {
    updateSection.classList.add('u-dl')
    updateSection.classList.remove('u-av')
    updateSection.classList.remove('utd')

    // title
    setTranslation('menus.settingsMenu.sections.updates.titles.downloaded', title)
  }
}

function tryLoadUpdateSection() {
  if(localeLoaded == true) {
    loadUpdateSection()
    console.log('loading update section')
  } else {
    setTimeout(() => {tryLoadUpdateSection()}, 500)
    console.log('locale not loaded, retrying in 500ms')
  }
}

tryLoadUpdateSection()
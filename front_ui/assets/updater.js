let UPDATER_STATUS = "UTD"

ipcRenderer.on('update_available', () => {
  UPDATER_STATUS = "UPDATE_AV"
  tryLoadUpdateSection()
  if (ACTIVE_MENU != "SETTINGS") {
    sendNotification('New update available !', 'Downloading new update...', () => {
      //open settings
      openMenu(document.querySelector('.nav .left a[href="#settings'))
      setTimeout(() => {
        highlight(document.querySelector('.menu.settings #updates'))
      }, 500)
    })
  }
})
ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.removeAllListeners('update_downloaded');
  UPDATER_STATUS = "UPDATE_DL"
  tryLoadUpdateSection()
  if (ACTIVE_MENU != "SETTINGS") {
    sendNotification('Update downloaded', 'Update will be installed on restart (open to restart)', () => {
      //open settings
      openMenu(document.querySelector('.nav .left a[href="#settings'))
      setTimeout(() => {
        highlight(document.querySelector('.menu.settings #updates'))
      }, 500)
    })
  }
})

// check for updates manually
document.querySelector('#updates .actions .utd .checkUpdates').onclick = () => {
  setTranslation('menus.settingsMenu.sections.updates.titles.checking', document.querySelector('#updates h2'))
  document.querySelector('#updates .actions .utd .checkUpdates').classList.add('disabled')
  document.querySelector('#currentVersion').style.transform = 'translateX(150px)'
  setTimeout(() => {
    document.querySelector('#updates .actions .utd .checkUpdates').classList.remove('disabled')
    document.querySelector('#currentVersion').style.transform = 'translateX(0)'
    tryLoadUpdateSection()
  }, 3000);
}


// progress bar
var element = document.querySelector("#updates .actions .progress .displayer")

var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.type === "attributes") {
      let percent = element.getAttribute('value')
      document.querySelector("#updates .actions .progress .percentage").textContent = percent + "%"

      // calc displayer width
      let containerWidth = document.querySelector("#updates .actions .progress").offsetWidth
      element.style.width = percent * containerWidth / 100 + "px"
    }
  })
})

observer.observe(element, {
  attributes: true
})

dlProgressObj = []

ipcRenderer.on('download-progress', (event, progress) => {
  dlProgressObj = JSON.parse(progress)
  setDownloadProgress(dlProgressObj)
  console.log(progress)
})

function setDownloadProgress(progressArr) {
  // calc
  let speed = Math.round((progressArr[0] / 1000000 + Number.EPSILON) * 100) / 100 + "Mb/s"
  let percent = progressArr[1].toString().slice(0, 4)

  // display
  document.querySelector('#updates .actions .downloading .speed').textContent = speed
  document.querySelector('#updates .actions .downloading .progress .displayer').setAttribute('value', percent)
}

function loadUpdateSection() {
  let updateSection = document.querySelector('#updates')
  let title = updateSection.querySelector('h2')

  if (UPDATER_STATUS == "UTD") {
    updateSection.classList.add('utd')
    updateSection.classList.remove('u-av')

    // title
    setTranslation('menus.settingsMenu.sections.updates.titles.UTD', title)
  } else if (UPDATER_STATUS == "UPDATE_AV") {
    updateSection.classList.add('u-av')
    updateSection.classList.remove('utd')

    // title
    setTranslation('menus.settingsMenu.sections.updates.titles.downloading', title)
  } else if (UPDATER_STATUS == "UPDATE_DL") {
    updateSection.classList.add('u-av')
    updateSection.classList.remove('utd')
    // enable restart btn
    updateSection.querySelector('.actions .downloading button').classList.remove('disabled')
    // clear speed span
    document.querySelector('#updates .actions .downloading .speed').textContent = ""

    // title
    setTranslation('menus.settingsMenu.sections.updates.titles.downloaded', title)
  }
}

function tryLoadUpdateSection() {
  if (localeLoaded == true) {
    loadUpdateSection()
    console.log('loading update section')
  } else {
    setTimeout(() => { tryLoadUpdateSection() }, 750)
    console.log('locale not loaded, retrying in 500ms')
  }
}
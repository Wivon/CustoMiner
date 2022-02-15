ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

// progress bar
var element = document.querySelector("#updates .actions .progress .displayer")

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === "attributes") {
      let percent = element.getAttribute('value')
      document.querySelector("#updates .actions .progress .percentage").textContent = percent + "%"

      // calc displayer width
      let containerWidth = document.querySelector("#updates .actions .progress").offsetWidth
      element.style.width = percent * containerWidth / 100
      console.log('changing width...')
    }
  })
})

observer.observe(element, {
  attributes: true
})
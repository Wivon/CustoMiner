class actionMenu extends HTMLElement {
    constructor() {
        super()
        this.actions = JSON.parse(this.getAttribute('actions'))
        this.blur = this.getAttribute('blur')
        this.x = this.getAttribute('pos-x')
        this.y = this.getAttribute('pos-y')

        this.render()
    }

    render() {
        let content = ""
        this.actions.forEach(action => {
            content += `<button onclick="${action.onclick}">${action.text}</button>`
        })
        this.innerHTML = content
        this.style.right = this.x
        this.style.top = this.y
    }
}

customElements.define('action-menu', actionMenu)

/**
 * 
 * @param {JSON} actions 
 * @param {HTMLElement} trigger 
 * @param {bool} blur 
 */

function openActionMenu(actions, trigger, blur = false) {
    let actionsAttr = JSON.stringify(actions)

    // get trigger position and calc action menu pos
    const rect = trigger.getBoundingClientRect();
    const triggerPosX = rect.left + window.scrollX
    const triggerPosY = rect.top + window.scrollY
    
    const posX = triggerPosX - 200
    const posY = triggerPosY - 200

    // create element in DOM
    let newActionMenu = document.createElement('action-menu')
    newActionMenu.setAttribute('actions', actionsAttr)
    newActionMenu.setAttribute('pos-x', posX)
    newActionMenu.setAttribute('pos-y', posY)
    newActionMenu.setAttribute('blur', blur)

    document.body.appendChild(newActionMenu)
}

openActionMenu()

// action menu test
/* <action-menu actions='[{"text": "cancel", "onclick": "console.log(`test`)"}]' pos-x="40px" pos-y="40px" blur="false"></action-menu> */
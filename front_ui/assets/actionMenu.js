class actionMenu extends HTMLElement {
    constructor() {
        super()
        this.onclick = () => {
            this.destruct()
        }
        closeActionMenu()
    }

    destruct(animation=true) {
        this.remove()
    }

    init() {
        this.actions = JSON.parse(this.getAttribute('actions'))
        this.blur = this.getAttribute('blur')
        this.x = this.getAttribute('pos-x')
        this.y = this.getAttribute('pos-y')
        this.triggerHeight = this.getAttribute('trigger-h')

        this.render()
    }

    setPosition() {
        // body width and height
        let bodyX = document.body.offsetWidth

        // get top and right offset
        const margin = 10

        let ROff = (bodyX - this.x) + margin

        this.style.right = ROff + "px"
        this.style.top = this.y + "px"
    }

    render() {
        let content = ""
        this.actions.forEach(action => {
            content += `<button onclick="${action.onclick}">${action.text}</button>`
        })
        this.innerHTML = content
        this.setPosition()
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

    // get trigger position
    const rect = trigger.getBoundingClientRect();
    const triggerPosX = rect.left + window.scrollX
    const triggerPosY = rect.top + window.scrollY

    // create element in DOM
    let newActionMenu = document.createElement('action-menu')
    newActionMenu.setAttribute('actions', actionsAttr)
    newActionMenu.setAttribute('pos-x', triggerPosX)
    newActionMenu.setAttribute('pos-y', triggerPosY)
    newActionMenu.setAttribute('trigger-h', trigger.offsetHeight)
    newActionMenu.setAttribute('blur', blur)

    document.body.appendChild(newActionMenu)

    newActionMenu.init()
}

function closeActionMenu() {
    document.querySelectorAll('action-menu').forEach(i => {
        i.destruct()
    })
}

// action menu test
/* <action-menu actions='[{"text": "cancel", "onclick": "console.log(`test`)"}]' pos-x="40px" pos-y="40px" blur="false"></action-menu> */
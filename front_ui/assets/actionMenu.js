class actionMenu extends HTMLElement {
    constructor() {
        super()
        this.actions = JSON.parse(this.getAttribute('actions'))
        this.blur = this.getAttribute('blur')
        this.x = this.getAttribute('pos-x')
        this.y = this.getAttribute('pos-y')
        console.log(this.actions)

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

// action menu test
/* <action-menu actions='[{"text": "cancel", "onclick": "console.log(`test`)"}]' pos-x="40px" pos-y="40px" blur="false"></action-menu> */
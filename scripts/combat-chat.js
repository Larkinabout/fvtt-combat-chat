import {
    SETTING,
    COMBAT_CHAT_CLASS,
    COMBAT_CHAT_DICE_TRAY_CLASS,
    HIDE_CHAT_INPUT_CLASS,
    CHAT_ID,
    CHAT_LOG_ID,
    COMBAT_ID,
    TABS_ID,
    ACTIVE_CLASS,
    STYLE_ID
} from './constants.js'
import { registerSettings } from './settings.js'
import { Utils } from './utils.js'

export class CombatChat {
    constructor () {
        this.resizing = false
        this.dragStartRegistered = false
    }

    init () {
        registerSettings()
        this.getSettings()
        this.createStyleElement()
    }

    ready () {
        this.getElements()
        this.addDividerElement()
        this.injectSidebarHook()
        this.registerDragResizeListeners()
        this.updateCombatTrackerStyle()
        this.updateStyleElement()
    }

    getElements () {
        this.chatElement = Utils.getElementById(CHAT_ID)
        this.chatLogElement = Utils.getElementById(CHAT_LOG_ID)
        this.diceTrayElement = Utils.getElementBySelector(`#${CHAT_ID} .dice-tray`)
        this.tabsElement = Utils.getElementById(TABS_ID)
    }

    addDividerElement () {
        this.dividerElement = document.createElement('div')
        this.dividerElement.setAttribute('id', 'combat-chat-divider')
        this.dividerElement.innerHTML = '<div></div>'
        this.dividerElement.addEventListener('pointerdown', () => { this.onStartDrag() })
        this.chatElement.insertBefore(this.dividerElement, this.chatElement.firstChild)
    }

    createStyleElement () {
        const style = document.createElement('style')
        style.setAttribute('id', STYLE_ID)
        document.head.append(style)
        return style
    }

    isScrolledToBottom () {
        if (this.chatLogElement != null) {
            return this.chatLogElement.scrollHeight - this.chatLogElement.offsetHeight === this.chatLogElement.scrollTop
        } else {
            return false
        }
    }

    scrollChatToEnd () {
        if (this.chatLogElement != null && typeof this.chatLogElement.scrollTo === 'function') {
            this.chatLogElement.scrollTo({ top: this.chatLogElement.scrollHeight - this.chatLogElement.offsetHeight })
        }
    }

    updateStyleElement () {
        const tabsHeight = this.tabsElement.offsetHeight
        const chatHeight = Utils.getSetting(SETTING.CHAT_HEIGHT)
        const sidebarHeight = ui.sidebar.element.height()
        const maxHeight = sidebarHeight - tabsHeight - 2
        if (chatHeight != null && chatHeight !== 0) {
            const scrolledToBottom = this.isScrolledToBottom()
            const style = document.getElementById(STYLE_ID)
            if (style !== null) {
                style.innerHTML = `
                    #${CHAT_ID}.${COMBAT_CHAT_CLASS} {
                    flex-grow: 0 !important;
                    flex-shrink: 0 !important;
                    flex-basis: ${chatHeight}px !important;
                    max-height: ${maxHeight}px !important;
                    }
                `
                if (scrolledToBottom) {
                    requestAnimationFrame(() => this.scrollChatToEnd())
                }
            }
        }
    }

    getSettings () {
        this.isDisplayChatLog = Utils.getSetting(SETTING.CHAT_LOG_DISPLAY)
        this.isDisplayChatInput = Utils.getSetting(SETTING.CHAT_INPUT_DISPLAY)
        this.isRestyleDiceTray = Utils.getSetting(SETTING.RESTYLE_DICE_TRAY)
    }

    updateSettings () {
        this.getSettings()
        this.updateCombatTrackerStyle()
    }

    updateCombatTrackerStyle () {
        const activeTab = Utils.getActiveTab()

        if (this.isDisplayChatLog && activeTab === COMBAT_ID) {
            this.chatElement.classList.add(ACTIVE_CLASS, COMBAT_CHAT_CLASS)
            this.diceTrayElement?.classList?.toggle(COMBAT_CHAT_DICE_TRAY_CLASS, this.isRestyleDiceTray)
            this.scrollChatToEnd()
        } else {
            if (activeTab !== CHAT_ID) this.chatElement.classList.remove(ACTIVE_CLASS)
            this.chatElement.classList.remove(COMBAT_CHAT_CLASS)
            this.diceTrayElement?.classList?.remove(COMBAT_CHAT_DICE_TRAY_CLASS)
        }

        this.chatElement.classList.toggle(HIDE_CHAT_INPUT_CLASS, this.isDisplayChatLog && !this.isDisplayChatInput && activeTab === COMBAT_ID)
    }

    injectSidebarHook () {
        const sidebar = ui.sidebar._tabs[0]
        const originalMethod = sidebar.activate
        sidebar.activate = function activateOverride (name, ...rest) {
            originalMethod.call(this, name, ...rest)
            game.combatChat.updateCombatTrackerStyle()
        }
    }

    isInDragArea (event) {
        return event.target === this.dividerElement
    }

    onStartDrag () {
        this.resizing = true
    }

    onDrag (event) {
        if (this.resizing) {
            const newHeight = this.chatElement.offsetHeight - event.movementY
            Utils.setSetting(SETTING.CHAT_HEIGHT, newHeight)
            this.updateStyleElement()
        }
    }

    onStopDrag () {
        if (this.resizing) {
            this.resizing = false
        }
    }

    /**
 * LISTENERS
 */

    registerDragResizeListeners () {
        document.addEventListener('pointermove', (event) => { this.onDrag(event) })
        document.addEventListener('pointerup', (event) => { this.onStopDrag(event) })
        document.addEventListener('pointercancel', (event) => { this.onStopDrag(event) })
    }
}

/**
 * HOOKS
 */

Hooks.on('init', () => {
    game.combatChat = new CombatChat()
    game.combatChat.init()
})

Hooks.on('ready', () => {
    game.combatChat.ready()
})

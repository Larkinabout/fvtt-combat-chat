import { MODULE } from './constants.js'

/**
 * Console logger
 */
export class Logger {
    static info (message, notify = false) {
        if (notify) ui.notifications.info(`${MODULE.NAME} | ${message}`)
        else console.log(`${MODULE.NAME} Info | ${message}`)
    }

    static error (message, notify = false) {
        if (notify) ui.notifications.error(`${MODULE.NAME} | ${message}`)
        else console.error(`${MODULE.NAME} Error | ${message}`)
    }

    static debug (message, data) {
        const isDebug = false
        if (isDebug) {
            if (!data) {
                console.log(`${MODULE.NAME} Debug | ${message}`)
                return
            }
            const dataClone = Utils.deepClone(data)
            console.log(`${MODULE.NAME} Debug | ${message}`, dataClone)
        }
    }
}

export class Utils {
    /**
     * Get active tab
     * @returns {string} The active tab
     */
    static getActiveTab () {
        if (ui.sidebar) {
            return ui.sidebar.activeTab
        } else {
            return null
        }
    }

    /**
     * Get html element by ID
     * @param {string} elementId The element ID
     * @returns {object}         The html element
     */
    static getElementById (elementId) {
        return document.querySelector(`#${elementId}`)
    }

    /**
     * Get html element by selector
     * @param {string} selector The selector
     * @returns {object}        The html element
     */
    static getElementBySelector (selector) {
        return document.querySelector(selector)
    }

    /**
     * Get setting value
     * @public
     * @param {string} key               The setting key
     * @param {string=null} defaultValue The setting default value
     * @returns {*}                      The setting value
     */
    static getSetting (key, defaultValue = null) {
        let value = defaultValue ?? null
        try {
            value = game.settings.get(MODULE.ID, key)
        } catch {
            Logger.debug(`Setting '${key}' not found`)
        }
        return value
    }

    /**
     * Set setting value
     * @public
     * @param {string} key   The setting key
     * @param {string} value The setting value
     */
    static async setSetting (key, value) {
        if (game.settings.settings.get(`${MODULE.ID}.${key}`)) {
            await game.settings.set(MODULE.ID, key, value)
            Logger.debug(`Setting '${key}' set to '${value}'`)
        } else {
            Logger.debug(`Setting '${key}' not found`)
        }
    }
}

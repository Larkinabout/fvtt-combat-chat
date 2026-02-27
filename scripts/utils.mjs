import { MODULE } from "./constants.mjs";

/**
 * Console logger.
 */
export class Logger {
  /**
   * Log an info message.
   * @param {string} message   The message to log
   * @param {boolean} [notify] Whether to display a UI notification
   */
  static info( message, notify = false ) {
    if ( notify ) ui.notifications.info(`${MODULE.NAME} | ${message}`);
    else console.log(`${MODULE.NAME} Info | ${message}`);
  }

  /* -------------------------------------------- */

  /**
   * Log an error message.
   * @param {string} message   The message to log
   * @param {boolean} [notify] Whether to display a UI notification
   */
  static error( message, notify = false ) {
    if ( notify ) ui.notifications.error(`${MODULE.NAME} | ${message}`);
    else console.error(`${MODULE.NAME} Error | ${message}`);
  }

  /* -------------------------------------------- */

  /**
   * Log a debug message.
   * @param {string} message The message to log
   * @param {*} [data]       Optional data to log alongside the message
   */
  static debug( message, data ) {
    const isDebug = false;
    if ( isDebug ) {
      if ( !data ) {
        console.log(`${MODULE.NAME} Debug | ${message}`);
        return;
      }
      const dataClone = foundry.utils.deepClone(data);
      console.log(`${MODULE.NAME} Debug | ${message}`, dataClone);
    }
  }
}

/* -------------------------------------------- */

/**
 * Utility helpers.
 */
export class Utils {
  /**
   * Get the currently active sidebar tab name.
   * @returns {string|null} The active tab name
   */
  static getActiveTab() {
    if ( ui.sidebar ) {
      return ui.sidebar.tabGroups.primary;
    }
    return null;
  }

  /* -------------------------------------------- */

  /**
   * Get an HTML element by its ID.
   * @param {string} elementId The element ID
   * @returns {HTMLElement|null} The HTML element
   */
  static getElementById( elementId ) {
    return document.getElementById(elementId);
  }

  /* -------------------------------------------- */

  /**
   * Get an HTML element by a CSS selector.
   * @param {string} selector The CSS selector
   * @returns {HTMLElement|null} The HTML element
   */
  static getElementBySelector( selector ) {
    return document.querySelector(selector);
  }

  /* -------------------------------------------- */

  /**
   * Get a module setting value.
   * @param {string} key The setting key
   * @param {*} [defaultValue=null] The default value
   * @returns {*} The setting value
   */
  static getSetting( key, defaultValue = null ) {
    let value = defaultValue ?? null;
    try {
      value = game.settings.get(MODULE.ID, key);
    } catch {
      Logger.debug(`Setting '${key}' not found`);
    }
    return value;
  }

  /* -------------------------------------------- */

  /**
   * Set a module setting value.
   * @param {string} key   The setting key
   * @param {*} value      The setting value
   */
  static async setSetting( key, value ) {
    if ( game.settings.settings.get(`${MODULE.ID}.${key}`) ) {
      await game.settings.set(MODULE.ID, key, value);
      Logger.debug(`Setting '${key}' set to '${value}'`);
    } else {
      Logger.debug(`Setting '${key}' not found`);
    }
  }
}

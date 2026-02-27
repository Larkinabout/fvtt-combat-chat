/**
 * Module info.
 * @type {{ ID: string, NAME: string }}
 */
export const MODULE = {
  ID: "combat-chat",
  NAME: "Combat Chat"
};

/* -------------------------------------------- */

/**
 * CSS class applied to the chat element when displayed on the combat tab.
 * @type {string}
 */
export const COMBAT_CHAT_CLASS = "combat-chat";

/* -------------------------------------------- */

/**
 * CSS class applied to hide the chat input area.
 * @type {string}
 */
export const HIDE_CHAT_INPUT_CLASS = "hide-chat-input";

/* -------------------------------------------- */

/**
 * The chat sidebar element ID.
 * @type {string}
 */
export const CHAT_ID = "chat";

/* -------------------------------------------- */

/**
 * The chat scroll container selector.
 * @type {string}
 */
export const CHAT_SCROLL_SELECTOR = ".chat-scroll";

/* -------------------------------------------- */

/**
 * The combat sidebar element ID.
 * @type {string}
 */
export const COMBAT_ID = "combat";

/* -------------------------------------------- */

/**
 * The sidebar tabs element ID.
 * @type {string}
 */
export const TABS_ID = "sidebar-tabs";

/* -------------------------------------------- */

/**
 * The sidebar content element ID.
 * @type {string}
 */
export const SIDEBAR_CONTENT_ID = "sidebar-content";

/* -------------------------------------------- */

/**
 * CSS class indicating an active tab.
 * @type {string}
 */
export const ACTIVE_CLASS = "active";

/* -------------------------------------------- */

/**
 * The ID for the dynamic style element.
 * @type {string}
 */
export const STYLE_ID = `${MODULE.ID}-styles`;

/* -------------------------------------------- */

/**
 * Setting keys.
 * @type {{ CHAT_LOG_DISPLAY: string, CHAT_INPUT_DISPLAY: string, CHAT_HEIGHT: string }}
 */
export const SETTING = {
  CHAT_LOG_DISPLAY: "showChatOnCombatTrackerTab",
  CHAT_INPUT_DISPLAY: "showChatInputInSplitView",
  CHAT_HEIGHT: "chatHeight"
};

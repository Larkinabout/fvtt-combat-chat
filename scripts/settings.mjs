import {
  MODULE,
  SETTING
} from "./constants.mjs";

/**
 * Register settings.
 */
export function registerSettings() {
  game.settings.register(MODULE.ID, SETTING.CHAT_LOG_DISPLAY, {
    name: game.i18n?.localize("combatChat.settings.showChatOnCombatTrackerTab.name"),
    hint: game.i18n?.localize("combatChat.settings.showChatOnCombatTrackerTab.hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => { game.combatChat.updateSettings(); }
  });

  /* -------------------------------------------- */

  game.settings.register(MODULE.ID, SETTING.CHAT_INPUT_DISPLAY, {
    name: game.i18n?.localize("combatChat.settings.showChatInputInSplitView.name"),
    hint: game.i18n?.localize("combatChat.settings.showChatInputInSplitView.hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => { game.combatChat.updateSettings(); }
  });

  /* -------------------------------------------- */

  game.settings.register(MODULE.ID, SETTING.CHAT_HEIGHT, {
    name: "Chat height",
    hint: "Changes the chat window height when displaying it below the combat tracker",
    scope: "client",
    config: false,
    type: Number,
    default: null
  });
}

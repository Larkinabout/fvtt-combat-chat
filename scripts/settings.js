import {
    MODULE,
    SETTING,
    DICE_TRAY_MODULE_ID
} from './constants.js'

export const registerSettings = function () {
    game.settings.register(MODULE.ID, SETTING.CHAT_LOG_DISPLAY, {
        name: game.i18n?.localize('combatChat.settings.showChatOnCombatTrackerTab.name'),
        hint: game.i18n?.localize('combatChat.settings.showChatOnCombatTrackerTab.hint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: () => { game.combatChat.updateSettings() }
    })

    game.settings.register(MODULE.ID, SETTING.CHAT_INPUT_DISPLAY, {
        name: game.i18n?.localize('combatChat.settings.showChatInputInSplitView.name'),
        hint: game.i18n?.localize('combatChat.settings.showChatInputInSplitView.hint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: () => { game.combatChat.updateSettings() }
    })

    if (game.modules?.get(DICE_TRAY_MODULE_ID)?.active) {
        game.settings.register(MODULE.ID, SETTING.RESTYLE_DICE_TRAY, {
            name: game.i18n?.localize('combatChat.settings.restyleDiceTray.name'),
            hint: game.i18n?.localize('combatChat.settings.restyleDiceTray.hint'),
            scope: 'client',
            config: true,
            type: Boolean,
            default: true,
            onChange: () => { game.combatChat.updateSettings() }
        })
    }

    game.settings.register(MODULE.ID, SETTING.CHAT_HEIGHT, {
        name: 'Chat height',
        hint: 'Changes the chat window height when displaying it below the combat tracker',
        scope: 'client',
        config: false, // < Non-UI setting. Adjusted via drag and drop.
        type: Number,
        default: null
    })
}

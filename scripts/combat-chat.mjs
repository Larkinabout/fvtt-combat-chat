import {
  SETTING,
  COMBAT_CHAT_CLASS,
  HIDE_CHAT_INPUT_CLASS,
  CHAT_ID,
  CHAT_SCROLL_SELECTOR,
  COMBAT_ID,
  TABS_ID,
  SIDEBAR_CONTENT_ID,
  ACTIVE_CLASS,
  STYLE_ID
} from "./constants.mjs";
import { registerSettings } from "./settings.mjs";
import { Utils } from "./utils.mjs";

/**
 * The CombatChat application class.
 * Displays the chat log on the combat tracker sidebar tab with a draggable divider.
 */
export class CombatChat {
  constructor() {
    this.resizing = false;
    this.dragStartRegistered = false;
  }

  /* -------------------------------------------- */

  /**
   * Initialise the module.
   */
  init() {
    registerSettings();
    this.getSettings();
    this.createStyleElement();
    Hooks.on("changeSidebarTab", () => {
      this.updateCombatTrackerStyle();
    });
  }

  /* -------------------------------------------- */

  /**
   * Perform setup when the DOM is ready.
   */
  ready() {
    this.getElements();
    this.addDividerElement();
    this.overrideChatNotifications();
    this.registerDragResizeListeners();
    this.updateCombatTrackerStyle();
    this.updateStyleElement();
  }

  /* -------------------------------------------- */

  /**
   * Cache references to key DOM elements.
   */
  getElements() {
    this.chatElement = Utils.getElementById(CHAT_ID);
    this.chatLogElement = this.chatElement.querySelector(CHAT_SCROLL_SELECTOR);
    this.tabsElement = Utils.getElementById(TABS_ID);
  }

  /* -------------------------------------------- */

  /**
   * Create and insert the draggable divider element at the top of the chat container.
   */
  addDividerElement() {
    this.dividerElement = document.createElement("div");
    this.dividerElement.setAttribute("id", "combat-chat-divider");
    this.dividerElement.innerHTML = '<i class="fa-light fa-grip-lines"></i>';
    this.dividerElement.addEventListener("pointerdown", () => { this.onStartDrag(); });
    this.chatElement.insertBefore(this.dividerElement, this.chatElement.firstChild);
  }

  /* -------------------------------------------- */

  /**
   * Create the dynamic style element in the document head.
   * @returns {HTMLStyleElement} The created style element
   */
  createStyleElement() {
    const style = document.createElement("style");
    style.setAttribute("id", STYLE_ID);
    document.head.append(style);
    return style;
  }

  /* -------------------------------------------- */

  /**
   * Whether the chat log is scrolled to the bottom.
   * @returns {boolean} Whether the chat log is scrolled to the bottom
   */
  isScrolledToBottom() {
    if ( this.chatLogElement != null ) {
      return this.chatLogElement.scrollHeight - this.chatLogElement.offsetHeight === this.chatLogElement.scrollTop;
    }
    return false;
  }

  /* -------------------------------------------- */

  /**
   * Scroll the chat log to the bottom.
   */
  scrollChatToBottom() {
    if ( this.chatLogElement != null && typeof this.chatLogElement.scrollTo === "function" ) {
      this.chatLogElement.scrollTo({ top: this.chatLogElement.scrollHeight - this.chatLogElement.offsetHeight });
    }
  }

  /* -------------------------------------------- */

  /**
   * Update the dynamic style element.
   */
  updateStyleElement() {
    const chatHeight = Utils.getSetting(SETTING.CHAT_HEIGHT);
    const sidebarContentElement = document.getElementById(SIDEBAR_CONTENT_ID);
    const maxHeight = sidebarContentElement ? sidebarContentElement.offsetHeight - 2 : 0;
    if ( chatHeight != null && chatHeight !== 0 ) {
      const scrolledToBottom = this.isScrolledToBottom();
      const style = document.getElementById(STYLE_ID);
      if ( style !== null ) {
        style.innerHTML = `
          #${CHAT_ID}.${COMBAT_CHAT_CLASS} {
            flex-grow: 0 !important;
            flex-shrink: 0 !important;
            flex-basis: ${chatHeight}px !important;
            max-height: ${maxHeight}px !important;
          }
        `;
        if ( scrolledToBottom ) {
          requestAnimationFrame(() => this.scrollChatToBottom());
        }
      }
    }
  }

  /* -------------------------------------------- */

  /**
   * Cache the current module settings.
   */
  getSettings() {
    this.isDisplayChatLog = Utils.getSetting(SETTING.CHAT_LOG_DISPLAY);
    this.isDisplayChatInput = Utils.getSetting(SETTING.CHAT_INPUT_DISPLAY);
  }

  /* -------------------------------------------- */

  /**
   * Re-read settings and refresh the combat tracker style.
   */
  updateSettings() {
    this.getSettings();
    this.updateCombatTrackerStyle();
  }

  /* -------------------------------------------- */

  /**
   * Override chat notifications when the chat log is displayed on the combat tracker tab.
   */
  overrideChatNotifications() {
    const original = ui.chat._shouldShowNotifications.bind(ui.chat);
    ui.chat._shouldShowNotifications = ( options ) => {
      if ( ui.sidebar.expanded && Utils.getActiveTab() === COMBAT_ID && this.isDisplayChatLog ) {
        return false;
      }
      return original(options);
    };
  }

  /* -------------------------------------------- */

  /**
   * Ensure the chat input elements are inside .chat-form.
   * Handles the timing edge case where _toggleNotifications moves them to the
   * notifications area before the active tab has updated to "combat".
   */
  embedChatInput() {
    const chatForm = this.chatElement.querySelector(".chat-form");
    const chatControls = document.getElementById("chat-controls");
    const chatMessage = document.getElementById("chat-message");
    if ( chatForm && chatControls && chatMessage && chatMessage.parentElement !== chatForm ) {
      chatForm.append(chatControls, chatMessage);
    }
  }

  /* -------------------------------------------- */

  /**
   * Apply or remove CSS classes on the chat element based on the active tab and settings.
   */
  updateCombatTrackerStyle() {
    const activeTab = Utils.getActiveTab();

    if ( this.isDisplayChatLog && activeTab === COMBAT_ID ) {
      this.chatElement.classList.add(ACTIVE_CLASS, COMBAT_CHAT_CLASS);
      this.embedChatInput();
      this.scrollChatToBottom();
    } else {
      if ( activeTab !== CHAT_ID ) this.chatElement.classList.remove(ACTIVE_CLASS);
      this.chatElement.classList.remove(COMBAT_CHAT_CLASS);
    }

    this.chatElement.classList.toggle(
      HIDE_CHAT_INPUT_CLASS,
      this.isDisplayChatLog && !this.isDisplayChatInput
    );
  }

  /* -------------------------------------------- */

  /**
   * Begin a drag-resize operation.
   */
  onStartDrag() {
    this.resizing = true;
  }

  /* -------------------------------------------- */

  /**
   * Handle pointer movement during a drag-resize.
   * @param {PointerEvent} event The pointer event
   */
  onDrag( event ) {
    if ( this.resizing ) {
      const newHeight = this.chatElement.offsetHeight - event.movementY;
      Utils.setSetting(SETTING.CHAT_HEIGHT, newHeight);
      this.updateStyleElement();
    }
  }

  /* -------------------------------------------- */

  /**
   * End a drag-resize operation.
   */
  onStopDrag() {
    if ( this.resizing ) {
      this.resizing = false;
    }
  }

  /* -------------------------------------------- */

  /**
   * Register pointer listeners for drag-resize behaviour.
   */
  registerDragResizeListeners() {
    document.addEventListener("pointermove", ( event ) => { this.onDrag(event); });
    document.addEventListener("pointerup", () => { this.onStopDrag(); });
    document.addEventListener("pointercancel", () => { this.onStopDrag(); });
  }
}

/* -------------------------------------------- */
/*  Hooks                                       */
/* -------------------------------------------- */

Hooks.on("init", () => {
  game.combatChat = new CombatChat();
  game.combatChat.init();
});

/* -------------------------------------------- */

Hooks.on("ready", () => {
  game.combatChat.ready();
});

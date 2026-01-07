console.log("Service Worker loaded");
import type { TranslationMessage } from "@/types";

// Create the context menu on install and initialize default settings
chrome.runtime.onInstalled.addListener(() => {
  // Initialize default settings on first install
  chrome.storage.sync.get(null, (result) => {
    const defaultSettings = {
      sourceLang: result.sourceLang ?? "en",
      targetLang: result.targetLang ?? "sv",
      voiceMode: result.voiceMode ?? true, // Voice mode enabled by default
      dictionaryMode: result.dictionaryMode ?? true, // Dictionary mode enabled by default
      lightMode: result.lightMode ?? true, // Light mode enabled by default
    };

    //Set the default settings when the extension is installed
    chrome.storage.sync.set(defaultSettings);
  });

  // Create context menus
  chrome.contextMenus.create({
    id: "translate-word",
    title: "Translate marked text",
    contexts: ["selection"], // Show the menu only when text is selected
  });

  chrome.contextMenus.create({
    id: "open-side-panel",
    title: "Open Translation Panel",
    contexts: ["page", "selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // Open side panel
  if (info.menuItemId === "open-side-panel" && tab?.id) {
    chrome.sidePanel.open({ tabId: tab.id });
    return;
  }

  //Sending the marked text to the content script
  if (info.menuItemId === "translate-word" && tab?.id && info.selectionText) {
    const userSettings = await chrome.storage.sync.get([
      "sourceLang",
      "targetLang",
      "voiceMode",
      "dictionaryMode",
      "lightMode",
    ]);

    console.log("User settings:", userSettings);

    chrome.tabs.sendMessage(tab.id, {
      action: "SHOW_TRANSLATION",
      text: info.selectionText,
      length: info.selectionText.length,
      sourceLang: userSettings.sourceLang,
      targetLang: userSettings.targetLang,
      voiceMode: userSettings.voiceMode,
      dictionaryMode: userSettings.dictionaryMode,
      lightMode: userSettings.lightMode,
    } as TranslationMessage);
  }
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "OPEN_SIDE_PANEL" && sender.tab?.id) {
    chrome.sidePanel.open({ tabId: sender.tab.id });
  }
});


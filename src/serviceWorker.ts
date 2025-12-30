

console.log("Service Worker loaded");

// Create the context menu on install and initialize default settings
chrome.runtime.onInstalled.addListener(() => {
  // Initialize default settings on first install
  chrome.storage.sync.get(null, (result) => {
    const defaultSettings = {
      targetLang: result.targetLang ?? "swedish",
      voiceMode: result.voiceMode ?? true, // Voice mode enabled by default
      dictionaryMode: result.dictionaryMode ?? true, // Dictionary mode enabled by default
      lightMode: result.lightMode ?? true, // Light mode enabled by default
    };

    chrome.storage.sync.set(defaultSettings, () => {
      console.log("Default settings initialized:", defaultSettings);
    });
  });

  chrome.contextMenus.create({
    id: "translate-word",
    title: "Translate marked text", // %s byts ut mot markerad text automatiskt
    contexts: ["selection"], // Visa bara menyn när text är markerad
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("Info:", info);
  console.log("Tab:", tab);

  //Sending the marked text to the content script
  if (info.menuItemId === "translate-word" && tab?.id) {
    console.log("Sending message", info.selectionText);
    chrome.tabs.sendMessage(tab.id, {
      action: "SHOW_TRANSLATION",
      text: info.selectionText ?? "",
      length: info.selectionText?.length ?? 0,
    });
  }
});

// For the future when we need to listen for messages from the content script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log("Message:", message);
//   console.log("Sender:", sender);
//   console.log("SendResponse:", sendResponse);
// });

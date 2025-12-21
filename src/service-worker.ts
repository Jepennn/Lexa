// Service Worker (Background Script) for Chrome Extension
// This runs in the background and can handle events, API calls, and message passing

console.log("Service Worker loaded");

// 1. Skapa menyn när extensionen installeras
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate-word",
    title: "Translate marked text", // %s byts ut mot markerad text automatiskt
    contexts: ["selection"], // Visa bara menyn när text är markerad
  });
});

// 2. Lyssna på när någon klickar på vår meny
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "translate-word" && info.selectionText) {
    const textToTranslate = info.selectionText;

    console.log("Användaren vill översätta:", textToTranslate);

    // Här kan du t.ex. öppna en ny flik med Google Translate
    // Eller skicka ett meddelande till ditt Content Script för att visa en popup på sidan
    const url = `https://translate.google.com/?sl=auto&tl=dk&text=${encodeURIComponent(
      textToTranslate
    )}&op=translate`;

    chrome.tabs.create({ url: url });
  }
});

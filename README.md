# Lexa - Chrome Extension

**Lexa** is a privacy-focused Chrome Extension for language learning and translation. It provides offline-capable translations, personal dictionaries, and flashcards, using built-in AI that runs entirely on your local machine.

## 🚀 Key Features

-   **🔒 Local Translation:** Uses on-device AI for private, offline translations.
-   **✨ Contextual Overlay:** Instant translation tooltips for selected text.
-   **📚 Personal Dictionaries:** Save words into custom, color-coded collections.
-   **🧠 Flashcard Practice:** Review your vocabulary with an integrated practice system.
-   **🗣️ Pronunciation:** Built-in text-to-speech support for saved words.

## 🛠️ Tech Stack

-   **Frontend:** React 19, TypeScript, Tailwind CSS v4.
-   **UI Components:** Shadcn UI (Radix UI).
-   **Build System:** Vite.

## 📋 Prerequisites

To run Lexa locally, you need:

1.  **Node.js** (v18 or higher) and **npm**.
2.  **Google Chrome** (Modern version with Built-in AI support).

## 💻 Installation & Local Development

1.  **Clone & Install**
    ```bash
    git clone https://github.com/yourusername/lexa.git
    cd lexa
    npm install
    ```

2.  **Build**
    ```bash
    npm run build
    ```

3.  **Load into Chrome**
    *   Navigate to `chrome://extensions/`.
    *   Enable **Developer mode**.
    *   Click **Load unpacked** and select the project's root folder.

## 📂 Project Structure

```
/src
├── background/      # Service worker and background logic
├── components/      # Shared UI components
├── content/         # Page overlay and translation logic
├── hooks/           # Custom React hooks
├── lib/             # Storage and utility functions
├── popup/           # Extension popup views
└── side-panel/      # Dictionary and Flashcard applications
```

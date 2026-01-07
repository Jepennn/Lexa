// Now import and initialize React (this happens after listener is set up)
import React from "react";
import { createRoot } from "react-dom/client";
import { TooltipTranslation } from "./TooltipTranslation";
import contentStyles from "./content.css?inline";

// Create the host element
const shadowHost = document.createElement("div");
shadowHost.id = "translation-overlay-root";
document.body.appendChild(shadowHost);

// Create Shadow DOM
const shadowRoot = shadowHost.attachShadow({ mode: "open" });

// Create a container inside the shadow root
const shadowContainer = document.createElement("div");
shadowRoot.appendChild(shadowContainer);

// Inject styles into Shadow DOM
const styleSheet = document.createElement("style");
styleSheet.textContent = contentStyles;
shadowRoot.appendChild(styleSheet);

// Render React into the shadow container
createRoot(shadowContainer).render(
  <React.StrictMode>
    <TooltipTranslation />
  </React.StrictMode>
);


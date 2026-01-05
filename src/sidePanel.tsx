import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

createRoot(document.getElementById("root-side-panel")!).render(
  <StrictMode>
    <div>Hello from side panel</div>
  </StrictMode>
);


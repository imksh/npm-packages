import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.js";
import "./index.css";

// HashRouter is required for Electron because the renderer is served via
// the file:// protocol in production, which breaks BrowserRouter's history API.
// Hash-based URLs (#/path) work correctly in both dev and packaged builds.

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SiteDataProvider } from "./contexts/SiteDataContext";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <SiteDataProvider>
          <App />
        </SiteDataProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

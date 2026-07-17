import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const motionIsSupported =
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (motionIsSupported) {
  document.documentElement.classList.add("motion-ready");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

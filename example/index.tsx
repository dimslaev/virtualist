import React from "react";
import { createRoot } from "react-dom/client";
import "./style.scss";
import Example from "./Example";

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Example />
  </React.StrictMode>
);

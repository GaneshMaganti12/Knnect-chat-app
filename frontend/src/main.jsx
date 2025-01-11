import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ChatProvider from "./context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrapping the App component with ChatProvider to provide chat data context throughout the component tree */}
    <ChatProvider>
      <App />
    </ChatProvider>
  </StrictMode>
);

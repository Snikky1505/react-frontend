import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import '@fontsource/manrope';
import '@fontsource/manrope/300.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/700.css';
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)


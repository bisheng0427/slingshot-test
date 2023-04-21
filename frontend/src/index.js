import React from "react";
import ReactDOM from "react-dom";
import App from "./components/layout/app.jsx";
import "rodal/lib/rodal.css";
import "./styles/fonts.scss";
import "./styles/style.scss";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/app";
import { Context, db, storage } from "./firebase";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Context.Provider value={(storage, db)}>
    <App />
  </Context.Provider>
);

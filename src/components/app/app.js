import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../header";
import TodoList from "../todo-list";
import ItemAddForm from "../item-add-form/item-add-form";
import TodoEditing from "../todoEditing";

import "./app.css";

/**
 * Основной комнонент приложения
 * - Осуществляет роутинг по приложению
 *
 * @constructor
 * @returns {JSX.Element}
 */
function App() {
  const [isNight, setIsNight] = useState(false);
  const styleMain = isNight ? "app dark" : "app";
  const styleIcon = isNight ? "fas fa-sun" : "fas fa-moon";
  return (
    <main className={styleMain}>
      <button className="night-mode" onClick={() => setIsNight(!isNight)}>
        <i className={styleIcon}></i>
      </button>

      <Router basename="/todo-list">
        <Header />
        <div className="body">
          <Routes>
            <Route
              exact
              path="/"
              element={
                <div>
                  <TodoList />
                  <ItemAddForm />
                </div>
              }
            />

            <Route path="/todo/:id/" element={<TodoEditing />} />
            <Route path="/create" element={<ItemAddForm />} />
          </Routes>
        </div>
      </Router>
    </main>
  );
}

export default App;

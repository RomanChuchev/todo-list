import React from "react";
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
  return (
    <div className="app">
      <Router>
        <Header />
        <div className="body">
          <Routes>
            <Route
              exact
              path="/todo"
              element={
                <div>
                  <TodoList />
                  <ItemAddForm />
                </div>
              }
            />

            <Route path="/todo/:id/" element={<TodoEditing />} />
            <Route path="/todo/create/" element={<ItemAddForm />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

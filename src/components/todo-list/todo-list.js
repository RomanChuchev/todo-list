import React from "react";
import TodoListItem from "../todo-list-item";
import { db } from "../../firebase";
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Spinner from "../spinner";

import "./todo-list.css";

/**
 * Список задач
 * - Создает элементы списка с помощью итерации методом map() по массиву данных полученных с сервера
 *
 * @returns {JSX.Element} - список задач
 * @constructor
 */
const TodoList = () => {
  // Получение данных с сервера
  const [data] = useCollectionData(collection(db, "data"));

  return (
    <ul className="todo-list">
      {data ? (
        <div>
          {data.length === 0 ? (
            <div style={{ marginTop: 40 }}></div>
          ) : (
            data.map((todo, index) => (
              <li key={todo.key} className="todo-item">
                <TodoListItem index={index + 1} key={todo.key} todo={todo} />
              </li>
            ))
          )}
        </div>
      ) : (
        <div className="loader">
          <Spinner color="secondary" />
        </div>
      )}
    </ul>
  );
};

export default TodoList;

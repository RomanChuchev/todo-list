import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import { Link } from "react-router-dom";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import Timer from "../Timer";
import { db, storage } from "../../firebase";

import "./todo-list-item.css";

/**
 * Функция форматирования времени
 * Принимает время формата UNIX и возвращает формат YYYY-MM-DD HH:MM
 *
 * @param {number} unix_timestamp - Время в формате UNIX
 * @returns {string} - Время в формате YYYY-MM-DD HH:MM
 */
const formattedTime = (unix_timestamp) => {
  let date = new Date(unix_timestamp * 1000).toISOString().substring(0, 16);
  return `${date.split("T")[0]} ${date.split("T")[1]}`;
};

/**
 * Реакт компонент элемента списка дел
 * @constructor
 * @param {object} todo - Данные текущей задачи
 * @returns {JSX.Element} - Возвращает элемент списка дел, который включает в себя название, описание, фотографию, время до окончания и кнопки управления
 */
function TodoListItem({ todo }) {
  const [url, setUrl] = useState("");

  const docRef = doc(db, "data", todo.key);
  const imgRef = ref(storage, `images/${todo.fileName}`) || null;

  useEffect(() => {
    if (todo.fileName) {
      getDownloadURL(ref(storage, `images/${todo.fileName}`)).then((url) => {
        setUrl(url);
      });
    }
  }, [todo.complete, todo.fileName]);

  /**
   * Функция, которая позволяет отметить пост как "выполненный"
   * @returns {Promise<void>}
   * @example
   * async function completeTodo() {
   * await updateDoc(docRef, { complete: !todo.complete });
   * }
   */
  async function completeTodo() {
    await updateDoc(docRef, { complete: !todo.complete });
  }

  /**
   * Функция, которая позволяет удалять пост
   * @returns {Promise<void>}
   * @example
   * async function deleteTodo() {
   * await deleteDoc(docRef);
   * await deleteObject(imgRef);
   * }
   */
  async function deleteTodo() {
    await deleteDoc(docRef);
    if (imgRef != null && imgRef._location.path_.length > 7) {
      await deleteObject(imgRef);
    }
  }

  return (
    <div className="todo-list-item">
      {todo.complete ? (
        <>
          <div className="complete-wrapper">
            <div className="todo-list-item__title">{todo.title}</div>

            <div className="btn-wrapper">
              <Link
                onClick={completeTodo}
                className="btn btn-success"
                to={`/todo/${todo.id}/`}
              >
                <i className="fa fa-refresh"></i>
              </Link>

              <button
                onClick={() => deleteTodo()}
                type="button"
                className="btn btn-danger"
              >
                <i className="fa fa-trash-o" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="todo-item__container">
            {url && (
              <img
                className="todo-list-item__images"
                src={url}
                alt="images-from-user"
              />
            )}
            <div className="todo-item__wrapper">
              <div>
                <div className="todo-list-item__title">{todo.title}</div>
                <div className="todo-list-item__description">
                  {todo.description ?? todo.description}
                </div>
              </div>
            </div>
            <div className="settings__wrapper">
              <div className="btn-wrapper">
                <button
                  onClick={completeTodo}
                  type="button"
                  className="btn btn-success"
                >
                  <i className="fa fa-check-square-o"></i>
                </button>

                <Link className="btn btn-primary" to={`/todo/${todo.id}/`}>
                  <i className="fa fa-pencil"></i>
                </Link>

                <button
                  onClick={() => deleteTodo()}
                  type="button"
                  className="btn btn-danger"
                >
                  <i className="fa fa-trash-o" />
                </button>
              </div>
              <div className="settings__time">
                До окончания:
                <div style={{ color: "blueviolet", marginLeft: 10 }}>
                  <Timer
                    time={todo.dateCompletion}
                    docRef={docRef}
                    complete={todo.complete}
                  />
                </div>
              </div>
              <div className="settings__time">
                <span>Последнее обновление:</span>
                <div
                  className="sittings__formatted"
                  style={{ color: "blueviolet", marginLeft: 5 }}
                >
                  {formattedTime(todo.createdAt.seconds)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TodoListItem;

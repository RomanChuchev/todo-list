import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import { Link } from "react-router-dom";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import Timer from "../Timer";
import { db, storage } from "../../firebase";

import style from "./todo-list-item.module.css";

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
    <div className={style.item}>
      {todo.complete ? (
        <>
          <div className={style.completeWrapper}>
            <div className={style.item__title}>{todo.title}</div>

            <div className={style.btnWrapper}>
              <Link
                onClick={completeTodo}
                className={style.success}
                to={`/todo/${todo.id}/`}
              >
                <i className="fa fa-refresh"></i>
              </Link>

              <button
                onClick={() => deleteTodo()}
                type="button"
                className={style.danger}
              >
                <i className="fa fa-trash-can" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={style.container}>
            {url && (
              <img
                className={style.item__images}
                src={url}
                alt="images-from-user"
              />
            )}
            <div className={style.wrapper}>
              <div>
                <div className={style.item__title}>{todo.title}</div>
                <div className={style.item__description}>
                  {todo.description ?? todo.description}
                </div>
              </div>
            </div>
            <div className={style.settings}>
              <div className={style.btnWrapper}>
                <button
                  onClick={completeTodo}
                  type="button"
                  className={style.success}
                >
                  <i className="fa fa-check"></i>
                </button>

                <Link className={style.primary} to={`/todo/${todo.id}/`}>
                  <i className="fa fa-pencil"></i>
                </Link>

                <button
                  onClick={() => deleteTodo()}
                  type="button"
                  className={style.danger}
                >
                  <i className="fa fa-trash-can"></i>
                </button>
              </div>
              <div className={style.settings__time}>
                <div className={style.timer}>
                  <i className="fa-regular fa-clock"></i>
                  <Timer
                    time={todo.dateCompletion}
                    docRef={docRef}
                    complete={todo.complete}
                  />
                </div>
              </div>
              <div className={style.timer}>
                <span>Последнее обновление:</span>
                {formattedTime(todo.createdAt.seconds)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TodoListItem;

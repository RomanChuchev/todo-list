import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, Timestamp, doc, updateDoc } from "firebase/firestore";
import Spinner from "../spinner";
import { v4 } from "uuid";
import { storage, db } from "../../firebase";

import "./TodoEditing.css";

/**
 * Реакт компонент редактирования задачи
 * В компоненте отображаются текущие данные поста, которые можно отредактировать
 * @constructor
 * @returns {JSX.Element}
 */
const TodoEditing = () => {
  // Инициализация
  const [update, setUpdate] = useState(0);
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [todo, setTodo] = useState({});
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data] = useCollectionData(collection(db, "data"));
  const params = useParams();
  const navigate = useNavigate();
  const goHome = () => navigate("/");

  // Получение файла
  useEffect(() => {
    if (data) {
      data.map((todo) => {
        if (Number(params.id) === todo.id) {
          if (todo.title) setTitle(todo.title);

          if (todo.dateCompletion) {
            const timeDate = new Date(todo.dateCompletion.seconds * 1000);
            timeDate.setHours(timeDate.getHours() + 3);
            setTime(timeDate.toISOString().substring(0, 16));
          }
          if (todo.description) setDescription(todo.description);
          if (todo.fileName) {
            setImage(todo.fileName);
            if (todo.fileName) {
              getDownloadURL(ref(storage, `images/${todo.fileName}`)).then(
                (url) => {
                  setUrl(url);
                }
              );
            }
          }
          return setTodo(todo);
        } else {
          return <h1>Ничего не найдено</h1>;
        }
      });
    }
  }, [data, update, params.id]);

  /**
   * Функция создания обновленной версии поста и его загрузки на сервер
   * @param {object} e - событие
   * @returns {Promise<void>}
   */
  async function writeNewPost(e) {
    e.preventDefault();

    // Создание даты
    const date = Timestamp.fromDate(new Date());
    const timeNew = Timestamp.fromDate(new Date(time));
    if (timeNew < date) {
      return alert("Дата завершения не может быть в прошлом");
    }

    if (!title) {
      return alert("Пожалуйста заполните название!");
    }
    setLoading(true);

    // Добавление фотографии
    let imageName = image;
    if (newImage) {
      imageName = newImage.name + v4();
      const imgRef = ref(storage, `images/${imageName}`);
      await uploadBytes(imgRef, newImage);
    }

    // Обновление задачи
    const updateTodo = {
      title,
      description,
      dateCompletion: timeNew,
      createdAt: Timestamp.fromDate(new Date()),
      fileName: imageName,
    };

    const docRef = doc(db, "data", todo.key);

    await updateDoc(docRef, updateTodo).then(() => {
      setLoading(false);
      goHome();
    });
    setUpdate(update + 1);
  }

  // Создание превью для нового изображения

  const [previewImg, setPreviewImg] = useState([]);
  useEffect(() => {
    if (newImage) {
      setPreviewImg(URL.createObjectURL(newImage));
    }
  }, [newImage]);

  return (
    <div className="new-post__container">
      {!data ? (
        <div className="loader">
          <Spinner color="secondary" />
        </div>
      ) : (
        <>
          {loading ? (
            <div className="loading">
              <div style={{ color: "blueviolet" }}>Обновляем задачу</div>
              <div className="loader">
                <Spinner color="secondary" />
              </div>
            </div>
          ) : (
            <form className="item-add-form">
              <h2>Редактировать</h2>
              <div className="row">
                <div className="form-item col-6">
                  <label htmlFor="formTitle" className="form__label">
                    Название:
                  </label>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    className="form-control form__title"
                    id="formTitle"
                    placeholder="Название"
                    value={title}
                  />
                </div>
                <div className="form-item col-6">
                  <label htmlFor="formTime" className="form__label">
                    Время:
                  </label>
                  <input
                    onChange={(e) => setTime(e.target.value)}
                    type="datetime-local"
                    name="datetime"
                    className="form-control form__time"
                    value={time}
                  />
                </div>
              </div>{" "}
              <label htmlFor="formDescription" className="form__label">
                Описание:
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Описание"
                id="formDescription"
                className="col-12 form-control form__description"
              ></textarea>
              <div className="form__button-wrapper">
                <div className="file">
                  <div className="file__item">
                    <input
                      id="formImage"
                      accept=".jpg, .png, .gif"
                      type="file"
                      name="image"
                      className="file__input"
                      onChange={(e) => setNewImage(e.target.files[0])}
                    />
                    <div className="file__button">Прикрепить фото</div>
                  </div>
                </div>
                {newImage ? (
                  <div className="file__preview">
                    <img width={300} src={previewImg} alt="uploud" />
                    <i
                      onClick={() => setNewImage(null)}
                      className="fa fa-times"
                    ></i>
                  </div>
                ) : image ? (
                  <div className="file__preview">
                    <img width={300} src={url} alt="uploud" />
                    <i
                      onClick={() => setImage(null)}
                      className="fa fa-times"
                    ></i>
                  </div>
                ) : null}
                <button
                  onClick={writeNewPost}
                  type="button"
                  className="btn form__btn"
                >
                  Изменить
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default TodoEditing;

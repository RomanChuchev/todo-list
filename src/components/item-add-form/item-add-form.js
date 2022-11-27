import React, { useState, useEffect } from "react";
import "./item-add-form.css";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import Spinner from "../spinner";
import { useNavigate } from "react-router-dom";

/**
 * Форма для создания поста
 * Содержит форму с полями:
 * - Название
 * - Время до конца выполнения
 * - Описание
 * - Кнокпу прикрепления фотографии
 * - Кнопку добавления задачи
 * @returns {JSX.Element}
 * @constructor
 */
function ItemAddForm() {
  const timeDate = new Date();
  timeDate.setHours(timeDate.getHours() + 3);
  const [time, setTime] = useState(timeDate.toISOString().substring(0, 16));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewImg, setPreviewImg] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const goHome = () => navigate("/todo");

  /**
   * Функция отправки задачу на сервер
   * Осуществляет:
   * - Проверку на валидность
   * - Отправку картинки и задачи
   * - Очистку полей
   * @param {object} e - событие
   */
  const onSubmit = async (e) => {
    e.preventDefault();

    // Создание даты
    const date = Timestamp.fromDate(new Date());
    const timeNew = Timestamp.fromDate(new Date(time));
    if (timeNew < date) {
      return alert("Дата завершения не может быть в прошлом");
    }

    if (!title) {
      return alert("Пожалуйста заполните название");
    }
    setLoading(true);

    // Генерация ключа
    const key = v4();

    // Отправка изображения
    let imageName = "";
    if (image) {
      imageName = image.name + key;
      const imgRef = ref(storage, `images/${imageName}`);
      await uploadBytes(imgRef, image);
    }

    // Создание списка дел
    const newTodo = {
      id: date.seconds,
      key,
      title,
      dateCompletion: timeNew,
      description,
      createdAt: date,
      complete: false,
      fileName: imageName,
      filtering: "all",
    };

    // Отправка названия и описания
    await setDoc(doc(collection(db, "data"), key), newTodo).then(() =>
      goHome()
    );

    // Очистка полей
    setTitle("");
    setDescription("");
    setImage(null);
    const timeDate = new Date();
    timeDate.setHours(timeDate.getHours() + 3);
    setTime(timeDate.toISOString().substring(0, 16));
    setLoading(false);
  };

  // Создание превью изображения
  useEffect(() => {
    if (image) {
      setPreviewImg(URL.createObjectURL(image));
    }
  }, [image]);

  return (
    <>
      {loading ? (
        <div className="loading">
          <div style={{ color: "blueviolet" }}>Добавляем задачу</div>
          <div className="loader">
            <Spinner color="secondary" />
          </div>
        </div>
      ) : (
        <form className="item-add-form" onSubmit={onSubmit}>
          <h2>Добавить задачу</h2>
          <div className="row">
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="form-control col-6 form__title"
              placeholder="Название"
              value={title}
            />
            <input
              onChange={(e) => setTime(e.target.value)}
              type="datetime-local"
              name="datetime"
              className="form-control col-6 form__time"
              value={time}
            />
          </div>{" "}
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Описание"
            className="form-control"
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
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <div className="file__button">Прикрепить фото</div>
              </div>
            </div>
            {image ? (
              <div className="file__preview">
                <img width={300} src={previewImg} alt="uploud" />
                <i onClick={() => setImage(null)} className="fa fa-times"></i>
              </div>
            ) : null}

            <button onClick={onSubmit} type="button" className="btn form__btn">
              Добавить
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default ItemAddForm;

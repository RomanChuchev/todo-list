import React from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo_platform.svg";
import style from "./header.module.css";

/**
 * Шапка приложения
 * Содержит:
 * 1. Логотип
 * 2. Заголовок приложения
 * 3. Ссылки на страницы:
 *    - todo (список всех задач),
 *    - create (создание новой задачи)
 *
 * @constructor
 * @returns {JSX.Element}
 */
const Header = () => {
  return (
    <div className={style.header}>
      <div className={style.header__img}>
        <a href="https://womanup.online/" target="_blank" rel="noreferrer">
          <img height="40" src={logo} alt="Womanup" />
        </a>
      </div>
      <div className={style.header__title}>
        <Link to={"/todo"}>
          <h2> Список дел</h2>
        </Link>
      </div>
      <div className={style.header__wrapper}>
        <Link to={"/todo"}>
          <span className={style.header__count}>
            <i className="fa fa-list"></i>
          </span>
        </Link>
        <Link to={"/todo/create"}>
          <span className={style.header__count}>
            <i className="fa fa-plus"></i>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Header;

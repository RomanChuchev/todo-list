import React from "react";

import "./spinner.css";

/**
 * Спиннер
 * Указывает состояние загрузки компонента или страницы
 * @returns  {JSX.Element} - Спиннер
 */
const Spinner = () => {
  return (
    <div className="lds-css">
      <div className="lds-double-ring">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;

import React, { useEffect, useState } from "react";
import { Timestamp, updateDoc } from "firebase/firestore";

/**
 * Таймер формата "DD д. hh:mm:ss"
 * По истечении времени помечает задачу выполненной
 *
 * @constructor
 * @param {string} time - Время таймера
 * @param {object} docRef - Ссылка на документ
 * @param {boolean} complete - Состояние поста (выполняется / выполнен)
 * @returns {JSX.Element}
 * @example
 * const [[d, h, m, s], setTime] = useState([days, hours, min, sec]);
 * const tick = () => {
 *   if (d === 0 && h === 0 && m === 0 && s === 0) {
 *     completeTodo();
 *   } else if (h === 0 && m === 0 && s === 0) {
 *     setTime([d - 1, 23, 59, 59]);
 *   } else if (m === 0 && s === 0) {
 *     setTime([d, h - 1, 59, 59]);
 *   } else if (s === 0) {
 *     setTime([d, h, m - 1, 59]);
 *   } else {
 *     setTime([d, h, m, s - 1]);
 *   }
 * };
 */
const Timer = ({ time, docRef, complete }) => {
  // По истечении времени помечает задачу
  async function completeTodo() {
    await updateDoc(docRef, { complete: !complete });
  }
  const timeNow = Timestamp.fromDate(new Date());

  let sec = time.seconds - timeNow.seconds;
  let min = 0;
  let hours = 0;
  let days = 0;

  if (sec > 86400) {
    days = Math.floor(sec / 86400);
    sec = sec % 86400;
  }
  if (sec > 3600) {
    hours = Math.floor(sec / 3600);
    sec = sec % 3600;
  }
  if (sec > 60) {
    min = Math.floor(sec / 60);
    sec = sec % 60;
  }

  const [[d, h, m, s], setTime] = useState([days, hours, min, sec]);

  const tick = () => {
    if (d === 0 && h === 0 && m === 0 && s === 0) {
      completeTodo();
    } else if (h === 0 && m === 0 && s === 0) {
      setTime([d - 1, 23, 59, 59]);
    } else if (m === 0 && s === 0) {
      setTime([d, h - 1, 59, 59]);
    } else if (s === 0) {
      setTime([d, h, m - 1, 59]);
    } else {
      setTime([d, h, m, s - 1]);
    }
  };

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  });

  return (
    <div>
      <p>{`${d > 0 ? d + " дн." : ""} ${
        h > 0 ? h.toString().padStart(2, "0") + ":" : ""
      }${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`}</p>
    </div>
  );
};

export default Timer;

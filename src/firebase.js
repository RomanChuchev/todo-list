import { createContext } from "react";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3pJaX1WP0-RjAbrWx8pOhQE4a0fFQHEo",
  authDomain: "womanup-b7a80.firebaseapp.com",
  projectId: "womanup-b7a80",
  storageBucket: "womanup-b7a80.appspot.com",
  messagingSenderId: "618485420877",
  appId: "1:618485420877:web:98a4f7df26cc93c1341d04",
  measurementId: "G-GHLM2FHBNP",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация Cloud Firestore и получение ссылки на сервис
export const db = getFirestore(app);

// Получение корзины(bucket) по умолчанию из пользовательского firebase.app.App
export const storage = getStorage(app);

// Создание контекста
export const Context = createContext(null);

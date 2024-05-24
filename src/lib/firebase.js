// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "charlie-chat-app-b5f5f.firebaseapp.com",
  projectId: "charlie-chat-app-b5f5f",
  storageBucket: "charlie-chat-app-b5f5f.appspot.com",
  messagingSenderId: "41889521498",
  appId: "1:41889521498:web:789003744a48f35e8e1d63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db  = getFirestore();
export const storage = getStorage()
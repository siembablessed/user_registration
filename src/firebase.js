// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDjqKMbr0g8mvXxdZcvH8iYtmgvvOATPH8",
  authDomain: "user-data-euro-film-fest.firebaseapp.com",
  projectId: "user-data-euro-film-fest",
  storageBucket: "user-data-euro-film-fest.appspot.com",
  messagingSenderId: "790917584004",
  appId: "1:790917584004:web:341a0ed1ce1a5c36b91ed1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

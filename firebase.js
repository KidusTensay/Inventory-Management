// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjo8Uqbkk6CZ7HvKlISq0vM7pQxP370ys",
  authDomain: "inventory-management-3c55f.firebaseapp.com",
  projectId: "inventory-management-3c55f",
  storageBucket: "inventory-management-3c55f.appspot.com",
  messagingSenderId: "627616076520",
  appId: "1:627616076520:web:f0cbd155c52d2464186f5d",
  measurementId: "G-X7Y8EL5LKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);



export {firestore}


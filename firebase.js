import dotenv from "dotenv";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
dotenv.config();

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "pantry-tracker-9ad2c.firebaseapp.com",
  projectId: "pantry-tracker-9ad2c",
  storageBucket: "pantry-tracker-9ad2c.appspot.com",
  messagingSenderId: "890657206203",
  appId: "1:890657206203:web:de7b4fad5dec3069001e9e",
  measurementId: "G-HV560Q4830",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };

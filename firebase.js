// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB06fDTBt4rlWTGFBMNSDUboaKXlkEZLfI",
  authDomain: "blazebond-6e0b4.firebaseapp.com",
  projectId: "blazebond-6e0b4",
  storageBucket: "blazebond-6e0b4.firebasestorage.app",
  messagingSenderId: "676162700664",
  appId: "1:676162700664:web:8602226d7219618725348d",
  measurementId: "G-C800Z9YE1E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
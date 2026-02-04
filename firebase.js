// 🔐 Firebase configuration
// NOTE: Please update apiKey and other fields with your actual Firebase project credentials.
// The project 'bondly-312ef' appears to have been deleted.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "bondly-312ef.firebaseapp.com",
  projectId: "bondly-312ef",
  storageBucket: "bondly-312ef.appspot.com",
  messagingSenderId: "1068522885175",
  appId: "1:1068522885175:web:98e4ed40445348e642afb2"
};

// Initialize Firebase
if (firebaseConfig.apiKey === "YOUR_API_KEY") {
  console.warn("Firebase API Key is missing! Please update firebase.js with your project credentials.");
}
firebase.initializeApp(firebaseConfig);

// Initialize Firebase auth, Firestore, and Storage
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

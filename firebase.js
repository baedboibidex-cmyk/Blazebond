// 🔐 Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "bondly-312ef.firebaseapp.com",
  projectId: "bondly-312ef",
  storageBucket: "bondly-312ef.appspot.com",
  messagingSenderId: "1068522885175",
  appId: "1:1068522885175:web:98e4ed40445348e642afb2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase auth, Firestore, and Storage
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

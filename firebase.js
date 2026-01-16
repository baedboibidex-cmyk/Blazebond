const firebaseConfig = {
  apiKey: "AIzaSyAmSlEVYbKm9fO_l2FWzyIh7PLkO_ccNMo",
  authDomain: "bondly-312ef.firebaseapp.com",
  projectId: "bondly-312ef",
  storageBucket: "bondly-312ef.appspot.com",
  messagingSenderId: "1068522885175",
  appId: "1:1068522885175:web:98e4ed40445348e642afb2"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
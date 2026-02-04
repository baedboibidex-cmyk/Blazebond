// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed', err));
  });
}

// Check if already logged in
auth.onAuthStateChanged(user => {
  if (user) {
    // If on index.html, maybe don't auto-redirect to allow logout if needed,
    // but usually we want to go to matches.
    // For now, let's just log it.
    console.log("User is logged in:", user.email);
  }
});

// SIGN UP
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  if (!email || !password || !username) { alert("Fill all fields"); return; }

  auth.createUserWithEmailAndPassword(email, password)
    .then(u => db.collection("users").doc(u.user.uid).set({
      username, email, is18Verified: false, isPremium: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }))
    .then(() => {
      alert("Account created!");
      window.location.href="profile.html";
    })
    .catch(e => alert(e.message));
}

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) { alert("Fill all fields"); return; }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href="profile.html")
    .catch(e => alert(e.message));
}

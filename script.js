// Register Blazebond Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Blazebond Service Worker registered:', reg.scope))
      .catch(err => console.error('Blazebond Service Worker registration failed:', err));
  });
}

// Check if user is already logged in
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("Blazebond user logged in:", user.email);
    // Optionally redirect to matches.html or profile.html if not on index.html
    if (window.location.pathname.endsWith('index.html')) {
      window.location.href = "matches.html";
    }
  }
});

// Blazebond Sign Up
async function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value.trim();

  if (!email || !password || !username) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await db.collection("users").doc(user.uid).set({
      username,
      email,
      is18Verified: false,
      isPremium: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Blazebond account created successfully!");
    window.location.href = "profile.html";
  } catch (error) {
    console.error("Blazebond signup error:", error);
    alert(`Failed to create account: ${error.message}`);
  }
}

// Blazebond Login
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter your email and password.");
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = "matches.html";
  } catch (error) {
    console.error("Blazebond login error:", error);
    alert(`Failed to log in: ${error.message}`);
  }
}

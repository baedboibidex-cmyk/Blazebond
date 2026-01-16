// 🔐 SIGN UP
function signup() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let username = document.getElementById("username").value;

  if (!email || !password || !username) {
    alert("Fill all fields");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;

      return db.collection("users").doc(user.uid).set({
        username: username,
        email: email,
        is18Verified: false,   // 🔞 age lock
        isPremium: false,      // 💳 paywall
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      alert("Account created!");
      window.location.href = "matches.html"; // 👈 correct next page
    })
    .catch(error => {
      alert(error.message);
    });
}


// 🔑 LOGIN
function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "chat.html"; // 👈 logged-in users go here
    })
    .catch(error => {
      alert(error.message);
    });
}
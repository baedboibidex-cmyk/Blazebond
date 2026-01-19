// 🔥 Clear old Firebase service workers
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        registrations.forEach(registration => registration.unregister());
      })
      .catch(err => {
        console.log("Service worker cleanup failed:", err);
      });
  });
}

// 🔐 Initialize Firebase auth and database
const auth = firebase.auth();
const db = firebase.firestore();

// 🛡️ Check if user is logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    alert("Please login first!");
    window.location.href = "index.html";
    return;
  }

  // 🔎 Load matches for the logged-in user
  db.collection("users")
    .where("is18Verified", "==", true) // Only verified users
    .get()
    .then(snapshot => {
      const matchesContainer = document.getElementById("matchesContainer");
      if (snapshot.empty) {
        matchesContainer.innerHTML = "<p>No matches found yet!</p>";
        return;
      }

      matchesContainer.innerHTML = ""; // Clear any placeholder
      snapshot.forEach(doc => {
        const data = doc.data();

        // Skip current user
        if (doc.id === user.uid) return;

        const matchDiv = document.createElement("div");
        matchDiv.classList.add("match");

        matchDiv.innerHTML = `
          <h3>${data.username}</h3>
          <p>Email: ${data.email}</p>
        `;
        matchesContainer.appendChild(matchDiv);
      });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load matches.");
    });
});

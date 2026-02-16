// 🛡️ Check if user is logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    alert("Please login first!");
    window.location.href = "index.html";
    return;
  }

  // 🔎 Load matches for the logged-in user
  db.collection("users")
    .get()
    .then(snapshot => {
      const matchesContainer = document.getElementById("matchesContainer");
      if (!matchesContainer) return;

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
        matchDiv.classList.add("match-card");

        matchDiv.innerHTML = `
          <div class="match-header">
            <h3>${data.username} ${data.is18Verified ? '🔞✅' : ''} ${data.isPremium ? '💎' : ''}</h3>
          </div>
          <p>Email: ${data.email}</p>
          <div class="match-actions">
            <button onclick="window.location.href='chat.html?uid=${doc.id}'">💬 Chat</button>
            <button onclick="window.location.href='profile.html?uid=${doc.id}'">👤 View Profile</button>
          </div>
        `;
        matchesContainer.appendChild(matchDiv);
      });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load matches.");
    });
});


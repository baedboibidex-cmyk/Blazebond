// 🛡️ Check if user is logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // 🔎 Load user data
  db.collection("users").doc(user.uid).get()
    .then(doc => {
      if (!doc.exists) {
        console.log("No such user!");
        return;
      }
      const data = doc.data();
      const profileInfo = document.getElementById("profile-info");

      profileInfo.innerHTML = `
        <div class="match profile-card">
          <p><strong>Username:</strong> ${data.username || 'N/A'}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>18+ Verified:</strong> ${data.is18Verified ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Premium Status:</strong> ${data.isPremium ? '💎 Premium' : '🆓 Free'}</p>
          ${!data.is18Verified ? '<button onclick="window.location.href=\'verify18.html\'">Verify 18+</button>' : ''}
          ${!data.isPremium ? '<button onclick="window.location.href=\'premium.html\'" style="background: var(--primary); color: white;">Get Premium</button>' : ''}
        </div>
      `;
    })
    .catch(err => {
      console.error("Error getting document:", err);
    });
});

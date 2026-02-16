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
        <div class="profile-card" style="
          background: linear-gradient(135deg, #ff4b6e, #ff9a8b);
          color: white;
          padding: 25px;
          border-radius: 15px;
          margin-top: 20px;
          text-align: left;
          box-shadow: 0 6px 15px rgba(0,0,0,0.2);
          font-family: 'Segoe UI', sans-serif;
        ">
          <h2 style="margin-bottom: 15px; font-size: 1.5em; text-align: center;">🔥 BlazeBond Profile</h2>
          <p><strong>Username:</strong> ${data.username || 'N/A'}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>18+ Verified:</strong> ${data.is18Verified ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Premium Status:</strong> ${data.isPremium ? '💎 Premium Member' : '🆓 Free User'}</p>
          
          ${!data.is18Verified ? `
            <button onclick="window.location.href='verify18.html'" style="
              margin-top: 15px;
              padding: 10px 15px;
              border: none;
              border-radius: 8px;
              background: #fff;
              color: #ff4b6e;
              font-weight: bold;
              cursor: pointer;
              transition: 0.3s;
            ">Verify 18+</button>` : ''}

          ${!data.isPremium ? `
            <button onclick="window.location.href='premium.html'" style="
              margin-top: 10px;
              padding: 10px 15px;
              border: none;
              border-radius: 8px;
              background: #333;
              color: #fff;
              font-weight: bold;
              cursor: pointer;
              transition: 0.3s;
            ">Upgrade to Premium</button>` : ''}
        </div>
      `;
    })
    .catch(err => {
      console.error("Error getting document:", err);
    });
});

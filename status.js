let user = null;
let isPremium = false;

// Auth, Premium, and 18+ Verification
auth.onAuthStateChanged(async (u) => {
  if (!u) {
    window.location.href = "index.html";
    return;
  }

  user = u;

  try {
    const doc = await db.collection("users").doc(user.uid).get();
    const data = doc.data();

    if (!data.is18Verified) {
      window.location.href = "verify18.html";
      return;
    }

    isPremium = data.isPremium || false;
    loadStatuses();
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("Failed to load user data. Please try again.");
  }
});

// Post a new status
async function postStatus() {
  const text = document.getElementById("status-text").value.trim();
  const file = document.getElementById("status-img").files[0];
  const isSpicy = document.getElementById("spicy-checkbox").checked;

  if (!text && !file) {
    return alert("Please add text or an image!");
  }

  try {
    const docUser = await db.collection("users").doc(user.uid).get();
    const data = docUser.data();

    if (isSpicy && !data.isPremium) {
      return alert("🔒 Only Blazebond Premium users can post spicy content!");
    }

    let imageUrl = "";
    if (file) {
      const storageRef = storage.ref(`status_images/${user.uid}_${Date.now()}`);
      const snapshot = await storageRef.put(file);
      imageUrl = await snapshot.ref.getDownloadURL();
    }

    await db.collection("statuses").add({
      userId: user.uid,
      username: data.username,
      text: text,
      imageUrl: imageUrl,
      isSpicy: isSpicy,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // Clear form
    document.getElementById("status-text").value = "";
    document.getElementById("status-img").value = "";
    document.getElementById("spicy-checkbox").checked = false;
  } catch (error) {
    console.error("Error posting status:", error);
    alert("Failed to post status. Please try again.");
  }
}

// Load statuses in real-time (24h expiry)
function loadStatuses() {
  const now = new Date();
  db.collection("statuses")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      const statusesDiv = document.getElementById("statuses");
      if (!statusesDiv) return;

      statusesDiv.innerHTML = "";

      snapshot.forEach((doc) => {
        const status = doc.data();
        const createdAt = status.createdAt?.toDate?.() || new Date();

        // Skip expired (>24h)
        if ((now - createdAt) / 1000 / 60 / 60 > 24) return;

        // Skip spicy content if user is not premium
        if (status.isSpicy && !isPremium) return;

        const div = document.createElement("div");
        div.className = "status";
        if (status.isSpicy) div.classList.add("spicy");

        let html = `<strong>${status.username}</strong>`;
        if (status.text) html += `<p>${status.text}</p>`;
        if (status.imageUrl) html += `<img src="${status.imageUrl}" alt="Status image">`;
        html += `<button onclick="likeStatus('${doc.id}')">❤️ Like</button>`;

        div.innerHTML = html;
        statusesDiv.appendChild(div);
      });
    }, (error) => {
      console.error("Error loading statuses:", error);
    });
}

// Like a status
function likeStatus(id) {
  if (!user) return;
  db.collection("statuses").doc(id).collection("likes").doc(user.uid).set({ liked: true })
    .catch((error) => {
      console.error("Error liking status:", error);
    });
}

// Back button
function goBack() {
  window.location.href = "matches.html";
}

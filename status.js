const db = firebase.firestore();
const storage = firebase.storage();
let user = null;

// Auth & Premium / 18+ lock
firebase.auth().onAuthStateChanged(async u => {
  if(!u) window.location.href="index.html";
  user = u;

  const doc = await db.collection("users").doc(user.uid).get();
  const data = doc.data();

  if(!data.is18Verified){
    window.location.href = "verify18.html";
    return;
  }

  loadStatuses();
});

// Post a new status
async function postStatus(){
  const text = document.getElementById("status-text").value.trim();
  const file = document.getElementById("status-img").files[0];
  const isSpicy = document.getElementById("spicy-checkbox").checked;

  if(!text && !file) return alert("Add text or image!");

  const docUser = await db.collection("users").doc(user.uid).get();
  const data = docUser.data();

  if(isSpicy && !data.isPremium){
    return alert("🔒 Only premium users can post spicy content!");
  }

  let imageUrl = "";
  if(file){
    const storageRef = storage.ref(`status_images/${user.uid}_${Date.now()}`);
    const snapshot = await storageRef.put(file);
    imageUrl = await snapshot.ref.getDownloadURL();
  }

  db.collection("statuses").add({
    userId: user.uid,
    username: data.username,
    text: text,
    imageUrl: imageUrl,
    isSpicy: isSpicy,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  document.getElementById("status-text").value = "";
  document.getElementById("status-img").value = "";
  document.getElementById("spicy-checkbox").checked = false;
}

// Load statuses in real-time (24h expiry)
function loadStatuses(){
  const now = new Date();
  db.collection("statuses")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      const statusesDiv = document.getElementById("statuses");
      statusesDiv.innerHTML = "";

      snapshot.forEach(doc => {
        const s = doc.data();
        const createdAt = s.createdAt?.toDate?.() || new Date();

        // Skip expired (>24h)
        if((now - createdAt)/1000/60/60 > 24) return;

        // Skip spicy content if user not premium
        if(s.isSpicy && !docUserIsPremium) return;

        const div = document.createElement("div");
        div.className = "status";
        if(s.isSpicy) div.classList.add("spicy");

        let html = `<strong>${s.username}</strong>`;
        if(s.text) html += `<p>${s.text}</p>`;
        if(s.imageUrl) html += `<img src="${s.imageUrl}">`;
        html += `<button onclick="likeStatus('${doc.id}')">❤️ Like</button>`;

        div.innerHTML = html;
        statusesDiv.appendChild(div);
      });
    });
}

// Like a status
function likeStatus(id){
  if(!user) return;
  db.collection("statuses").doc(id).collection("likes").doc(user.uid).set({liked:true});
}

// Back button
function goBack(){ window.location.href="matches.html"; }
let user = null;
let matches = [];
let currentMatch = null;

// Generate unique chat ID based on user IDs
function generateChatId(uid1, uid2){
  return uid1 < uid2 ? uid1 + "_" + uid2 : uid2 + "_" + uid1;
}

// Check auth & load match from URL or first available
auth.onAuthStateChanged(async u => {
  if(!u) {
    window.location.href = "index.html";
    return;
  }
  user = u;

  const urlParams = new URLSearchParams(window.location.search);
  const targetUid = urlParams.get('uid');

  if (targetUid) {
    const doc = await db.collection("users").doc(targetUid).get();
    if (doc.exists) {
      currentMatch = {id: doc.id, ...doc.data()};
    }
  }

  if (!currentMatch) {
    // Fallback to first available user
    const snapshot = await db.collection("users").limit(5).get();
    snapshot.forEach(doc => {
      if(doc.id !== user.uid && !currentMatch) {
        currentMatch = {id: doc.id, ...doc.data()};
      }
    });
  }

  if(currentMatch){
    document.getElementById("chat-with").innerText = "Chatting with " + (currentMatch.username || currentMatch.email);
    loadMessages();
  } else {
    document.getElementById("chat-with").innerText = "No users available 😢";
  }
});

// Send a chat message
function sendMessage(){
  const text = document.getElementById("msg").value.trim();
  if(!text || !currentMatch) return;

  const chatId = generateChatId(user.uid, currentMatch.id);
  db.collection("chats").doc(chatId).collection("messages").add({
    sender: user.uid,
    text: text,
    time: firebase.firestore.FieldValue.serverTimestamp()
  });

  document.getElementById("msg").value = "";
}

// Load messages in real-time
function loadMessages(){
  const chatId = generateChatId(user.uid, currentMatch.id);
  db.collection("chats").doc(chatId).collection("messages")
    .orderBy("time")
    .onSnapshot(snapshot => {
      const messagesDiv = document.getElementById("messages");
      messagesDiv.innerHTML = "";

      snapshot.forEach(doc => {
        const msg = doc.data();
        const p = document.createElement("p");
        p.innerText = msg.text;
        p.className = msg.sender === user.uid ? "me" : "other";
        messagesDiv.appendChild(p);
      });

      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

// Start a video call
function startVideoCall(){
  if(!currentMatch) return;

  // Save a call document in Firestore for signaling
  const callDoc = db.collection('calls').doc();
  callDoc.set({
    from: user.uid,
    to: currentMatch.id,
    status: "initiated",
    time: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    // Pass callId as URL param to call.html
    window.location.href = `call.html?callId=${callDoc.id}`;
  });
}

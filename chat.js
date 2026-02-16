import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, limit, query, orderBy, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase.js"; // assuming you exported these in firebase.js

let user = null;
let currentMatch = null;

// Generate unique chat ID based on user IDs
function generateChatId(uid1, uid2){
  return uid1 < uid2 ? uid1 + "_" + uid2 : uid2 + "_" + uid1;
}

// Check auth & load match from URL or first available
onAuthStateChanged(auth, async (u) => {
  if(!u) {
    window.location.href = "index.html";
    return;
  }
  user = u;

  const urlParams = new URLSearchParams(window.location.search);
  const targetUid = urlParams.get('uid');

  if (targetUid) {
    const docRef = doc(db, "users", targetUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      currentMatch = { id: docSnap.id, ...docSnap.data() };
    }
  }

  if (!currentMatch) {
    const q = query(collection(db, "users"), limit(5));
    const snapshot = await getDocs(q);
    snapshot.forEach(docSnap => {
      if(docSnap.id !== user.uid && !currentMatch) {
        currentMatch = { id: docSnap.id, ...docSnap.data() };
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
async function sendMessage(){
  const text = document.getElementById("msg").value.trim();
  if(!text || !currentMatch) return;

  const chatId = generateChatId(user.uid, currentMatch.id);
  const messagesRef = collection(db, "chats", chatId, "messages");

  await addDoc(messagesRef, {
    sender: user.uid,
    text: text,
    time: serverTimestamp()
  });

  document.getElementById("msg").value = "";
}

// Load messages in real-time
function loadMessages(){
  const chatId = generateChatId(user.uid, currentMatch.id);
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("time"));

  onSnapshot(q, (snapshot) => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    snapshot.forEach(docSnap => {
      const msg = docSnap.data();
      const p = document.createElement("p");
      p.innerText = msg.text;
      p.className = msg.sender === user.uid ? "me" : "other";
      messagesDiv.appendChild(p);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

// Start a video call
async function startVideoCall(){
  if(!currentMatch) return;

  const callRef = doc(collection(db, "calls"));
  await setDoc(callRef, {
    from: user.uid,
    to: currentMatch.id,
    status: "initiated",
    time: serverTimestamp()
  });

  window.location.href = `call.html?callId=${callRef.id}`;
}

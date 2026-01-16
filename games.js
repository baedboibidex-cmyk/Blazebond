<script src="firebase.js"></script>
<script>
const db = firebase.firestore();
let user = null;

let questions = [
  "Truth: What’s something most people don’t know about you?",
  "Dare: Send a compliment to your match 💖",
  "Truth: What do you find attractive in a person?",
  "Dare: Change your profile bio for 5 minutes 😏"
];

let current = 0;

// ✅ SINGLE AUTH CHECK
firebase.auth().onAuthStateChanged(async (u) => {
  if (!u) {
    window.location.href = "index.html";
    return;
  }

  user = u;

  const docSnap = await db.collection("users").doc(user.uid).get();
  if (!docSnap.exists) {
    alert("User record missing");
    return;
  }

  const data = docSnap.data();

  // 🔞 AGE LOCK
  if (!data.is18Verified) {
    window.location.href = "verify18.html";
    return;
  }

  // 💳 PREMIUM LOCK
  if (!data.isPremium) {
    window.location.href = "premium.html";
    return;
  }

  // ✅ ACCESS GRANTED
  document.getElementById("status").innerText = "Let’s play 🔥";
  document.getElementById("game-area").style.display = "block";
  showQuestion();
});

// Show question
function showQuestion() {
  document.getElementById("question").innerText = questions[current];
}

// Next question
function nextQuestion() {
  current = (current + 1) % questions.length;
  showQuestion();
}
</script>
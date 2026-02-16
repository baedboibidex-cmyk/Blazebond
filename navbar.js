function injectNavbar() {
  const nav = document.createElement('div');
  nav.className = 'nav-bar';
  nav.innerHTML = `
    <div class="nav-logo">🔥 BlazeBond</div>
    <div class="nav-links">
      <a href="index.html">Home</a>
      <a href="profile.html">Profile</a>
      <a href="matches.html">Matches</a>
      <a href="chat.html">Chat</a>
      <a href="status.html">Status</a>
      <a href="games.html">Games</a>
      <a href="premium.html">Premium</a>
      <a href="verify18.html">Verify 18+</a>
      <a href="#" onclick="logoutUser(event)">Logout</a>
    </div>
  `;
  document.body.prepend(nav);
}

function logoutUser(e) {
  if (e) e.preventDefault();
  if (typeof auth !== 'undefined') {
    auth.signOut().then(() => {
      window.location.href = 'index.html';
    });
  } else {
    firebase.auth().signOut().then(() => {
      window.location.href = 'index.html';
    });
  }
}

window.addEventListener('DOMContentLoaded', injectNavbar);

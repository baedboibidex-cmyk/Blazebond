function signup() {
  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (username === "" || email === "" || password === "") {
    alert("Please fill all fields");
    return;
  }

  let user = {
    username: username,
    email: email,
    password: password
  };

  localStorage.setItem("bondlyUser", JSON.stringify(user));
  alert("Account created successfully!");
}

function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let savedUser = JSON.parse(localStorage.getItem("bondlyUser"));

  if (!savedUser) {
    alert("No account found. Please sign up.");
    return;
  }

  if (email === savedUser.email && password === savedUser.password) {
    alert("Login successful!");
    window.location.href = "profile.html";
  } else {
    alert("Wrong email or password");
  }
}
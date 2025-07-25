// login.js
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById("adminLoginForm");
  const loginError = document.getElementById("loginError");

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save login status
      sessionStorage.setItem("adminEmail", user.email);

      // Close modal (using Bootstrap 5 API)
      const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      modal.hide();

      // Show admin section
      document.getElementById("entrySection")?.style?.display = "block";
      alert("Login successful!");
    } catch (error) {
      loginError.classList.remove("d-none");
      loginError.textContent = "Invalid login credentials.";
    }
  });
});

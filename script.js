document.addEventListener('DOMContentLoaded', function () {
  const API_URL = "https://script.google.com/macros/s/AKfycby0G1kXHYiFde3v_BeFur3DtClqIsWsG6maooXfoVCBonf1voXKbD6d16kxsc2HsJ_A/exec";

  // ========== NAVIGATION ==========
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target && targetId !== "#") {
        window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
        navLinks.classList.remove('active');
      }
    });
  });

  window.addEventListener('scroll', () => {
    const header = document.querySelector('nav');
    if (header) {
      header.classList.toggle('sticky', window.scrollY > 0);
    }
  });

  // ========== GALLERY ==========
  const viewMoreBtn = document.getElementById("viewMoreBtn");
  const hiddenPhotos = document.querySelectorAll(".hidden-photo");
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener("click", function (e) {
      e.preventDefault();
      hiddenPhotos.forEach(item => item.classList.add("show"));
      viewMoreBtn.style.display = "none";
    });
  }

  // ========== LOGIN MODAL ==========
  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeBtn = document.querySelector(".close-btn");
  const adminLoginForm = document.getElementById("adminLoginForm");

  if (loginBtn && loginModal) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
      loginModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === loginModal) {
        loginModal.style.display = "none";
      }
    });
  }

  // ========== ADMIN LOGIN ==========
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            type: "login", 
            email, 
            password 
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          // Store authentication data
          localStorage.setItem("authToken", result.token || "");
          localStorage.setItem("teacherEmail", result.email);
          localStorage.setItem("allowedClasses", JSON.stringify(result.allowedClasses || []));
          
          if (loginModal) loginModal.style.display = "none";
          
          // Redirect to dashboard
          window.location.href = "dashboard.html";
        } else {
          alert(result.message || "Invalid Credentials!");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed. Please try again later.");
      }
    });
  }

  // ========== RESULT CHECK (STUDENT SIDE) ==========
  const resultForm = document.getElementById("resultForm");
  if (resultForm) {
    resultForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const examName = document.getElementById("exam").value;
      const className = document.getElementById("Class").value;
      const roll = document.getElementById("roll").value;
      const resultDisplay = document.getElementById("resultDisplay");

      // Show loading state
      resultDisplay.innerHTML = '<p>Loading results...</p>';

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            type: "fetchResult", 
            className, 
            roll,
            examName 
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          // Format the result display
          resultDisplay.innerHTML = `
            <div class="result-card">
              <h3>${result["Exam Name"] || examName} Result</h3>
              <div class="result-details">
                <p><strong>Name:</strong> ${result["Name of the students"] || "N/A"}</p>
                <p><strong>Roll No:</strong> ${result["Roll No"] || roll}</p>
                <p><strong>Class:</strong> ${className}</p>
                <hr>
                ${Object.entries(result)
                  .filter(([key]) => !["success", "message", "Exam Name", "Name of the students", "Roll No"].includes(key))
                  .map(([subject, marks]) => `
                    <p><strong>${subject}:</strong> ${marks || "-"}</p>
                  `).join("")}
                <hr>
                <p><strong>Total:</strong> ${result["Total"] || "-"}</p>
                <p><strong>Grade:</strong> ${result["Grade"] || "-"}</p>
                <p class="result-status ${(result["Status"] || result["Result"] || "").toLowerCase()}">
                  <strong>Status:</strong> ${result["Status"] || result["Result"] || "-"}
                </p>
              </div>
            </div>
          `;
        } else {
          resultDisplay.innerHTML = `<p class="error">${result.message || "Result not found"}</p>`;
        }
      } catch (error) {
        console.error("Fetch error:", error);
        resultDisplay.innerHTML = `
          <p class="error">Failed to fetch results: ${error.message}</p>
          <button onclick="window.location.reload()">Try Again</button>
        `;
      }
    });
  }

  // ========== CHECK AUTH STATUS ==========
  function checkAuthStatus() {
    const authToken = localStorage.getItem("authToken");
    const teacherEmail = localStorage.getItem("teacherEmail");
    const allowedClasses = JSON.parse(localStorage.getItem("allowedClasses") || "[]");
    
    // If logged in but on index page, redirect to dashboard
    if (authToken && window.location.pathname.endsWith("index.html")) {
      window.location.href = "dashboard.html";
    }
    
    // If not logged in but on dashboard, redirect to index
    if (!authToken && window.location.pathname.endsWith("dashboard.html")) {
      window.location.href = "index.html";
    }
    
    return { authToken, teacherEmail, allowedClasses };
  }

  // Initialize auth check
  checkAuthStatus();
});

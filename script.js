document.addEventListener('DOMContentLoaded', function () {
    const API_URL = "https://script.google.com/macros/s/AKfycbzRQ6bbcR_qS1IREhd0GapZflFJc0oalNmY-GyBrQuoqmiqrzBIs72NfDRn5V_WpTSK/exec";

    // ==================== NAVIGATION ====================
    // Mobile nav toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({ 
                    top: targetElement.offsetTop - 100, 
                    behavior: 'smooth' 
                });
                navLinks.classList.remove('active');
            }
        });
    });

    // Sticky header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('nav');
        if (header) {
            header.classList.toggle('sticky', window.scrollY > 0);
        }
    });

    // ==================== GALLERY ====================
    // View More Photos
    const viewMoreBtn = document.getElementById("viewMoreBtn");
    const hiddenPhotos = document.querySelectorAll(".hidden-photo");
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener("click", function (e) {
            e.preventDefault();
            hiddenPhotos.forEach(item => item.classList.add("show"));
            viewMoreBtn.style.display = "none";
        });
    }

    // ==================== LOGIN MODAL ====================
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close-btn');

    if (loginBtn && loginModal) {
        // Open modal
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });

        // Close modal
        closeBtn.addEventListener('click', () => loginModal.style.display = 'none');
        
        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) loginModal.style.display = 'none';
        });
    }

    // ==================== ADMIN LOGIN ====================
    const adminLoginForm = document.getElementById("adminLoginForm");
    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const email = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value;

            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        type: "login", 
                        email, 
                        password 
                    })
                });
                
                const result = await res.json();
                
                if (result.success) {
                    // Store session data
                    localStorage.setItem("teacherEmail", result.email);
                    localStorage.setItem("allowedClasses", JSON.stringify(result.allowedClasses));
                    
                    // Close modal and redirect
                    if (loginModal) loginModal.style.display = 'none';
                    alert("Login Successful!");
                    
                    // Redirect to dashboard or show upload form
                    if (window.location.pathname.includes('dashboard.html')) {
                        window.location.reload();
                    } else {
                        showUploadForm(result.allowedClasses);
                    }
                } else {
                    alert(result.message || "Invalid Credentials!");
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("Server error. Please try again later.");
            }
        });
    }

    // ==================== RESULT FETCHING ====================
    const resultForm = document.getElementById("resultForm");
    if (resultForm) {
        resultForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const className = document.getElementById("Class").value;
            const roll = document.getElementById("roll").value;
            const resultDisplay = document.getElementById("resultDisplay");

            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        type: "fetchResult", 
                        className, 
                        roll 
                    })
                });
                
                const result = await res.json();

                if (result.success) {
                    resultDisplay.innerHTML = `
                        <h3>Result for ${result.Name || "Student"}</h3>
                        <p>Roll No: ${result["Roll No"]}</p>
                        <p>Marks: ${result.Marks}</p>
                        <p>Grade: ${result.Grade || "-"}</p>
                        <p>Status: ${result.Status || "-"}</p>
                    `;
                } else {
                    resultDisplay.innerHTML = `<p class="error">${result.message}</p>`;
                }
            } catch (error) {
                console.error("Fetch error:", error);
                resultDisplay.innerHTML = `<p class="error">Failed to fetch results</p>`;
            }
        });
    }

    // ==================== UPLOAD MARKS (FOR TEACHERS) ====================
    function showUploadForm(allowedClasses) {
        if (!allowedClasses || allowedClasses.length === 0) return;
        if (document.getElementById("uploadForm")) return;

        const section = document.createElement("section");
        section.classList.add("upload-section");
        section.innerHTML = `
            <div class="container">
                <h2>Upload Student Marks</h2>
                <form id="uploadForm">
                    <label>Select Class:</label>
                    <select id="uploadClass" required>
                        ${allowedClasses.map(c => `<option value="${c}">${c}</option>`).join("")}
                    </select>
                    <label>Roll No:</label>
                    <input type="text" id="uploadRoll" required>
                    <label>Marks:</label>
                    <input type="number" id="uploadMarks" required>
                    <button type="submit" class="btn">Update Marks</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(section);

        document.getElementById("uploadForm").addEventListener("submit", async function (e) {
            e.preventDefault();
            const className = document.getElementById("uploadClass").value;
            const rollNo = document.getElementById("uploadRoll").value;
            const marks = document.getElementById("uploadMarks").value;

            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "update",
                        className,
                        rollNo,
                        updates: { Marks: marks }
                    })
                });
                
                const data = await res.json();
                alert(data.message || (data.success ? 
                    "Marks updated successfully" : 
                    "Update failed"));
                
                if (data.success) {
                    this.reset(); // Clear form after success
                }
            } catch (error) {
                console.error("Update error:", error);
                alert("Failed to update marks. Check console for details.");
            }
        });
    }

    // Auto-show upload form if teacher is already logged in
    const teacherEmail = localStorage.getItem("teacherEmail");
    const allowedClasses = JSON.parse(localStorage.getItem("allowedClasses") || "[]");
    if (teacherEmail && allowedClasses.length > 0) {
        showUploadForm(allowedClasses);
    }
});

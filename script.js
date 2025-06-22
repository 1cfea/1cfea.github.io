document.addEventListener('DOMContentLoaded', function () {
    const API_URL = "https://script.google.com/macros/s/AKfycbySAr6OPx0oG8bbZt3rVFgLx1Y5EyCn7dHtw0_MRqhswdrUrRcJv4KhTNqXtbruJC0b/exec";

    // Mobile nav
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop - 100, behavior: 'smooth' });
                navLinks.classList.remove('active');
            }
        });
    });

    // Sticky header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('nav');
        header.classList.toggle('sticky', window.scrollY > 0);
    });

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

    // Login Modal
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close-btn');

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => loginModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
    });

    // Admin login
    document.getElementById("adminLoginForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "login", email, password })
        });
        const result = await res.json();
        if (result.success) {
            localStorage.setItem("teacherEmail", result.email);
            localStorage.setItem("allowedClasses", JSON.stringify(result.allowedClasses));
            loginModal.style.display = 'none';
            alert("Login Successful!");
            showUploadForm(result.allowedClasses);
        } else {
            alert("Invalid Credentials!");
        }
    });

    // Result fetching
    document.getElementById("resultForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const className = document.getElementById("Class").value;
        const roll = document.getElementById("roll").value;
        const resultDisplay = document.getElementById("resultDisplay");

        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "fetchResult", className, roll })
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
    });

    // Show upload form (for teachers)
    function showUploadForm(allowedClasses) {
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
                    </select><br><br>
                    <label>Roll No:</label>
                    <input type="text" id="uploadRoll" required><br><br>
                    <label>Marks:</label>
                    <input type="number" id="uploadMarks" required><br><br>
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
            alert(data.message || (data.success ? "Marks updated successfully" : "Update failed"));
        });
    }
});

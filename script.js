document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Login modal
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close-btn');
    
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });
    
    closeBtn.addEventListener('click', function() {
        loginModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    // Admin login form
    const adminLoginForm = document.getElementById('adminLoginForm');
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // In a real application, you would validate and send to server
        alert(`Login attempt with username: ${username}`);
        loginModal.style.display = 'none';
    });
    
    // Result form
    const resultForm = document.getElementById('resultForm');
    const resultDisplay = document.getElementById('resultDisplay');
    
    resultForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const exam = document.getElementById('exam').value;
        const roll = document.getElementById('roll').value;
        
        // Simulate result fetching
        if (exam && roll) {
            resultDisplay.innerHTML = `
                <h3>Result for ${getExamName(exam)}</h3>
                <p>Roll Number: ${roll}</p>
                <div class="result-details">
                    <p>Name: Student Name</p>
                    <p>Class: Class X</p>
                    <p>Percentage: 92%</p>
                    <p>Grade: A1</p>
                    <p>Status: Pass</p>
                </div>
                <p class="note">This is a sample result. Actual results may vary.</p>
            `;
        } else {
            resultDisplay.innerHTML = '<p class="error">Please enter all required fields</p>';
        }
    });
    
    function getExamName(exam) {
        switch(exam) {
            case 'quarterly': return 'Quarterly Exam 2023';
            case 'halfyearly': return 'Half Yearly Exam 2023';
            case 'annual': return 'Annual Exam 2023';
            default: return 'Exam';
        }
    }
    
    // Sticky header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('nav');
        header.classList.toggle('sticky', window.scrollY > 0);
    });
    
    // Add sticky class initially if not at top
    if (window.scrollY > 0) {
        document.querySelector('nav').classList.add('sticky');
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const viewMoreBtn = document.getElementById("viewMoreBtn");
    const hiddenPhotos = document.querySelectorAll(".hidden-photo");

    viewMoreBtn.addEventListener("click", function (e) {
        e.preventDefault();
        hiddenPhotos.forEach(item => {
            // Use this if you're using fade-in CSS
            item.classList.add("show");

            // Or just reveal them without animation:
            // item.style.display = "block";
        });

        // Optionally hide the button
        viewMoreBtn.style.display = "none";
    });
});

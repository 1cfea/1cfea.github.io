// Initialize Supabase
const supabaseUrl = 'https://dqwskwjnlaxkojkpgkzg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd3Nrd2pubGF4a29qa3Bna3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDQxOTAsImV4cCI6MjA2NjQyMDE5MH0.0wAUyur6b6jeN_wB5fZgYj7b-uE4vzjxC_GiPVrGANM';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const classSelect = document.getElementById('classSelect');
const examSelect = document.getElementById('examSelect');
const subjectsContainer = document.getElementById('subjectsContainer');
const resultForm = document.getElementById('resultForm');

// Fetch Classes
async function loadClasses() {
  const { data, error } = await supabase.from('classes').select('*');
  if (error) return alert('Error loading classes');
  classSelect.innerHTML = data.map(cls => `<option value="${cls.name}">${cls.name}</option>`).join('');
}

// Fetch Exams
async function loadExams() {
  const { data, error } = await supabase.from('exams').select('*');
  if (error) return alert('Error loading exams');
  examSelect.innerHTML = data.map(exam => `<option value="${exam.name}">${exam.name}</option>`).join('');
}

// Fetch Subjects by Class
async function loadSubjectsByClass(className) {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('class', className);

  if (error) return alert('Error loading subjects');

  subjectsContainer.innerHTML = data.map(subject => `
    <label>${subject.name}: 
      <input type="number" name="subject_${subject.name}" required min="0" max="100" />
    </label><br>
  `).join('');
}

// Handle Class change
classSelect.addEventListener('change', () => {
  loadSubjectsByClass(classSelect.value);
});

// Handle Form Submission
resultForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const studentName = document.getElementById('studentName').value;
  const rollNo = document.getElementById('rollNo').value;
  const selectedClass = classSelect.value;
  const selectedExam = examSelect.value;

  const marks = {};
  subjectsContainer.querySelectorAll('input[type="number"]').forEach(input => {
    const subject = input.name.replace('subject_', '');
    marks[subject] = Number(input.value);
  });

  // Check if student exists
  const { data: existingStudent } = await supabase
    .from('students')
    .select('*')
    .eq('rollNo', rollNo)
    .eq('class', selectedClass)
    .single();

  let studentId;
  if (!existingStudent) {
    const { data: newStudent, error: studentError } = await supabase
      .from('students')
      .insert([{ name: studentName, rollNo: rollNo, class: selectedClass }])
      .select()
      .single();
    if (studentError) return alert('Error adding student');
    studentId = newStudent.id;
  } else {
    studentId = existingStudent.id;
  }

  // Insert results
  for (const [subject, mark] of Object.entries(marks)) {
    await supabase.from('results').insert([
      {
        student_id: studentId,
        class: selectedClass,
        exam: selectedExam,
        subject: subject,
        marks: mark
      }
    ]);
  }

  alert('Results saved successfully!');
  resultForm.reset();
  subjectsContainer.innerHTML = '';
});

// Initial load
loadClasses();
loadExams();

// ========== GALLERY VIEW MORE ==========
const viewMoreBtn = document.getElementById("viewMoreBtn");
const hiddenPhotos = document.querySelectorAll(".hidden-photo");
if (viewMoreBtn) {
  viewMoreBtn.addEventListener("click", function (e) {
    e.preventDefault();
    hiddenPhotos.forEach(item => item.classList.add("show"));
    viewMoreBtn.style.display = "none";
  });
}
// Initialize Bootstrap modal
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));

// Handle login button click
document.getElementById('loginBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  loginModal.show();
});

// Handle login form submission
document.getElementById('adminLoginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorElement = document.getElementById('loginError');

  try {
    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Get additional admin info
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (adminError) throw adminError;

    // Store admin info in sessionStorage
    sessionStorage.setItem('adminEmail', data.user.email);
    sessionStorage.setItem('adminName', adminData.name || 'Admin');
    sessionStorage.setItem('allowedClasses', adminData.allowed_classes || '');

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
    
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.remove('d-none');
    console.error('Login error:', error);
  }
});

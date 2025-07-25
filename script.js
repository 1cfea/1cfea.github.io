import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
const form = document.getElementById('publicResultForm');
const resultDisplay = document.getElementById('resultDisplay');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
 const classVal = document.getElementById('classSelect').value;
const rollVal = document.getElementById('rollNumber').value;
const examVal = document.getElementById('examSelect').value;

  const q = query(collection(db, "results"), where("class", "==", classVal), where("roll", "==", rollVal), where("exam", "==", examVal));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    resultDisplay.textContent = "No result found.";
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    resultDisplay.innerHTML = `
      <h3>Result for ${data.name}</h3>
      <p>English: ${data.english}</p>
      <p>Maths: ${data.maths}</p>
      <p>Science: ${data.science}</p>
      <p>Grade: ${data.grade}</p>
      <p>Rank: ${data.rank}</p>
    `;
  });
});

const generateBtn = document.getElementById('generateBtn');
const ideaInput = document.getElementById('ideaInput');
const outputSection = document.getElementById('outputSection');
const outputContent = document.getElementById('outputContent');
const copyBtn = document.getElementById('copyBtn');
const creditsCount = document.getElementById('creditsCount');
const logoutBtn = document.getElementById('logoutBtn');

let credits = 5; // free credits

function updateCredits() {
  creditsCount.textContent = credits;
}

function copyToClipboard() {
  navigator.clipboard.writeText(outputContent.textContent)
    .then(() => alert('Copied to clipboard!'))
    .catch(() => alert('Failed to copy.'));
}

async function generateSaaS() {
  if (credits <= 0) {
    alert('No credits left. Please upgrade on the sales page.');
    return;
  }

  const idea = ideaInput.value.trim();
  if (!idea) {
    alert('Please enter your SaaS idea.');
    return;
  }

  outputContent.textContent = 'Generating... Please wait.';
  outputSection.style.display = 'block';

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: idea }),
    });

    if (!response.ok) throw new Error('API error');

    const data = await response.json();
    outputContent.textContent = data.result;

    credits--;
    updateCredits();
  } catch (err) {
    outputContent.textContent = 'Error generating SaaS tool. Try again later.';
    console.error(err);
  }
}

generateBtn.addEventListener('click', generateSaaS);
copyBtn.addEventListener('click', copyToClipboard);

updateCredits();

if(logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    alert('Logout functionality not yet implemented.');
  });
}

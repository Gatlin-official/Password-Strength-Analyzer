// DOM Elements
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const strengthCard = document.getElementById('strengthCard');
const issuesCard = document.getElementById('issuesCard');
const successCard = document.getElementById('successCard');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const strengthPercentage = document.getElementById('strengthPercentage');
const scoreDisplay = document.getElementById('scoreDisplay');
const issuesList = document.getElementById('issuesList');
const passwordLength = document.getElementById('passwordLength');
const lengthDisplay = document.getElementById('lengthDisplay');
const generateBtn = document.getElementById('generateBtn');
const generatedCard = document.getElementById('generatedCard');
const generatedPassword = document.getElementById('generatedPassword');
const copyBtn = document.getElementById('copyBtn');
const generatedAnalysis = document.getElementById('generatedAnalysis');

// Toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordBtn.textContent = type === 'password' ? 'Show' : 'Hide';
});

// Real-time password strength checking
passwordInput.addEventListener('input', debounce(checkPassword, 300));

// Update length display
passwordLength.addEventListener('input', () => {
    lengthDisplay.textContent = passwordLength.value;
});

// Generate password
generateBtn.addEventListener('click', generatePassword);

// Copy generated password
copyBtn.addEventListener('click', copyToClipboard);

// Debounce function to avoid too many API calls
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Check password strength
async function checkPassword() {
    const password = passwordInput.value;

    if (!password) {
        strengthCard.style.display = 'none';
        issuesCard.style.display = 'none';
        successCard.style.display = 'none';
        return;
    }

    try {
        const response = await fetch('/api/check-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();
        displayStrengthResult(data);
    } catch (error) {
        console.error('Error checking password:', error);
    }
}

// Display strength result
function displayStrengthResult(data) {
    const { score, max_score, strength, color, percentage, issues } = data;

    // Update strength bar
    strengthBar.style.width = percentage + '%';
    strengthBar.style.background = getGradientColor(percentage);
    strengthBar.textContent = percentage + '%';

    // Update strength text
    strengthText.textContent = strength;
    strengthPercentage.textContent = percentage + '%';

    // Update score
    scoreDisplay.textContent = `Score: ${score}/${max_score}`;

    // Show strength card
    strengthCard.style.display = 'block';

    // Show issues or success
    if (issues.length > 0) {
        issuesCard.style.display = 'block';
        successCard.style.display = 'none';

        issuesList.innerHTML = '';
        issues.forEach(issue => {
            const li = document.createElement('li');
            li.textContent = issue;
            issuesList.appendChild(li);
        });
    } else {
        issuesCard.style.display = 'none';
        successCard.style.display = 'block';
    }
}

// Get gradient color based on percentage
function getGradientColor(percentage) {
    if (percentage < 25) return '#ff4444';
    if (percentage < 50) return '#ff8844';
    if (percentage < 75) return '#ffdd44';
    if (percentage < 90) return '#88dd44';
    return '#44dd44';
}

// Generate strong password
async function generatePassword() {
    const length = parseInt(passwordLength.value);

    try {
        const response = await fetch('/api/generate-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ length })
        });

        const data = await response.json();
        displayGeneratedPassword(data);
    } catch (error) {
        console.error('Error generating password:', error);
    }
}

// Display generated password
function displayGeneratedPassword(data) {
    const { password, analysis } = data;

    generatedPassword.value = password;
    generatedCard.style.display = 'block';

    // Display analysis
    const { strength, percentage, score, max_score } = analysis;
    generatedAnalysis.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span><strong>Strength:</strong> ${strength} (${percentage}%)</span>
            <span><strong>Score:</strong> ${score}/${max_score}</span>
        </div>
    `;
}

// Copy to clipboard
function copyToClipboard() {
    generatedPassword.select();
    document.execCommand('copy');

    // Visual feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 2000);

    // Save password to used passwords
    savePassword(generatedPassword.value);
}

// Save password to used passwords
async function savePassword(password) {
    try {
        await fetch('/api/save-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
    } catch (error) {
        console.error('Error saving password:', error);
    }
}

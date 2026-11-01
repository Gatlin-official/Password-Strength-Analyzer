"""
Password Strength Analyzer
==========================
A tool that evaluates the strength of user-entered passwords
and provides suggestions for improvement.

Features:
- Check password length, complexity, and uniqueness
- Suggest stronger password alternatives
- Store used passwords to prevent reuse
"""

from flask import Flask, render_template, request, jsonify
import re
import string
import json
import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'password-analyzer-secret-key'

# File to store used passwords
USED_PASSWORDS_FILE = 'used_passwords.json'


def load_used_passwords():
    """Load previously used passwords from file"""
    if os.path.exists(USED_PASSWORDS_FILE):
        try:
            with open(USED_PASSWORDS_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []


def save_used_password(password):
    """Save a password to the used passwords list"""
    used = load_used_passwords()
    if password not in used:
        used.append(password)
        with open(USED_PASSWORDS_FILE, 'w') as f:
            json.dump(used, f)


def check_password_strength(password):
    """
    Analyze password strength and return detailed information
    
    Returns:
        dict: Contains score, strength level, and feedback
    """
    score = 0
    feedback = []
    issues = []
    
    # Length check
    if len(password) >= 8:
        score += 1
    else:
        issues.append("Password is too short (minimum 8 characters)")
    
    if len(password) >= 12:
        score += 1
    
    if len(password) >= 16:
        score += 1
    
    # Uppercase letters
    if re.search(r'[A-Z]', password):
        score += 1
    else:
        issues.append("Add uppercase letters (A-Z)")
    
    # Lowercase letters
    if re.search(r'[a-z]', password):
        score += 1
    else:
        issues.append("Add lowercase letters (a-z)")
    
    # Numbers
    if re.search(r'\d', password):
        score += 1
    else:
        issues.append("Add numbers (0-9)")
    
    # Special characters
    if re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>?/\\|`~]', password):
        score += 1
    else:
        issues.append("Add special characters (!@#$%^&*...)")
    
    # Check if password was used before
    used_passwords = load_used_passwords()
    if password in used_passwords:
        issues.append("This password has been used before")
        score = max(0, score - 2)
    
    # Determine strength level
    if score >= 7:
        strength = "Very Strong"
        color = "green"
    elif score >= 5:
        strength = "Strong"
        color = "lightgreen"
    elif score >= 3:
        strength = "Moderate"
        color = "yellow"
    elif score >= 1:
        strength = "Weak"
        color = "orange"
    else:
        strength = "Very Weak"
        color = "red"
    
    return {
        'score': score,
        'max_score': 8,
        'strength': strength,
        'color': color,
        'issues': issues,
        'percentage': int((score / 8) * 100)
    }


def generate_strong_password(length=12):
    """
    Generate a strong password suggestion
    
    Args:
        length (int): Length of password to generate (default 12)
    
    Returns:
        str: A strong password
    """
    import random
    
    uppercase = string.ascii_uppercase
    lowercase = string.ascii_lowercase
    digits = string.digits
    special = "!@#$%^&*()"
    
    # Ensure at least one of each type
    password = [
        random.choice(uppercase),
        random.choice(lowercase),
        random.choice(digits),
        random.choice(special)
    ]
    
    # Fill the rest randomly
    all_chars = uppercase + lowercase + digits + special
    for _ in range(length - 4):
        password.append(random.choice(all_chars))
    
    # Shuffle the password
    random.shuffle(password)
    return ''.join(password)


@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')


@app.route('/api/check-password', methods=['POST'])
def check_password_api():
    """API endpoint to check password strength"""
    data = request.json
    password = data.get('password', '')
    
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    
    result = check_password_strength(password)
    return jsonify(result)


@app.route('/api/generate-password', methods=['POST'])
def generate_password_api():
    """API endpoint to generate a strong password"""
    data = request.json
    length = data.get('length', 12)
    
    # Validate length
    if not isinstance(length, int) or length < 8 or length > 32:
        length = 12
    
    password = generate_strong_password(length)
    analysis = check_password_strength(password)
    
    return jsonify({
        'password': password,
        'analysis': analysis
    })


@app.route('/api/save-password', methods=['POST'])
def save_password_api():
    """API endpoint to save a password to used passwords"""
    data = request.json
    password = data.get('password', '')
    
    if password:
        save_used_password(password)
        return jsonify({'message': 'Password saved'})
    
    return jsonify({'error': 'Password is required'}), 400


if __name__ == '__main__':
    app.run(debug=os.environ.get('FLASK_DEBUG') == '1', port=5001)

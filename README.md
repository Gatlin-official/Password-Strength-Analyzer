# Password Strength Analyzer

A beginner-friendly web tool that evaluates password strength and provides suggestions for creating secure passwords.

## Features

✅ **Check Password Strength**
- Analyzes password length, complexity, and uniqueness
- Provides a visual strength meter (0-100%)
- Shows detailed feedback on what's missing

✅ **Strength Criteria**
- Length (8+, 12+, 16+ characters)
- Uppercase letters (A-Z)
- Lowercase letters (a-z)
- Numbers (0-9)
- Special characters (!@#$%^&*...)
- Password history (prevents reuse)

✅ **Generate Strong Passwords**
- Random password generator
- Customizable length (8-32 characters)
- Automatically meets all security criteria

✅ **Password Security Tips**
- Educational information about password safety
- Best practices for account security

## Project Structure

```
PasswordStrengthAnalyzer/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML page
└── static/
    ├── style.css         # Styling
    └── script.js         # Frontend logic
```

## Installation

1. **Create a virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. **Open your browser** and go to:
   ```
   http://localhost:5001
   ```

## How It Works

### Password Strength Analysis
- **Very Weak**: Score 0 (red)
- **Weak**: Score 1-2 (orange)
- **Moderate**: Score 3-4 (yellow)
- **Strong**: Score 5-6 (light green)
- **Very Strong**: Score 7+ (green)

### Real-time Feedback
As you type a password, the app instantly shows:
- Strength percentage (0-100%)
- Current score and requirements
- Specific issues to fix
- Success message when password is strong

### Generate Passwords
- Click "Generate Password" to create a random strong password
- Adjust the length slider for different lengths
- Generated passwords are automatically saved to prevent reuse

## Example Weak vs Strong Password

❌ **Weak Password**: `password123`
- Only 11 characters
- Missing uppercase letters
- Missing special characters
- Too common/predictable

✅ **Strong Password**: `Tr0pic@lThund3r!`
- 16 characters (exceeds requirement)
- Contains uppercase, lowercase, numbers, special chars
- Unique and unpredictable
- No common words or patterns

## Security Features

1. **Password History Tracking**
   - Stores used passwords in `used_passwords.json`
   - Prevents reuse of old passwords

2. **Real-time Validation**
   - Checks password against multiple criteria instantly
   - No data is sent to external servers

3. **Client-side Processing**
   - All analysis happens in your browser or locally
   - Passwords aren't permanently stored

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Main page |
| `/api/check-password` | POST | Analyze password strength |
| `/api/generate-password` | POST | Generate strong password |
| `/api/save-password` | POST | Save password to history |

## Learning Outcomes

Through this project, you'll learn:
- ✨ Password security best practices
- 🔐 Complexity and strength criteria
- 💾 Data persistence with JSON
- 🎨 User interface design
- ⚡ Real-time form validation
- 🔄 API endpoints with Flask

## Future Enhancements

- Database integration for user accounts
- Password strength statistics
- Common password dictionary checking
- Two-factor authentication support
- Export password strength reports

## Author

Created as an internship learning project - May 2026

---

**Happy password securing!** 🔐

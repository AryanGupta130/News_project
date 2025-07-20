# Setup Instructions

## Frontend (already running)
The React frontend is running on http://localhost:5173/

## Backend Setup
To start the backend server:

1. Navigate to the server directory:
   ```bash
   cd /Users/ag/Documents/Project/server
   ```

2. Activate virtual environment (if not already active):
   ```bash
   source venv/bin/activate
   ```

3. Start the Flask server:
   ```bash
   python3 app.py
   ```

The backend will run on http://localhost:8080/

## Test the Login System

1. Open http://localhost:5173/ in your browser
2. You should see the login page
3. Enter any email and password (current implementation accepts any credentials for testing)
4. You should be redirected to the dashboard after successful login

## To Add Real Firebase Authentication

1. Go to https://console.firebase.google.com/
2. Create a new project or select existing one
3. Enable Authentication and add Email/Password provider
4. Get your Firebase config from Project Settings > General > Your apps
5. Update the `.env` file in the server directory with your actual Firebase credentials
6. Update the login logic in `app.py` to use Firebase Auth

## Current Features
- ✅ React frontend with login form
- ✅ Flask backend with API endpoints
- ✅ Session management
- ✅ CORS enabled for local development
- ⚠️  Basic authentication (accepts any credentials for testing)
- ⚠️  Firebase integration ready but needs configuration

## Next Steps
1. Configure Firebase project
2. Update Firebase credentials in .env
3. Implement proper Firebase authentication
4. Add user registration functionality
5. Add password reset functionality

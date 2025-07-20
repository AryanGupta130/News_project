from flask import Flask, jsonify, session, render_template, request, redirect, url_for
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
cors = CORS(app, origins='*')

# Initialize Firebase Admin (you'll need to set up a service account key)
# For now, we'll use a simple authentication approach
# You can set up Firebase Admin SDK later for production

app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')

@app.route("/", methods=['GET', 'POST'])
def index():
    if 'user' in session:
        return f"Hi, {session['user']}! You are logged in."
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        # For testing purposes, we'll use simple authentication
        # Replace this with actual Firebase auth later
        if email and password:  # Simple check for demo
            session['user'] = email
            return redirect(url_for('dashboard'))
        else:
            return "Login failed. Please check your credentials."
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    if 'user' not in session:
        return redirect('/')
    return f"Welcome to the dashboard, {session['user']}!"

@app.route("/logout")
def logout():
    session.pop('user', None)
    return redirect('/')

# API endpoints for React frontend
@app.route("/api/login", methods=['POST'])
def api_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Simple authentication for testing - replace with Firebase Auth later
    if email and password:
        session['user'] = email
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": email
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

@app.route("/api/register", methods=['POST'])
def api_register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Simple registration for testing - replace with Firebase Auth later
    if email and password and len(password) >= 6:
        # In a real app, you'd save the user to a database
        # For now, we'll just log them in after registration
        session['user'] = email
        return jsonify({
            "success": True,
            "message": "Account created successfully",
            "user": email
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid email or password (password must be at least 6 characters)"
        }), 400

@app.route("/api/logout", methods=['POST'])
def api_logout():
    session.pop('user', None)
    return jsonify({
        "success": True,
        "message": "Logged out successfully"
    })

@app.route("/api/user", methods=['GET'])
def api_get_user():
    if 'user' in session:
        return jsonify({
            "user": session['user'],
            "authenticated": True
        })
    return jsonify({
        "authenticated": False
    }), 401

if __name__ == "__main__":
    app.run(debug=True, port=8080)


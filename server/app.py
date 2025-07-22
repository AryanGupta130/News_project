from flask import Flask, jsonify, session, render_template, request, redirect, url_for
from flask_cors import CORS
from firestore import firestore_service  # Import our Firestore service
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')  # Use env variable

# Enable CORS for frontend communication
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:5174"])

@app.route("/")
def index():
    return jsonify({"message": "NewsPersonal Backend API", "status": "running"})

@app.route("/api/preferences", methods=['POST'])
def save_preferences():
    """Save user preferences to Firestore"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        preferences = data.get('preferences')
        
        if not user_id or not preferences:
            return jsonify({'error': 'Missing user_id or preferences'}), 400
        
        # Save to Firestore
        success = firestore_service.save_user_preferences(user_id, preferences)
        
        if success:
            return jsonify({
                'success': True, 
                'message': 'Preferences saved successfully'
            })
        else:
            return jsonify({'error': 'Failed to save preferences'}), 500
            
    except Exception as e:
        print(f"Error in save_preferences: {e}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/preferences/<user_id>", methods=['GET'])
def get_preferences(user_id):
    """Get user preferences from Firestore"""
    try:
        preferences = firestore_service.get_user_preferences(user_id)
        
        if preferences:
            return jsonify({
                'success': True,
                'preferences': preferences
            })
        else:
            return jsonify({
                'success': False,
                'message': 'No preferences found'
            }), 404
            
    except Exception as e:
        print(f"Error in get_preferences: {e}")
        return jsonify({'error': str(e)}), 500

# Your existing routes...
@app.route("/api/login", methods=['POST'])
def api_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Simple authentication for testing
    if email and password:
        session['user'] = email
        return jsonify({"success": True, "message": "Login successful", "user": email})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

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
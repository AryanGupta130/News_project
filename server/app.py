from flask import Flask, jsonify, session, render_template, request, redirect, url_for
from flask_cors import CORS
from firestore import firestore_service  # Import our Firestore service
from news_service import news_service  # Import our News service
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

@app.route("/api/process-news", methods=['POST'])
def process_news():
    """Process news for a specific user based on their preferences using LLM"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'Missing user_id'}), 400
        
        # Get user preferences
        preferences = firestore_service.get_user_preferences(user_id)
        
        if not preferences:
            return jsonify({'error': 'User preferences not found'}), 404
        
        print(f"Processing news for user {user_id} with preferences: {preferences}")
        
        # Process news with our intelligent news service
        curated_articles = news_service.process_news_for_user(preferences)
        
        if not curated_articles:
            return jsonify({
                'success': False,
                'error': 'Unable to fetch news at this time. Please try again later.'
            }), 500
        
        # Save processed news to Firestore
        firestore_service.save_processed_news(user_id, curated_articles)
        
        return jsonify({
            'success': True,
            'articles': curated_articles,
            'message': f'Successfully curated {len(curated_articles)} personalized articles',
            'total_articles': len(curated_articles)
        })
        
    except Exception as e:
        print(f"Error in process_news: {e}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/users/batch-process", methods=['POST'])
def batch_process_all_users():
    """Process news for all users (for scheduled jobs)"""
    try:
        users = firestore_service.get_all_users_for_processing()
        processed_count = 0
        
        for user in users:
            user_id = user['user_id']
            preferences = user['preferences']
            
            # TODO: Process each user's preferences and fetch news
            # For now, just log
            print(f"Processing news for user: {user_id}")
            processed_count += 1
        
        return jsonify({
            'success': True,
            'message': f'Processed news for {processed_count} users'
        })
        
    except Exception as e:
        print(f"Error in batch_process_all_users: {e}")
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
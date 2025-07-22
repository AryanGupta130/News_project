from flask import Flask, jsonify, request
from flask_cors import CORS
from firestore import firestore_service

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route("/api/preferences", methods=['POST'])
def save_preferences():
    data = request.get_json()
    user_id = data.get('user_id')
    preferences = data.get('preferences')
    
    if not user_id or not preferences:
        return jsonify({'error': 'Missing user_id or preferences'}), 400
        
    success = firestore_service.save_user_preferences(user_id, preferences)
    
    if success:
        return jsonify({'message': 'Preferences saved successfully'}), 200
    else:
        return jsonify({'error': 'Failed to save preferences'}), 500


if __name__ == "__main__":
    app.run(debug=True, port=8080)
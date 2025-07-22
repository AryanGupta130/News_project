import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK with service account credentials"""
    if not firebase_admin._apps:
        # Path to your service account key file
        cred = credentials.Certificate("authenticate.json")
        firebase_admin.initialize_app(cred)
    
    # Get Firestore client
    db = firestore.client()
    return db

db = initialize_firebase()

class FirestoreService:
    def __init__(self):
        self.db = db
    
    def get_user_preferences(self, user_id: str):
        """Get user preferences from Firestore"""
        try:
            doc_ref = self.db.collection('users').document(user_id)
            doc = doc_ref.get()
            
            if doc.exists:
                data = doc.to_dict()
                return data.get('preferences', None)
            else:
                print(f"No preferences found for user: {user_id}")
                return None
        except Exception as e:
            print(f"Error getting user preferences: {e}")
            return None
    
    def save_user_preferences(self, user_id: str, preferences: dict):
        """Save user preferences to Firestore"""
        try:
            doc_ref = self.db.collection('users').document(user_id)
            doc_ref.set({
                'preferences': preferences,
                'last_updated': firestore.SERVER_TIMESTAMP
            }, merge=True)
            print(f"✅ Preferences saved for user: {user_id}")
            return True
        except Exception as e:
            print(f"Error saving preferences: {e}")
            return False
    
    def save_processed_news(self, user_id: str, processed_articles: list):
        """Save AI-processed news articles for a user"""
        try:
            doc_ref = self.db.collection('users').document(user_id)
            doc_ref.update({
                'processed_news': processed_articles,
                'last_news_update': firestore.SERVER_TIMESTAMP
            })
            print(f"✅ Processed news saved for user: {user_id}")
            return True
        except Exception as e:
            print(f"Error saving processed news: {e}")
            return False
    
    def get_all_users_for_processing(self):
        """Get all users who have preferences set for news processing"""
        try:
            users_ref = self.db.collection('users')
            docs = users_ref.where('preferences.newsInterests', '>', '').get()
            
            users = []
            for doc in docs:
                user_data = doc.to_dict()
                users.append({
                    'user_id': doc.id,
                    'preferences': user_data.get('preferences', {}),
                    'last_updated': user_data.get('last_updated')
                })
            
            return users
        except Exception as e:
            print(f"Error getting users for processing: {e}")
            return []

# Create a global instance
firestore_service = FirestoreService()
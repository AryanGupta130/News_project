from time import timezone
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime, timezone  # Update this import line

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
            if not self.db:
                print("Firestore not available - returning None")
                return None
                
            doc_ref = self.db.collection('users').document(user_id)
            doc = doc_ref.get()
            
            if doc.exists:
                data = doc.to_dict()
                # Fix: Check if data is not None and has preferences
                if data and 'preferences' in data:
                    return data['preferences']
                else:
                    print(f"No preferences found in document for user: {user_id}")
                    return None
            else:
                print(f"No document found for user: {user_id}")
                return None
        except Exception as e:
            print(f"Error getting user preferences: {e}")
            return None
    
    def save_user_preferences(self, user_id: str, preferences: dict):
        """Save user preferences to Firestore"""
        try:
            if not self.db:
                print("Firestore not available - preferences not saved")
                return False
                
            doc_ref = self.db.collection('users').document(user_id)
            doc_ref.set({
                'preferences': preferences,
                'last_updated': datetime.now(timezone.utc)
            }, merge=True)
            print(f"✅ Preferences saved for user: {user_id}")
            return True
        except Exception as e:
            print(f"Error saving preferences: {e}")
            return False

    def save_user_profile(self, user_id: str, profile: dict):
        """Save user profile to Firestore"""
        try:
            if not self.db:
                print("Firestore not available - profile not saved")
                return False
                
            doc_ref = self.db.collection('users').document(user_id)
            doc_ref.set({
                'profile': profile,
                'created_at': datetime.now(timezone.utc)
            }, merge=True)
            print(f"✅ Profile saved for user: {user_id}")
            return True
        except Exception as e:
            print(f"Error saving profile: {e}")
            return False
            
    def get_user_profile(self, user_id: str):
        """Get user profile from Firestore"""
        try:
            if not self.db:
                print("Firestore not available - returning None")
                return None
                
            doc_ref = self.db.collection('users').document(user_id)
            doc = doc_ref.get()
            
            if doc.exists:
                data = doc.to_dict()
                if data and 'profile' in data:
                    return data['profile']
            return None
        except Exception as e:
            print(f"Error getting user profile: {e}")
            return None

# Create a global instance
firestore_service = FirestoreService()
import React, { useState } from 'react';
import './UserPreferences.css';

interface UserPreferencesProps {
  user: string;
  onLogout: () => void;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({ user, onLogout }) => {
  const [newsInterests, setNewsInterests] = useState('');
  const [readingFormat, setReadingFormat] = useState<'summary' | 'full' | 'headlines'>('summary');
  const [deliveryTime, setDeliveryTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');

  const handleSavePreferences = async () => {
    if (!newsInterests.trim()) {
      setError('Please enter your news interests');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Prepare the preferences object
      const preferences = {
        newsInterests: newsInterests.trim(),
        readingFormat,
        deliveryTime,
        updatedAt: new Date().toISOString()
      };

      // Make the API call to save preferences
      const response = await fetch('http://localhost:8080/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.split('@')[0], // Use username part of email as ID
          preferences: preferences
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch user profile when component mounts
  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/profile/${user.split('@')[0]}`);
        if (response.ok) {
          const data = await response.json();
          if (data.profile && data.profile.firstName) {
            setFirstName(data.profile.firstName);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  return (
    <div className="preferences-container">
      <header className="preferences-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">📰 NewsPersonal</h1>
            <p className="app-subtitle">Your personal news curator</p>
          </div>
          <div className="user-section">
            <span className="welcome-text">Welcome, {firstName || user.split('@')[0]}!</span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="preferences-main">
        <div className="setup-container">
          <div className="setup-header">
            <h2>🎯 Tell us what news matters to you</h2>
            <p className="setup-description">
              Describe in your own words what kind of news you'd like to receive.
            </p>
          </div>

          <div className="preferences-form">
            <div className="form-section">
              <label htmlFor="preferences" className="form-label">
                What kind of news interests you? <span className="required">*</span>
              </label>
              <textarea
                id="preferences"
                value={newsInterests}
                onChange={(e) => setNewsInterests(e.target.value)}
                placeholder="e.g., I'm interested in technology startups, especially AI and machine learning. I also like environmental news and sustainable energy developments..."
                className="preferences-textarea"
                rows={6}
              />
              <div className="char-count">
                {newsInterests.length}/500 characters
              </div>
            </div>

            <div className="form-row">
              <div className="form-section">
                <label htmlFor="format" className="form-label">
                  How would you like to read your news?
                </label>
                <select
                  id="format"
                  value={readingFormat}
                  onChange={(e) => setReadingFormat(e.target.value as 'summary' | 'full' | 'headlines')}
                  className="form-select"
                >
                  <option value="summary">Quick summaries (2-3 sentences)</option>
                  <option value="full">Detailed articles</option>
                  <option value="headlines">Headlines only</option>
                </select>
              </div>

              <div className="form-section">
                <label htmlFor="delivery" className="form-label">
                  When would you like to receive your news?
                </label>
                <select
                  id="delivery"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value as 'morning' | 'afternoon' | 'evening')}
                  className="form-select"
                >
                  <option value="morning">Morning (8:00 AM)</option>
                  <option value="afternoon">Afternoon (1:00 PM)</option>
                  <option value="evening">Evening (6:00 PM)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              disabled={!newsInterests.trim() || isLoading}
              className="save-preferences-btn"
            >
              {isLoading ? 'Saving...' : 'Save My Preferences 🚀'}
            </button>

            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPreferences;

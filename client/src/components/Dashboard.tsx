import React, { useState } from 'react';
import { authService } from '../firebase/authService';
import './Dashboard.css';

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [newsPreferences, setNewsPreferences] = useState('');
  const [readingFormat, setReadingFormat] = useState('summary');
  const [deliveryTime, setDeliveryTime] = useState('morning');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still logout on frontend even if Firebase call fails
      onLogout();
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    // TODO: Save preferences to backend
    setTimeout(() => {
      setIsLoading(false);
      setHasPreferences(true);
    }, 1500);
  };

  const handleEditPreferences = () => {
    setHasPreferences(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">📰 NewsPersonal</h1>
            <p className="app-subtitle">Your AI-powered personal news curator</p>
          </div>
          <div className="user-section">
            <span className="welcome-text">Welcome, {user.split('@')[0]}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {!hasPreferences ? (
          /* Onboarding/Setup View */
          <div className="setup-container">
            <div className="setup-header">
              <h2>🎯 Tell us what news matters to you</h2>
              <p className="setup-description">
                Describe in your own words what kind of news you'd like to receive. 
                Our AI will understand your interests and curate personalized articles just for you.
              </p>
            </div>

            <div className="preferences-form">
              <div className="form-section">
                <label htmlFor="preferences" className="form-label">
                  What kind of news interests you? <span className="required">*</span>
                </label>
                <textarea
                  id="preferences"
                  value={newsPreferences}
                  onChange={(e) => setNewsPreferences(e.target.value)}
                  placeholder="e.g., I'm interested in technology startups, especially AI and machine learning. I also like environmental news and sustainable energy developments. I prefer positive stories about innovation and scientific breakthroughs..."
                  className="preferences-textarea"
                  rows={6}
                />
                <div className="char-count">
                  {newsPreferences.length}/500 characters
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
                    onChange={(e) => setReadingFormat(e.target.value)}
                    className="form-select"
                  >
                    <option value="summary">Quick summaries (2-3 sentences)</option>
                    <option value="detailed">Detailed articles</option>
                    <option value="bullet">Bullet points</option>
                    <option value="digest">Daily digest format</option>
                  </select>
                </div>

                <div className="form-section">
                  <label htmlFor="delivery" className="form-label">
                    When would you like to receive your news?
                  </label>
                  <select
                    id="delivery"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="form-select"
                  >
                    <option value="morning">Morning (8:00 AM)</option>
                    <option value="afternoon">Afternoon (1:00 PM)</option>
                    <option value="evening">Evening (6:00 PM)</option>
                    <option value="realtime">Real-time updates</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                disabled={!newsPreferences.trim() || isLoading}
                className="save-preferences-btn"
              >
                {isLoading ? 'Setting up your news feed...' : 'Start My Personal News Feed 🚀'}
              </button>
            </div>

            <div className="features-preview">
              <h3>What you'll get:</h3>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🤖</div>
                  <h4>AI-Curated</h4>
                  <p>Smart algorithms understand your interests</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📱</div>
                  <h4>Personalized</h4>
                  <p>News tailored to your specific preferences</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <h4>Fresh Updates</h4>
                  <p>Latest news delivered when you want it</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🎨</div>
                  <h4>Your Format</h4>
                  <p>Read news in the style that suits you</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard View */
          <div className="news-dashboard">
            <div className="dashboard-content">
              <div className="preferences-summary">
                <h3>Your News Preferences</h3>
                <div className="preference-card">
                  <p><strong>Interests:</strong> {newsPreferences}</p>
                  <p><strong>Format:</strong> {readingFormat}</p>
                  <p><strong>Delivery:</strong> {deliveryTime}</p>
                  <button onClick={handleEditPreferences} className="edit-btn">
                    Edit Preferences
                  </button>
                </div>
              </div>

              <div className="news-section">
                <h3>Today's News for You</h3>
                <div className="coming-soon">
                  <div className="coming-soon-icon">🚧</div>
                  <h4>News Feed Coming Soon!</h4>
                  <p>We're setting up your personalized news feed based on your preferences.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

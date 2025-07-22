import React, { useState, useEffect } from 'react';
import { authService } from '../firebase/authService';
import { apiService, type UserPreferences, type NewsArticle } from '../api/services';
import './Dashboard.css';

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [newsPreferences, setNewsPreferences] = useState('');
  const [readingFormat, setReadingFormat] = useState<'summary' | 'full' | 'headlines'>('summary');
  const [deliveryTime, setDeliveryTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [error, setError] = useState('');

  // Load user preferences on component mount
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        setIsLoading(true);
        const result = await apiService.getUserPreferences(user);
        
        if (result.success && result.preferences) {
          setNewsPreferences(result.preferences.newsInterests);
          setReadingFormat(result.preferences.readingFormat);
          setDeliveryTime(result.preferences.deliveryTime);
          setHasPreferences(true);
          
          // Load news articles for this user
          loadNewsArticles();
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        setError('Failed to load your preferences');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadNewsArticles = async () => {
    try {
      setLoadingNews(true);
      const result = await apiService.processNewsForUser(user);
      
      if (result.success && result.articles) {
        setNewsArticles(result.articles);
      } else {
        setError(result.error || 'Failed to load news articles');
      }
    } catch (error) {
      console.error('Error loading news:', error);
      setError('Failed to load news articles');
    } finally {
      setLoadingNews(false);
    }
  };

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
    if (!newsPreferences.trim()) {
      setError('Please enter your news interests');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const preferences: UserPreferences = {
        newsInterests: newsPreferences.trim(),
        readingFormat,
        deliveryTime
      };

      const result = await apiService.saveUserPreferences(user, preferences);
      
      if (result.success) {
        setHasPreferences(true);
        // Load news articles after saving preferences
        loadNewsArticles();
      } else {
        setError(result.error || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
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
            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button onClick={() => setError('')} className="dismiss-error">Dismiss</button>
              </div>
            )}
            
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
                <div className="news-header">
                  <h3>Today's News for You</h3>
                  <button 
                    onClick={loadNewsArticles} 
                    disabled={loadingNews}
                    className="refresh-btn"
                  >
                    {loadingNews ? '🔄 Loading...' : '🔄 Refresh News'}
                  </button>
                </div>
                
                {loadingNews ? (
                  <div className="loading-news">
                    <div className="loading-spinner">⏳</div>
                    <p>Our AI is curating personalized news just for you...</p>
                    <div className="loading-steps">
                      <div className="step">📰 Scanning latest articles</div>
                      <div className="step">🤖 Analyzing with AI</div>
                      <div className="step">✨ Personalizing content</div>
                    </div>
                  </div>
                ) : newsArticles.length > 0 ? (
                  <div className="articles-container">
                    <div className="articles-header">
                      <p className="articles-subtitle">
                        ✨ {newsArticles.length} articles curated specifically for your interests
                      </p>
                    </div>
                    <div className="articles-grid">
                      {newsArticles.map((article, index) => (
                        <div key={index} className="article-card premium">
                          <div className="article-badge">
                            {article.relevance_score && (
                              <span className="relevance-badge">
                                {Math.round(article.relevance_score * 100)}% match
                              </span>
                            )}
                            <span className="source-badge">{article.source}</span>
                          </div>
                          
                          <h4 className="article-title">{article.title}</h4>
                          
                          <p className="article-summary">{article.summary}</p>
                          
                          {article.why_relevant && (
                            <div className="relevance-explanation">
                              <span className="relevance-icon">💡</span>
                              <span className="relevance-text">{article.why_relevant}</span>
                            </div>
                          )}
                          
                          <div className="article-meta">
                            <span className="article-date">
                              {new Date(article.published_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="read-more-btn premium"
                          >
                            <span>Read Full Article</span>
                            <span className="arrow">→</span>
                          </a>
                        </div>
                      ))}
                    </div>
                    
                    <div className="articles-footer">
                      <div className="personalization-info">
                        <h4>🎯 How we personalized this for you:</h4>
                        <p>Our AI analyzed your interests in "{newsPreferences}" and selected the most relevant, high-quality articles from trusted sources.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="coming-soon">
                    <div className="coming-soon-icon">📰</div>
                    <h4>Your News Feed is Ready!</h4>
                    <p>Click "Refresh News" above to get your first personalized news articles.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

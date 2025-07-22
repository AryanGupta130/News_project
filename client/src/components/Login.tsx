import React, { useState } from 'react';
import { authService } from '../firebase/authService';
import './Login.css';

interface LoginProps {
  onLoginSuccess?: (user: string) => void; // Made optional since we're using Firebase auth state
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess = () => {} }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Create new account
        const result = await authService.register(email, password);
        if (result.success && result.user) {
          onLoginSuccess(result.user.email || email);
        } else {
          setError(result.message);
        }
      } else {
        // Sign in existing user
        const result = await authService.login(email, password);
        if (result.success && result.user) {
          onLoginSuccess(result.user.email || email);
        } else {
          setError(result.message);
        }
      }
    } catch (error: any) {
      setError(error.message || (isSignUp ? 'Registration failed. Please try again.' : 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="app-logo">
              <span className="logo-icon">📰</span>
              <h1 className="logo-text">NewsPersonal</h1>
            </div>
            <p className="login-subtitle">
              {isSignUp ? 'Create your account to get started' : 'Welcome back! Please sign in to continue'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="input-field"
                  placeholder="Enter your email"
                />
                <span className="input-icon">📧</span>
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  className="input-field"
                  placeholder="Enter your password"
                />
                <span className="input-icon">🔒</span>
              </div>
            </div>

            {isSignUp && (
              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">
                  Confirm Password
                </label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                    className="input-field"
                    placeholder="Confirm your password"
                  />
                  <span className="input-icon">🔐</span>
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !email || !password} 
              className="submit-button"
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  <span className="button-icon">{isSignUp ? '🚀' : '🔑'}</span>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="login-footer">
            <div className="divider">
              <span className="divider-text">or</span>
            </div>
            <p className="toggle-text">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button onClick={toggleMode} className="toggle-button" disabled={loading}>
              {isSignUp ? 'Sign In Instead' : 'Create New Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

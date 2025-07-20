import React, { useState } from 'react';
import { authService } from '../firebase/authService';
import './Login.css';

interface LoginProps {
  onLoginSuccess: (user: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
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
    <div className="login-container">
      <div className="login-form">
        <h2>{isSignUp ? 'Create Account' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? (isSignUp ? 'Creating Account...' : 'Logging in...') : (isSignUp ? 'Create Account' : 'Login')}
          </button>
        </form>

        <div className="toggle-container">
          <p className="toggle-text">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button onClick={toggleMode} className="toggle-button">
            {isSignUp ? 'Login here' : 'Sign up here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from 'react';
import { authService } from '../firebase/authService';
import './Dashboard.css';

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to the Dashboard</h1>
        <div className="user-info">
          <span>Logged in as: {user}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>Dashboard Content</h2>
          <p>You are successfully logged in with Firebase authentication!</p>
          <p>This is where your main application content would go.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

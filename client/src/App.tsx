import { useState, useEffect } from 'react';
import { auth } from './firebase/config';
import { onAuthStateChanged, type User } from 'firebase/auth';
import Login from './components/Login';
import UserPreferences from './components/UserPreferences';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <UserPreferences user={user.email || 'User'} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={() => {}} /* onLoginSuccess is no longer needed */ />
      )}
    </div>
  );
}

export default App;

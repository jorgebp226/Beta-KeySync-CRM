import React from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { useAuthStore } from './store/auth';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthComponent from './components/auth/AuthComponent';
import Dashboard from './components/dashboard/Dashboard';

Amplify.configure(awsconfig);

function App() {
  const { isAuthenticated, user, setAuth } = useAuthStore();

  const handleLogout = () => {
    setAuth(false, null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthComponent />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
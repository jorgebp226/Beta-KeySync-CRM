import React, { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signOut } from 'aws-amplify/auth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import awsconfig from './aws-exports';
import { useAuthStore } from './store/auth';
import AuthComponent from './components/auth/AuthComponent';
import Dashboard from './components/dashboard/Dashboard';
import Layout from './components/layout/Layout';
import SurveyStep1 from './components/survey/SurveyStep1';
import SurveyStep2 from './components/survey/SurveyStep2';
import SurveyStep3 from './components/survey/SurveyStep3';
import LoadingPage from './pages/LoadingPage';

Amplify.configure(awsconfig);

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/auth" replace />;
};

// Nueva ruta para verificar si el usuario necesita completar el survey
const SurveyCheck = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const hasCompletedSurvey = localStorage.getItem('surveyCompleted') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasCompletedSurvey) {
    return <Navigate to="/survey/step1" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated, user, setAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('surveyCompleted');
      setAuth(false, null);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />
          }
        />
        
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthComponent />
            </PublicRoute>
          }
        />

        {/* Rutas del Survey */}
        <Route
          path="/survey/step1"
          element={
            <PrivateRoute>
              <SurveyStep1 />
            </PrivateRoute>
          }
        />
        <Route
          path="/survey/step2"
          element={
            <PrivateRoute>
              <SurveyStep2 />
            </PrivateRoute>
          }
        />
        <Route
          path="/survey/step3"
          element={
            <PrivateRoute>
              <SurveyStep3 />
            </PrivateRoute>
          }
        />
        <Route
          path="/loading"
          element={
            <PrivateRoute>
              <LoadingPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/*"
          element={
            <SurveyCheck>
              <Layout user={user} onLogout={handleLogout}>
                <Dashboard user={user} onLogout={handleLogout} />
              </Layout>
            </SurveyCheck>
          }
        />

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
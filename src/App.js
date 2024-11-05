import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { signOut } from 'aws-amplify/auth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import awsconfig from './aws-exports';
import { useAuthStore } from './store/auth';
import { checkSurveyStatus } from './api/checkSurveyStatus';
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
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Componente de verificación del survey modificado
const SurveyCheck = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(true); // Default a true

  useEffect(() => {
    const fetchSurveyStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const surveyStatus = await checkSurveyStatus(user.userId);
          setHasCompletedSurvey(surveyStatus);
        } catch (error) {
          console.error('Error checking survey status:', error);
          setHasCompletedSurvey(true); // En caso de error, permitimos el acceso
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSurveyStatus();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return null; // o un componente de loading si lo prefieres
  }

  // Siempre permitimos el acceso al dashboard después del loading page
  const isFromLoadingPage = window.location.pathname === '/loading';
  if (isFromLoadingPage) {
    return children;
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
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
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

        {/* Dashboard */}
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
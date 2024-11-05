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

// Nueva ruta para redirigir solo a usuarios que no han completado el survey
const SurveyCheck = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(null);

  useEffect(() => {
    const fetchSurveyStatus = async () => {
      if (isAuthenticated && user) {
        const surveyStatus = await checkSurveyStatus(user.userId);
        setHasCompletedSurvey(surveyStatus);
      }
    };

    fetchSurveyStatus();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirigir al inicio del survey si el estado es nulo
  if (hasCompletedSurvey === null) {
    return <Navigate to="/survey/step1" replace />;
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

        {/* Rutas del Survey solo para nuevos usuarios */}
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

        {/* Dashboard accesible solo si el usuario completó el survey */}
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

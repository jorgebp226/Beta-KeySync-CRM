import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';
import './LoadingPage.css';

const LoadingPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sendSurveyData = async () => {
      try {
        // Obtener el usuario actual con Amplify v6
        const user = await getCurrentUser();
        const userId = user.userId;

        const surveyStep1 = JSON.parse(localStorage.getItem('surveyStep1')) || {};
        const surveyStep2 = JSON.parse(localStorage.getItem('surveyStep2')) || '';
        const surveyStep3 = JSON.parse(localStorage.getItem('surveyStep3')) || '';

        const response = await fetch('https://wa9rhtsgbf.execute-api.eu-west-3.amazonaws.com/keysync/survey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sub: userId,
            ...surveyStep1,
            sector: surveyStep2,
            whatsappContacts: surveyStep3
          }),
        });

        if (!response.ok) {
          throw new Error('Error en la respuesta de la API');
        }

        // Marcar el survey como completado en localStorage
        localStorage.setItem('surveyCompleted', 'true');
        
        // Limpiar los datos del survey de localStorage
        localStorage.removeItem('surveyStep1');
        localStorage.removeItem('surveyStep2');
        localStorage.removeItem('surveyStep3');

        // Redirigir al Dashboard
        navigate('/dashboard');

      } catch (error) {
        console.error('Error al enviar los datos:', error);
        setError('Hubo un error al procesar tus datos');
      }
    };

    sendSurveyData();

    // Simulación de progreso
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 3) {
          return prevProgress + 1;
        }
        clearInterval(timer);
        return prevProgress;
      });
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [navigate]);

  return (
    <div className="loading-container">
      <div className="loading-header">
        <img src={`${process.env.PUBLIC_URL}/KS-removebg-preview.png`} alt="Logo" className="loading-logo" />
      </div>
      <div className="loading-content">
        <div className="loading-text">
          <h1>Estamos preparando tu cuenta...</h1>
          {error ? (
            <div className="error-message">
              {error}
              <p>Por favor, <a href="/survey/step1">intenta nuevamente</a>.</p>
            </div>
          ) : (
            <ul>
              <li className={progress > 0 ? 'completed' : ''}>
                Recopilando datos {progress > 0 && <span>✓</span>}
              </li>
              <li className={progress > 1 ? 'completed' : ''}>
                Personalizando tu configuración {progress > 1 && <span>✓</span>}
              </li>
              <li className={progress > 2 ? 'completed' : ''}>
                Generando recomendaciones {progress > 2 && <span>✓</span>}
              </li>
            </ul>
          )}
          <p>Si no se te redirige automáticamente, haz clic <a href="/dashboard">aquí</a>.</p>
        </div>
      </div>
      <div className="loading-image">
        <img src={`${process.env.PUBLIC_URL}/loading.png`} alt="Loading" />
      </div>
    </div>
  );
};

export default LoadingPage;

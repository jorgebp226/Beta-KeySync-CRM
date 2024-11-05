// src/api/checkSurveyStatus.js

export const checkSurveyStatus = async (userId) => {
    try {
      const response = await fetch('https://wa9rhtsgbf.execute-api.eu-west-3.amazonaws.com/keysync/survey-completed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ sub: userId })
      });
  
      if (!response.ok) {
        console.error('Error response:', response.status);
        return true; // En caso de error, permitimos el acceso al dashboard
      }
  
      const data = await response.json();
      return data.surveyCompleted ?? true; // Si no hay respuesta clara, permitimos el acceso
    } catch (error) {
      console.error('Error al verificar el estado del survey:', error);
      return true; // En caso de error, permitimos el acceso al dashboard
    }
};
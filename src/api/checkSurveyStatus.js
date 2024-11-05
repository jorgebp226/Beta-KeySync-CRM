// src/api/checkSurveyStatus.js

export const checkSurveyStatus = async (userId) => {
    try {
      const response = await fetch('https://wa9rhtsgbf.execute-api.eu-west-3.amazonaws.com/keysync/survey-completed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sub: userId }),
      });
  
      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }
  
      const data = await response.json();
      return data.surveyCompleted;
    } catch (error) {
      console.error('Error al verificar el estado del survey:', error);
      return false; // En caso de error, devolvemos false para redirigir al survey
    }
  };
  
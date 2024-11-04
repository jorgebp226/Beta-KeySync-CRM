import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const api = axios.create();

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken.toString();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json'; // Agrega el Content-Type a cada solicitud
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

// Verificar si el usuario tiene CRM
export const checkLeadsStatus = async (sub) => {
  return api.get(`https://wa9rhtsgbf.execute-api.eu-west-3.amazonaws.com/keysync/check-crm/${sub}`);
};

// Obtener leads del usuario
export const getUserLeads = async (sub) => {
  const response = await api.get(`https://wa9rhtsgbf.execute-api.eu-west-3.amazonaws.com/keysync/leads/${sub}`);
  return response.data;
};

// Inicializar WhatsApp y obtener QR
export const initializeWhatsApp = async (sub) => {
  const data = {
    maxChats: 10,
    maxMessagesPerChat: 1000,
  };

  return api.post(`http://13.36.209.139:3000/start/${sub}`, data);
};

// Obtener código QR
export const getQRCode = async (sub) => {
  return api.get(`https://wa9rhtsgbf.execute-api.eu-west-3.amazonaws.com/keysync/qr-code?sub=${sub}`);
};

import axios from 'axios';

const api = axios.create();

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
  return api.post(`https://wa9rhtsgbf.execute-api.eu-west-3.amazonaws.com/keysync/start${sub}`);
};

// Obtener código QR
export const getQRCode = async (sub) => {
  return api.get(`https://wa9rhtsgbf.execute-api.eu-west-3.amazonaws.com/keysync/qr-code?sub=${sub}`);
};

// chatApi.js
import axios from 'axios';

const BASE_URL = 'https://wa9rhtsgbf.execute-api.eu-west-3.amazonaws.com/keysync';

export const getConversation = async (sub, chatId) => {
  const response = await axios.get(`${BASE_URL}/conversation/${sub}/${chatId}`);
  return response.data;
};

export const sendMessage = async (sub, recipient, message) => {
  const response = await axios.post(`${BASE_URL}/send-message/${sub}`, {
    recipient,
    message
  });
  return response.data;
};
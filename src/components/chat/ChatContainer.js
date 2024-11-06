// ChatContainer.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatComponent from './ChatComponent';
import { getConversation, sendMessage } from '../services/chatApi';
import { Loader2 } from 'lucide-react';

const ChatContainer = ({ user }) => {
  const { chatId } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversation();
  }, [chatId]);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      const data = await getConversation(user.userId, chatId);
      setLead(data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (recipient, message) => {
    try {
      await sendMessage(user.userId, recipient, message);
      // Optionally refresh the conversation after sending
      await fetchConversation();
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ChatComponent 
      lead={lead} 
      onSendMessage={handleSendMessage}
    />
  );
};

export default ChatContainer;
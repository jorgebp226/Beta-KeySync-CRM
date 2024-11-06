import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Send, MoreVertical, PhoneCall, Archive, Copy } from 'lucide-react';
import { Button } from '../ui/button';

const ChatComponent = ({ lead, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (lead?.mensajes) {
      setMessages(lead.mensajes);
      scrollToBottom();
    }
  }, [lead]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      await onSendMessage(lead.telefono, message);
      setMessages([...messages, {
        de: 'Tu',
        cuerpo: message,
        timestamp: Date.now()
      }]);
      setMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {lead?.nombreContacto?.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold">{lead?.nombreContacto}</h2>
            <p className="text-sm text-gray-500">{lead?.telefono}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <PhoneCall className="w-5 h-5 text-gray-500 cursor-pointer" />
          <Archive className="w-5 h-5 text-gray-500 cursor-pointer" />
          <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.de === 'Tu' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.de === 'Tu' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border'
              }`}
            >
              <p>{msg.cuerpo}</p>
              <p className="text-xs opacity-70 mt-1">
                {formatTimestamp(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Write a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
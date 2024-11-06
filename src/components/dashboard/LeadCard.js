// LeadCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { MessageCircle } from 'lucide-react';
import LeadScore from './LeadScore';
import { Button } from '../ui/button';

const LeadCard = ({ lead }) => {
  console.log('Lead data:', lead);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const getStatusColor = (estado) => {
    const colors = {
      'Primeras conversaciones': 'bg-blue-100 text-blue-800',
      'Presupuestos y casas presentadas': 'bg-yellow-100 text-yellow-800',
      'Primeras visitas presenciales hechas': 'bg-green-100 text-green-800',
      'Casa comprada – seguimiento': 'bg-purple-100 text-purple-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const handleCardClick = (e) => {
    // Evitar que el click del botón de chat expanda la tarjeta
    if (!e.target.closest('.chat-button')) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleChatClick = (e) => {
    e.stopPropagation();
    navigate(`/chat/${lead.chatId}`);
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow" 
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{lead.nombreContacto}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="chat-button"
              onClick={handleChatClick}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-500">{lead.telefono}</p>
          <span className={`inline-block px-3 py-1 mt-2 text-sm rounded-full ${getStatusColor(lead.estadoLead)}`}>
            {lead.estadoLead}
          </span>
        </div>
        <LeadScore score={lead.scoreLead} />
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Resumen de la conversación</h4>
          <p className="text-sm text-gray-600">{lead.resumenConversacion}</p>
          
          {lead.productosenviados?.length > 0 && (
            <>
              <h4 className="font-medium mt-4 mb-2">Ofertas mostradas</h4>
              <ul className="text-sm text-gray-600">
                {lead.productosenviados.map((url, index) => (
                  <li key={index} className="mb-1">
                    <a 
                      href={url} 
                      className="text-blue-600 hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default LeadCard;
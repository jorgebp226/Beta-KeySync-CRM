import React, { useState } from 'react';
import { Card } from '../ui/card';
import LeadScore from './LeadScore';

const LeadCard = ({ lead }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (estado) => {
    const colors = {
      'Primeras conversaciones': 'bg-blue-100 text-blue-800',
      'Presupuestos y casas presentadas': 'bg-yellow-100 text-yellow-800',
      'Primeras visitas presenciales hechas': 'bg-green-100 text-green-800',
      'Casa comprada – seguimiento': 'bg-purple-100 text-purple-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow" 
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{lead.nombreContacto}</h3>
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
          
          {lead.viviendasEnviadas?.length > 0 && (
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
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Loader2 } from 'lucide-react';
import LeadCard from './LeadCard';
import QRScanner from '../qr/QRScanner';
import { checkLeadsStatus, getUserLeads } from '../../services/api';

const Dashboard = ({ user, onLogout }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasCRM, setHasCRM] = useState(false);
  const [initialCheck, setInitialCheck] = useState(true);

  useEffect(() => {
    checkUserCRM();
  }, [user]);

  const checkUserCRM = async () => {
    try {
      const response = await checkLeadsStatus(user.userId);
      setHasCRM(response.data.exists);
      if (response.data.exists) {
        fetchLeads();
      }
    } catch (error) {
      console.error('Error checking CRM status:', error);
    } finally {
      setInitialCheck(false);
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const leadsData = await getUserLeads(user.userId);
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialCheck) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hasCRM) {
    return <QRScanner sub={user.userId} onComplete={checkUserCRM} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tus Leads</h2>
          <p className="mt-1 text-sm text-gray-600">Gestiona tus contactos de WhatsApp</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
            Cerrar Sesión
          </button>
        </div>
      </div>
      {/* Resto del contenido del dashboard */}
    </div>
  );
};

export default Dashboard;
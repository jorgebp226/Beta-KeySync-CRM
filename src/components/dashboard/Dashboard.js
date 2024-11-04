import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Loader2 } from 'lucide-react';
import LeadCard from './LeadCard';
import QRScanner from '../qr/QRScanner';
import { checkLeadsStatus, getUserLeads } from '../../services/api';

const Dashboard = ({ user }) => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tus Leads</h2>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona tus contactos de WhatsApp
          </p>
        </div>
        <div className="flex gap-4">
          {/* Filtros y stats */}
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {leads.filter(l => l.scoreLead >= 70).length}
                </div>
                <div className="text-sm text-gray-600">Hot Leads</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {leads.filter(l => l.scoreLead >= 40 && l.scoreLead < 70).length}
                </div>
                <div className="text-sm text-gray-600">Warm Leads</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {leads.filter(l => l.scoreLead < 40).length}
                </div>
                <div className="text-sm text-gray-600">Cold Leads</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead) => (
            <LeadCard key={lead.chatId} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
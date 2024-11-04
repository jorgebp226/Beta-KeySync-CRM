import React, { useState, useEffect } from 'react';
import { initializeWhatsApp, getQRCode } from '../../services/api';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Loader2 } from 'lucide-react';

const QRScanner = ({ sub }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('initial'); // initial, loading, scanning, complete

  const startWhatsAppSync = async () => {
    setLoading(true);
    setError(null);
    try {
      // Iniciar el proceso de WhatsApp
      await initializeWhatsApp(sub);
      setStatus('scanning');
      
      // Comenzar a consultar el QR
      checkQRCode();
    } catch (err) {
      setError('Error al iniciar la sincronización');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const checkQRCode = async () => {
    try {
      const response = await getQRCode(sub);
      if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
      }
    } catch (err) {
      setError('Error al obtener el código QR');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">
          Sincronizar WhatsApp
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {status === 'initial' && (
          <button
            onClick={startWhatsAppSync}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={loading}
          >
            Sacar CRM desde WhatsApp
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-2">Iniciando sincronización...</p>
          </div>
        )}

        {status === 'scanning' && qrCode && (
          <div className="flex flex-col items-center">
            <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            <p className="mt-4 text-center">
              Escanea este código QR con WhatsApp para comenzar la extracción de contactos
            </p>
          </div>
        )}

        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default QRScanner;
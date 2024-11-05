import React, { useState, useEffect } from 'react';
import { initializeWhatsApp, getQRCode } from '../../services/api';
import { Card, CardContent } from '../ui/card';
import { Loader2, ArrowLeft, X } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

const QRScanner = ({ sub, onComplete }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('initial');
  const [intervalId, setIntervalId] = useState(null);

  const startWhatsAppSync = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await initializeWhatsApp(sub);
      if (response.data.success) {
        setStatus('scanning');
        checkQRCode();
        const id = setInterval(checkQRCode, 5000);
        setIntervalId(id);
      } else {
        setError(response.data.message || 'Error al iniciar la sincronización');
        setStatus('error');
      }
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
      if (response.data.estado === 'escaneado') {
        clearInterval(intervalId);
        setStatus('complete');
        onComplete();
      } else if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
      }
    } catch (err) {
      setError('Error al obtener el código QR');
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const renderContent = () => {
    switch (status) {
      case 'initial':
        return (
          <div className="w-full max-w-md mx-auto bg-black rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <button className="text-gray-400 hover:text-gray-300">
                <ArrowLeft size={20} />
              </button>
              <span className="text-white font-medium">KeySync</span>
              <button className="text-gray-400 hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex justify-center items-center space-x-8 my-8">
              <div className="bg-gray-900 p-4 rounded-lg">
                <img src={`${process.env.PUBLIC_URL}/KS-removebg-preview.png`} alt="App Logo" className="w-12 h-12" />
              </div>
              <div className="flex items-center text-orange-500">
                <div className="w-16 border-t-2 border-dashed border-orange-500"></div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <img src={`${process.env.PUBLIC_URL}/WhatsApp_logo.png`} alt="WhatsApp Logo" className="w-12 h-12" />
              </div>
            </div>

            <p className="text-gray-400 text-center text-sm mb-6">
              KeySync automáticamente mantiene tu cuenta sincronizada con tu cuenta de WhatsApp. 
              Al continuar, aceptas los <a href="#" className="text-orange-500 hover:text-orange-400">términos y condiciones</a>
            </p>

            <button 
              onClick={startWhatsAppSync}
              className="w-full bg-white text-black py-3 rounded-lg hover:bg-gray-100 font-medium"
              disabled={loading}
            >
              Next
            </button>

            <p className="text-gray-500 text-sm text-center mt-4">
              ¿Necesitas ayuda? Por favor contacta con <a href="#" className="text-orange-500 hover:text-orange-400">soporte</a>
            </p>
          </div>
        );

      case 'scanning':
        return (
          <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Vincular WhatsApp</h2>
              <p className="text-gray-600">
                Escanea el QR desde la cuenta de WhatsApp que quieres usar para enviar mensajes a tus clientes.
              </p>
            </div>

            {qrCode && (
              <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
                <img src={qrCode} alt="QR Code" className="w-64 h-64 mx-auto" />
              </div>
            )}

            <div className="space-y-4 text-sm text-gray-600">
              <ol className="list-decimal list-inside space-y-3">
                <li>Abre WhatsApp en tu teléfono.</li>
                <li className="flex items-center">
                  Toca <strong className="mx-1">Menú</strong> 
                  <span className="mx-1">
                    <svg height="18px" viewBox="0 0 24 24" width="18px">
                      <rect fill="#f2f2f2" height="24" rx="3" width="24"></rect>
                      <path d="m12 15.5c.825 0 1.5.675 1.5 1.5s-.675 1.5-1.5 1.5-1.5-.675-1.5-1.5.675-1.5 1.5-1.5zm0-2c-.825 0-1.5-.675-1.5-1.5s.675-1.5 1.5-1.5 1.5.675 1.5 1.5-.675 1.5-1.5 1.5zm0-5c-.825 0-1.5-.675-1.5-1.5s.675-1.5 1.5-1.5 1.5.675 1.5 1.5-.675 1.5-1.5 1.5z" fill="#818b90"></path>
                    </svg>
                  </span>
                  en Android o <strong className="mx-1">Ajustes</strong>
                  <span className="mx-1">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <rect fill="#F2F2F2" width="24" height="24" rx="3"></rect>
                      <path d="M12 18.69c-1.08 0-2.1-.25-2.99-.71L11.43 14c.24.06.4.08.56.08.92 0 1.67-.59 1.99-1.59h4.62c-.26 3.49-3.05 6.2-6.6 6.2zm-1.04-6.67c0-.57.48-1.02 1.03-1.02.57 0 1.05.45 1.05 1.02 0 .57-.47 1.03-1.05 1.03-.54.01-1.03-.46-1.03-1.03zM5.4 12c0-2.29 1.08-4.28 2.78-5.49l2.39 4.08c-.42.42-.64.91-.64 1.44 0 .52.21 1 .65 1.44l-2.44 4C6.47 16.26 5.4 14.27 5.4 12zm8.57-.49c-.33-.97-1.08-1.54-1.99-1.54-.16 0-.32.02-.57.08L9.04 5.99c.89-.44 1.89-.69 2.96-.69 3.56 0 6.36 2.72 6.59 6.21h-4.62zM12 19.8c.22 0 .42-.02.65-.04l.44.84c.08.18.25.27.47.24.21-.03.33-.17.36-.38l.14-.93c.41-.11.82-.27 1.21-.44l.69.61c.15.15.33.17.54.07.17-.1.24-.27.2-.48l-.2-.92c.35-.24.69-.52.99-.82l.86.36c.2.08.37.05.53-.14.14-.15.15-.34.03-.52l-.5-.8c.25-.35.45-.73.63-1.12l.95.05c.21.01.37-.09.44-.29.07-.2.01-.38-.16-.51l-.73-.58c.1-.4.19-.83.22-1.27l.89-.28c.2-.07.31-.22.31-.43s-.11-.35-.31-.42l-.89-.28c-.03-.44-.12-.86-.22-1.27l.73-.59c.16-.12.22-.29.16-.5-.07-.2-.23-.31-.44-.29l-.95.04c-.18-.4-.39-.77-.63-1.12l.5-.8c.12-.17.1-.36-.03-.51-.16-.18-.33-.22-.53-.14l-.86.35c-.31-.3-.65-.58-.99-.82l.2-.91c.03-.22-.03-.4-.2-.49-.18-.1-.34-.09-.48.01l-.74.66c-.39-.18-.8-.32-1.21-.43l-.14-.93a.426.426 0 00-.36-.39c-.22-.03-.39.05-.47.22l-.44.84-.43-.02h-.22c-.22 0-.42.01-.65.03l-.44-.84c-.08-.17-.25-.25-.48-.22-.2.03-.33.17-.36.39l-.13.88c-.42.12-.83.26-1.22.44l-.69-.61c-.15-.15-.33-.17-.53-.06-.18.09-.24.26-.2.49l.2.91c-.36.24-.7.52-1 .82l-.86-.35c-.19-.09-.37-.05-.52.13-.14.15-.16.34-.04.51l.5.8c-.25.35-.45.72-.64 1.12l-.94-.04c-.21-.01-.37.1-.44.3-.07.2-.02.38.16.5l.73.59c-.1.41-.19.83-.22 1.27l-.89.29c-.21.07-.31.21-.31.42 0 .22.1.36.31.43l.89.28c.03.44.1.87.22 1.27l-.73.58c-.17.12-.22.31-.16.51.07.2.23.31.44.29l.94-.05c.18.39.39.77.63 1.12l-.5.8c-.12.18-.1.37.04.52.16.18.33.22.52.14l.86-.36c.3.31.64.58.99.82l-.2.92c-.04.22.03.39.2.49.2.1.38.08.54-.07l.69-.61c.39.17.8.33 1.21.44l.13.93c.03.21.16.35.37.39.22.03.39-.06.47-.24l.44-.84c.23.02.44.04.66.04z" fill="#818b90"></path>
                    </svg>
                  </span>
                  en iPhone.
                </li>
                <li>Toca <strong>Dispositivos vinculados</strong> y, luego, <strong>Vincular un dispositivo</strong>.</li>
                <li>Apunta tu teléfono hacia esta pantalla para escanear el código QR.</li>
              </ol>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold mb-2">Sincronizando contactos</h3>
            <p className="text-gray-600">
              Se están sincronizando tus contactos, esto puede llevar un tiempo...
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        {renderContent()}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default QRScanner;
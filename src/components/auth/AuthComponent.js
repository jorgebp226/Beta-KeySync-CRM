import React, { useEffect, useState } from 'react';
import { getCurrentUser, signUp, signIn, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

const AuthComponent = () => {
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState('signIn');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser();
      setAuth(true, user);
    } catch {
      setAuth(false, null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      switch (formState) {
        case 'signUp':
          if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
          }
          await signUp({
            username: formData.email,
            password: formData.password,
            options: {
              userAttributes: {
                email: formData.email,
              }
            }
          });
          
          setMessage('Se ha enviado un código de verificación a tu correo');
          setFormState('confirmSignUp');
          break;

        case 'confirmSignUp':
          await confirmSignUp({
            username: formData.email,
            confirmationCode: formData.verificationCode
          });
          
          setMessage('Cuenta verificada correctamente. Por favor, inicia sesión.');
          setFormState('signIn');
          setFormData(prev => ({ ...prev, verificationCode: '' }));
          break;

        case 'signIn':
          const signInResult = await signIn({
            username: formData.email,
            password: formData.password,
          });
          
          if (signInResult.isSignedIn) {
            const user = await getCurrentUser();
            setAuth(true, user);
          }
          break;
      }
    } catch (err) {
      handleAuthError(err);
    }
  };

  const handleAuthError = (err) => {
    switch (err.name) {
      case 'UserNotConfirmedException':
        setError('Por favor, verifica tu cuenta primero');
        setFormState('confirmSignUp');
        break;
      case 'UsernameExistsException':
        setError('Este correo electrónico ya está registrado');
        break;
      case 'CodeMismatchException':
        setError('Código de verificación incorrecto');
        break;
      case 'NotAuthorizedException':
        setError('Credenciales incorrectas');
        break;
      default:
        setError(err.message || 'Error en la autenticación');
    }
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({
        username: formData.email,
      });
      setMessage('Se ha enviado un nuevo código de verificación');
      setError('');
    } catch (err) {
      setError('Error al reenviar el código. Por favor, intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 bg-white p-8 shadow-xl">
        <CardHeader className="text-center">
          <img src="/whatsapp-logo.png" alt="WhatsApp CRM" className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">
            WhatsApp CRM
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {formState === 'signIn' && 'Inicia sesión en tu cuenta'}
            {formState === 'signUp' && 'Crea una nueva cuenta'}
            {formState === 'confirmSignUp' && 'Verifica tu cuenta'}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              {formState !== 'confirmSignUp' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              )}

              {formState === 'signUp' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              )}

              {formState === 'confirmSignUp' && (
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                    Código de verificación
                  </label>
                  <input
                    id="verificationCode"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.verificationCode}
                    onChange={(e) => setFormData({...formData, verificationCode: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {formState === 'signIn' && 'Iniciar sesión'}
                {formState === 'signUp' && 'Registrar'}
                {formState === 'confirmSignUp' && 'Confirmar'}
              </button>
            </div>
          </form>

          {formState === 'confirmSignUp' && (
            <button
              type="button"
              onClick={handleResendCode}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reenviar código de verificación
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthComponent;

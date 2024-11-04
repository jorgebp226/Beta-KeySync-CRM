import React, { useEffect, useState } from 'react';
import { getCurrentUser, signUp, signIn, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { Card, CardHeader, CardContent } from '../ui/card';
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
          const confirmResult = await confirmSignUp({
            username: formData.email,
            confirmationCode: formData.verificationCode
          });
          
          if (confirmResult.isSignUpComplete) {
            setMessage('Cuenta verificada correctamente. Por favor, inicia sesión.');
            setFormState('signIn');
            setFormData(prev => ({ ...prev, verificationCode: '' }));
          }
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
      console.error('Error:', err);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <Card className="max-w-md w-full space-y-8 p-8">
        <CardHeader>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            WhatsApp CRM
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {formState === 'signIn' && 'Inicia sesión en tu cuenta'}
            {formState === 'signUp' && 'Crea una nueva cuenta'}
            {formState === 'confirmSignUp' && 'Verifica tu cuenta'}
          </p>
        </CardHeader>
        <CardContent>
          {/* Aquí va el formulario que ya tienes */}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthComponent;

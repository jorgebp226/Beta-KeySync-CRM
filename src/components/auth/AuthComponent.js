import React, { useEffect, useState } from 'react';
import { getCurrentUser, signUp, signIn, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { Card } from '../../components/ui/card';
import { Loader2, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleAuthError = (err) => {
    console.error('Auth error:', err);
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
      case 'UserNotFoundException':
        setError('No existe una cuenta con este correo electrónico');
        break;
      default:
        setError(err.message || 'Error en la autenticación');
    }
  };

  const handleResendCode = async () => {
    try {
      setIsSubmitting(true);
      await resendSignUpCode({
        username: formData.email,
      });
      setMessage('Se ha enviado un nuevo código de verificación');
      setError('');
    } catch (err) {
      setError('Error al reenviar el código. Por favor, intenta de nuevo.');
      console.error('Resend code error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    
    try {
      switch (formState) {
        case 'signUp':
          if (formData.password !== formData.confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
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
          
          setMessage('¡Registro exitoso! Te hemos enviado un código de verificación');
          setFormState('confirmSignUp');
          break;

        case 'confirmSignUp':
          await confirmSignUp({
            username: formData.email,
            confirmationCode: formData.verificationCode
          });
          
          setMessage('¡Cuenta verificada! Ya puedes iniciar sesión');
          setTimeout(() => setFormState('signIn'), 1500);
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

        default:
          break;
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <img 
                src="/whatsapp-logo.png" 
                alt="WhatsApp CRM" 
                className="h-12 w-12 object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              WhatsApp CRM
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {formState === 'signIn' && 'Accede a tu cuenta para gestionar tus leads'}
              {formState === 'signUp' && 'Crea una cuenta para empezar'}
              {formState === 'confirmSignUp' && 'Verifica tu cuenta para continuar'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={formState}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2"
                >
                  {error}
                </motion.div>
              )}

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {message}
                </motion.div>
              )}

              <div className="space-y-4">
                {formState !== 'confirmSignUp' && (
                  <>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        required
                        placeholder="Correo electrónico"
                        className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="password"
                        required
                        placeholder="Contraseña"
                        className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>

                    {formState === 'signUp' && (
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="password"
                          required
                          placeholder="Confirmar contraseña"
                          className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                      </div>
                    )}
                  </>
                )}

                {formState === 'confirmSignUp' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Código de verificación"
                        className="w-full p-3 text-center text-2xl tracking-widest border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.verificationCode}
                        onChange={(e) => setFormData({...formData, verificationCode: e.target.value})}
                        maxLength={6}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isSubmitting}
                      className="w-full p-3 text-gray-600 hover:text-gray-900 text-sm transition-colors disabled:opacity-50"
                    >
                      ¿No recibiste el código? Reenviar
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white p-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {formState === 'signIn' && 'Iniciar sesión'}
                    {formState === 'signUp' && 'Crear cuenta'}
                    {formState === 'confirmSignUp' && 'Verificar cuenta'}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                {formState === 'signIn' ? (
                  <button
                    type="button"
                    onClick={() => setFormState('signUp')}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    ¿No tienes cuenta? Regístrate
                  </button>
                ) : formState === 'signUp' ? (
                  <button
                    type="button"
                    onClick={() => setFormState('signIn')}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio de sesión
                  </button>
                ) : null}
              </div>
            </motion.form>
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthComponent;
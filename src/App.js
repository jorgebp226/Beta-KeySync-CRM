import React from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { useAuthStore } from './store/auth';
import AuthComponent from './components/auth/AuthComponent';
import Dashboard from './components/dashboard/Dashboard';

Amplify.configure(awsconfig);

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return isAuthenticated ? (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">WhatsApp CRM</h1>
          {user && (
            <div className="flex items-center">
              <button
                onClick={() => useAuthStore.getState().setAuth(false, null)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>
      <main>
        <Dashboard user={user} />
      </main>
    </div>
  ) : (
    <AuthComponent />
  );
}

export default App;
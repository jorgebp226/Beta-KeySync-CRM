import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">WhatsApp CRM</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {user.attributes.email}
                </span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </header>
          <main>
            <Dashboard user={user} />
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
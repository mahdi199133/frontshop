
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { SiteConfigProvider } from './context/SiteConfigContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteConfigProvider>
        <AuthProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </AuthProvider>
      </SiteConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);

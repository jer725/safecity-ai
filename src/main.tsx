import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { EmergencyProvider } from './context/EmergencyContext';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
            <LanguageProvider>
        <EmergencyProvider>
          <App />
        </EmergencyProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
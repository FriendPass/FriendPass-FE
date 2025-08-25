import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/sass/style.scss';
import SocketProvider from './socket/SocketProvider';
import './i18n'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);


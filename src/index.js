import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <CartProvider>
        <App />
      </CartProvider>
  </React.StrictMode>
);

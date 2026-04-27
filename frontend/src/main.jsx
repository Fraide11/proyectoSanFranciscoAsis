import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Importamos los Proveedores de Contexto
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Seleccionamos el elemento root del HTML
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    {/* 1. AuthProvider va primero para saber QUIÉN es el usuario */}
    <AuthProvider>
      {/* 2. CartProvider va dentro para que el carrito sepa quién compra */}
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
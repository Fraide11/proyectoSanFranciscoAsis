import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { CartProvider } from './context/CartContext';

// ... en el render:
<CartProvider>
    <App />
</CartProvider>


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider> {/* Enuelves TODA la app */}
      <App />
    </CartProvider>
  </React.StrictMode>,
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

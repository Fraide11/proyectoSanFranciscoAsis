import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Tienda from './Tienda'; 
import AdminPanel from './admin/AdminPanel';

function App() {
  return (
    <Router>
      {/* ESTE ES TU BOTÓN FLOTANTE PARA IR AL ADMIN */}
      <Link to="/admin" style={botonFlotanteStyle}>
        ⚙️
      </Link>

      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

// Estilo para que el botón no estorbe
const botonFlotanteStyle = {
  position: 'fixed',
  bottom: '20px',
  left: '20px',
  zIndex: 5000,
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  padding: '10px',
  borderRadius: '50%',
  textDecoration: 'none',
  fontSize: '1.5rem',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50px',
  height: '50px',
  transition: '0.3s',
  opacity: 0.5 // Se ve clarito hasta que pasas el mouse
};

export default App;
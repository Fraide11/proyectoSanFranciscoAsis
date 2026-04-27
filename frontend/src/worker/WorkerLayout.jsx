import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const WorkerLayout = () => {
  // Función para cerrar sesión de verdad y limpiar el sistema
  const handleLogout = () => {
    localStorage.removeItem('token'); // Asegúrate de que este es el nombre de tu token
    window.location.href = '/'; // Recarga total para limpiar estilos y sesión
  };

  return (
    /* 1. Añadimos la clase 'modo-operativo' para activar el naranja solo aquí */
    <div className="modo-operativo" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a1a' }}>
      
      {/* Mini Sidebar Lateral para el Trabajador */}
      <aside style={{ width: '200px', background: '#16213e', padding: '20px', borderRight: '1px solid var(--accent)' }}>
        <h3 style={{ color: 'var(--accent)', fontSize: '1rem', textTransform: 'uppercase' }}>Panel Operativo</h3>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
          <Link to="/worker" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>🏠 Inicio</Link>
          <Link to="/worker/ventas" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>💰 Nueva Venta</Link>
          <Link to="/worker/inventario" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>📦 Stock</Link>

          <hr style={{ border: '0.5px solid var(--border)', margin: '10px 0' }} />

          {/* Botón de salir con limpieza de sesión */}
          <button 
            onClick={handleLogout} 
            style={{ 
              background: 'none', border: 'none', color: '#ff4d4d', 
              cursor: 'pointer', textAlign: 'left', padding: 0, 
              fontSize: '1rem', fontWeight: 'bold', textDecoration: 'underline' 
            }}
          >
            🚪 Salir
          </button>
        </nav>
      </aside>

      {/* Contenido Dinámico */}
      <main style={{ flex: 1, padding: '30px' }}>
        <Outlet /> 
      </main>
    </div>
  );
};

export default WorkerLayout;

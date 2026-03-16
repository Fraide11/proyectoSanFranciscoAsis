// src/admin/AdminLayout.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminStyles.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="admin-container">
      {/* BARRA LATERAL */}
      <aside className="admin-sidebar">
        <div className="admin-logo">⚙️ Panel Admin</div>
        
        <nav className="admin-nav">
          <Link to="/admin" className={`admin-nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
            📦 Inventario
          </Link>
          <Link to="/admin/ventas" className="admin-nav-item">
            💰 Ventas
          </Link>
          <Link to="/admin/reportes" className="admin-nav-item">
            📊 Reportes
          </Link>
        </nav>

        <Link to="/" className="admin-nav-item" style={{ marginTop: 'auto', border: '1px solid #ff4757', color: '#ff4757', textAlign: 'center' }}>
          🚪 Salir a Tienda
        </Link>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-content">
        <header className="admin-header">
          <h2>Gestión de Repuestos</h2>
          <div style={{ fontSize: '0.9rem', color: '#888' }}>
            Usuario: <strong>Fraider Figueroa</strong>
          </div>
        </header>
        
        <div className="admin-body">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
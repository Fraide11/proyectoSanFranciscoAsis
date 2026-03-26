// frontend/src/admin/AdminLayout.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminStyles.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extraemos info del usuario del localStorage
  const userRole = localStorage.getItem('userRole'); // 'admin' o 'trabajador'
  const userName = "Fraider Figueroa"; // Esto podrías traerlo de un contexto o del token

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Función para verificar si la ruta está activa
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">⚙️ Panel {userRole === 'admin' ? 'Admin' : 'Personal'}</div>
        
        <nav className="admin-nav">
          <Link to="/admin" className={`admin-nav-item ${isActive('/admin')}`}>
            📦 Inventario
          </Link>
          <Link to="/admin/ventas" className={`admin-nav-item ${isActive('/admin/ventas')}`}>
            💰 Ventas
          </Link>
          
          {/* SOLO EL ADMIN VE REPORTES - Según tu Diagrama UML */}
          {userRole === 'admin' && (
            <>
              <Link to="/admin/reportes" className={`admin-nav-item ${isActive('/admin/reportes')}`}>
                📊 Reportes
              </Link>
              <Link to="/admin/workers" className={`admin-nav-item ${isActive('/admin/workers')}`}>
                👥 Trabajadores
              </Link>
            </>
          )}
        </nav>

        <button 
          onClick={handleLogout}
          className="admin-logout-btn"
        >
          🚪 Cerrar Sesión
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h2>{location.pathname.includes('ventas') ? 'Gestión de Ventas' : 
               location.pathname.includes('reportes') ? 'Análisis de Datos' : 
               'Gestión de Repuestos'}</h2>
          
          <div className="admin-user-info">
            <span>{userRole === 'admin' ? '🛡️' : '🔧'}</span>
            <strong>{userName}</strong>
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
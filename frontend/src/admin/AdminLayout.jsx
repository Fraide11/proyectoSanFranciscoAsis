import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminStyles.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- 1. Extracción Segura de Info ---
  // Obtenemos los datos reales guardados en el login
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); // Debe ser 'admin' o 'vendedor'
  const userName = localStorage.getItem('userName') || "Usuario"; // Dinámico

  // --- 2. Protección de Ruta (Front-end) ---
  // Si no hay token o rol, redirigimos al login inmediatamente. 
  // Esto evita que alguien entre escribiendo la URL manual.
  useEffect(() => {
    if (!token || !userRole) {
      navigate('/login');
    }
  }, [token, userRole, navigate]);

  // --- 3. Lógica de Cerrar Sesión ---
  const handleLogout = () => {
    // Borramos TODO el almacenamiento local para seguridad total
    localStorage.clear(); 
    navigate('/login');
  };

  // --- 4. UX: Resaltar Ruta Activa ---
  const isActive = (path) => location.pathname === path ? 'active' : '';

  // --- 5. Título Dinámico del Header ---
  const getHeaderTitle = () => {
    if (location.pathname.includes('ventas')) return 'Gestión de Ventas';
    if (location.pathname.includes('reportes')) return 'Análisis de Datos y Reportes';
    if (location.pathname.includes('workers')) return 'Gestión de Personal';
    return 'Gestión de Repuestos y Productos';
  };

  // Si no está logueado, no renderizamos nada mientras redirige (evita parpadeo)
  if (!token || !userRole) return null;

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        {/* Usamos 'admin' y 'vendedor' para coincidir con tu Backend */}
        <div className="admin-logo">
          ⚙️ San Francisco {userRole === 'admin' ? '(Admin)' : '(Personal)'}
        </div>
        
        <nav className="admin-nav">
          <Link to="/admin" className={`admin-nav-item ${isActive('/admin')}`}>
            📦 Inventario
          </Link>
          <Link to="/admin/ventas" className={`admin-nav-item ${isActive('/admin/ventas')}`}>
            💰 Ventas
          </Link>
          
          {/* --- CONTROL DE ACCESO (RUTAS PRIVADAS) --- */}
          {/* Solo el Admin ve estas opciones, según el diagrama de clases */}
          {userRole === 'admin' && (
            <>
              <div className="admin-nav-divider"></div>
              <Link to="/admin/reportes" className={`admin-nav-item ${isActive('/admin/reportes')}`}>
                📊 Reportes (PDF)
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
          title="Cerrar sesión de forma segura"
        >
          🚪 Cerrar Sesión
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h2>{getHeaderTitle()}</h2>
          
          <div className="admin-user-info">
            {/* Ícono dinámico según el rol */}
            <span className="user-icon">{userRole === 'admin' ? '🛡️' : '🔧'}</span>
            <strong>{userName}</strong>
            <small>({userRole === 'admin' ? 'Administrador' : 'Vendedor'})</small>
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
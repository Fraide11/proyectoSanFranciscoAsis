import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AdminStyles.css';

const AdminLayout = () => {
  const { user, logoutAction } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // --- 1. UX: Funciones de Control ---
  const isActive = (path) => (location.pathname === path ? 'active' : '');
  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const cerrarMenu = () => setMenuAbierto(false);

  // --- 2. Título Dinámico ---
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.includes('ventas')) return 'Gestión de Ventas';
    if (path.includes('reportes')) return 'Reportes e Inteligencia';
    if (path.includes('estadisticas')) return 'Análisis Estadístico'; // Agregado
    if (path.includes('workers')) return 'Control de Personal';
    if (path.includes('inventario')) return 'Control de Inventario';
    return 'Dashboard General';
  };



 const handleLogout = () => {
  logoutAction(); // Usamos el nombre correcto
  navigate('/');  // Redirigimos a la raíz
};

  return (
    <div className={`admin-layout-wrapper ${menuAbierto ? 'menu-active' : ''}`}>
      
      {/* BOTÓN HAMBURGUESA (Móvil) */}
      <button className="mobile-toggle" onClick={toggleMenu}>
        {menuAbierto ? '✕' : '☰'}
      </button>

      {/* OVERLAY */}
      {menuAbierto && <div className="menu-overlay" onClick={cerrarMenu}></div>}

      {/* SIDEBAR MODERNO */}
      <aside className={`admin-sidebar-v2 ${menuAbierto ? 'open' : ''}`}>
        <div className="admin-brand">
          <div className="brand-logo">🛠️</div>
          <div className="brand-text">
            <span>San Francisco</span>
            <small>{user?.rol === 'admin' ? 'SYSTEM ADMIN' : 'VENTAS'}</small>
          </div>
        </div>

        <nav className="admin-menu">
          <p className="menu-label">Principal</p>
          <Link to="/admin" className={`menu-item ${isActive('/admin')}`} onClick={cerrarMenu}>
            <span className="icon">📦</span> Inventario
          </Link>
          <Link to="/admin/ventas" className={`menu-item ${isActive('/admin/ventas')}`} onClick={cerrarMenu}>
            <span className="icon">💰</span> Ventas
          </Link>

          {/* SECCIÓN RESTRINGIDA PARA EL ADMIN */}
          {user?.rol === 'admin' && (
            <>
              <p className="menu-label">Administración</p>
              <Link to="/admin/workers" className={`menu-item ${isActive('/admin/workers')}`} onClick={cerrarMenu}>
                <span className="icon">👥</span> Trabajadores
              </Link>

              <Link to="/admin/reportes" className={`menu-item ${isActive('/admin/reportes')}`} onClick={cerrarMenu}>
                <span className="icon">📄</span> Reportes PDF
              </Link>

              {/* BOTÓN DE ESTADÍSTICAS CORREGIDO */}
              <Link to="/admin/estadisticas" className={`menu-item ${isActive('/admin/estadisticas')}`} onClick={cerrarMenu}>
                <span className="icon">📊</span> Estadísticas
              </Link>

              <li className="admin-menu-item">
  <Link to="/admin/delivery" className="admin-nav-link">
    <span className="icon">🚚</span> {/* O usa tu componente de iconos */}
    <span>Logística / Delivery</span>
  </Link>
  <br></br>
  <br></br>


 <Link to="/admin/historial-cambios" className={`menu-item ${isActive('/admin/historial-cambios')}`} onClick={cerrarMenu}>
    <span className="icon">🕒</span> Auditoría
</Link>


</li>
            </>
          )}
        </nav>
        

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn-v2">
            <span className="icon">🚪</span> Cerrar Sesión
            
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-main-panel">
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1>{getHeaderTitle()}</h1>
          </div>

          <div className="topbar-right">
            <div className="user-profile-badge">
              <div className="user-info-text">
                <span className="user-name">{user?.nombre || 'Admin'}</span>
                <span className="user-role-label">{user?.rol}</span>
              </div>
              <div className="user-avatar">
                {user?.nombre?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO DE LAS PÁGINAS HIJAS */}
        <section className="admin-page-content" style={{ 
            minHeight: '500px', 
            width: '100%', 
            marginTop: '80px' 
        }}>
          {/* El Outlet es donde se renderizará EstadisticasPage.jsx */}
          <Outlet /> 
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
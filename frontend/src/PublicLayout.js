import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const PublicLayout = ({ user, cartCount }) => {
  return (
    <>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: '#1a1a2e', borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
          🛠️ AUTOMOTRIZ SAN FRANCISCO DE ASIS
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>🛒 {cartCount}</span>
          {user ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Bienvenido</span>
              {user.rol === 'admin' && <Link to="/admin" style={{ background: '#00d4ff', color: 'black', padding: '5px 10px', borderRadius: '5px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' }}>Admin</Link>}
              {user.rol === 'trabajador' && <Link to="/worker" style={{ background: '#ffa500', color: 'black', padding: '5px 10px', borderRadius: '5px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' }}>Ventas</Link>}
            </div>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', border: '1px solid #00d4ff', padding: '5px 15px', borderRadius: '5px' }}>Entrar</Link>
          )}
        </div>
      </nav>
      {/* Aquí cae el contenido de la tienda */}
      <Outlet /> 
    </>
  );
};

export default PublicLayout;
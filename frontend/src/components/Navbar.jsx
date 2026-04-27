import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, cartCount, cartItems = [] }) => {
  const location = useLocation();
  const esInicio = location.pathname === '/';
  const [showCart, setShowCart] = useState(false);

  // ESTILOS FIJOS
  const azulTienda = '#00d4ff';
  const naranjaTrabajador = '#ffa500';

  return (
    <nav style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '15px 30px', background: '#1a1a2e', borderBottom: `2px solid ${azulTienda}`,
      position: 'relative'
    }}>
      <Link to="/" style={{ color: azulTienda, textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
        🛠️ SAN FRANCISCO DE ASÍS
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* --- ICONO DEL CARRITO CON DESPLEGABLE --- */}
        <div 
          style={{ position: 'relative', color: 'white', cursor: 'pointer' }}
          onMouseEnter={() => setShowCart(true)}
          onMouseLeave={() => setShowCart(false)}
        >
          <span style={{ fontSize: '1.5rem' }}>🛒</span>
          <span style={{
            position: 'absolute', top: '-10px', right: '-10px',
            background: 'red', color: 'white', borderRadius: '50%',
            padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold'
          }}>
            {cartCount}
          </span>

          {/* MINI CARRITO DESPLEGABLE */}
          {showCart && (
            <div style={{
              position: 'absolute', top: '30px', right: '0',
              background: '#1a1a2e', border: `1px solid ${azulTienda}`,
              padding: '15px', borderRadius: '8px', width: '250px', zIndex: 1000
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: azulTienda }}>Tu Compra</h4>
              {cartItems.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: '#888' }}>El carrito está vacío</p>
              ) : (
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {cartItems.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', marginBottom: '5px', borderBottom: '1px solid #333', color: 'white' }}>
                      {item.nombre} - <strong>${item.precioVenta}</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* ACCIONES DEL CARRITO (CORREGIDO: Sin duplicados) */}
              <div style={{ marginTop: '15px' }}>
                {!user ? (
                  <>
                    <Link to="/register" style={{
                      display: 'block', textAlign: 'center', background: azulTienda,
                      color: 'black', padding: '8px', borderRadius: '4px',
                      textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem',
                      marginBottom: '5px'
                    }}>
                      Regístrate para comprar
                    </Link>
                    <Link to="/login" style={{ 
                      display: 'block', textAlign: 'center', color: azulTienda, 
                      fontSize: '0.7rem', textDecoration: 'none' 
                    }}>
                      ¿Ya tienes cuenta? Entrar
                    </Link>
                  </>
                ) : (
                  <> </>
                )}
              </div>

                   {/* antiguamente  tenia  */}
                    <Link to="/checkout" style={{ 
                      display: 'block', textAlign: 'center', width: '100%', background: '#28a745', color: 'white',
                      border: 'none', padding: '8px', borderRadius: '4px',
                      fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none'
                    }}>
                      Finalizar Pedido
                    </Link>
                    
                    {/* SOLO AGREGUÉ ESTE LINK AQUÍ ABAJO */}
                    <Link to="/mis-compras" style={{ 
                      display: 'block', textAlign: 'center', color: azulTienda, 
                      fontSize: '0.7rem', textDecoration: 'none', marginTop: '10px' 
                    }}>
                      Ver Mis Compras
                    </Link>
                 
            </div>
          )}
        </div>
        
        {/* --- BOTÓN DE LOGIN / PERFIL --- */}
        {user ? (
          <Link 
            to="/login" 
            style={{ 
              background: esInicio ? azulTienda : (user.rol === 'admin' ? azulTienda : naranjaTrabajador), 
              color: 'black', padding: '8px 16px', borderRadius: '5px', 
              textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' 
            }}
          >
            entrar
          </Link>
        ) : (
          <Link to="/login" style={{ 
            color: azulTienda, border: `2px solid ${azulTienda}`, 
            padding: '8px 16px', borderRadius: '5px', textDecoration: 'none',
            fontSize: '0.8rem', fontWeight: 'bold'
          }}>
            ENTRAR
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
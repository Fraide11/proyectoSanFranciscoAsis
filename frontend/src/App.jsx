import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { CartContext } from './context/CartContext';

// Estilos
import './App.css'; 

// Componentes
import ChatContainer from './chat-ia/chatContainer';
import AdminPanel from './admin/AdminPanel'; 
import Catalogo from './pages/Catalogo'; 
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { getRepuestos } from './services/repuestoService';

function App() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext); // Extraemos el contador del carrito
  const [repuestos, setRepuestos] = useState([]);
  const [chatAbierto, setChatAbierto] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await getRepuestos();
      setRepuestos(data);
    } catch (error) {
      console.error("Error en San Francisco App:", error);
    }
  };

  if (authLoading) return <div className="loading-screen">Sincronizando con la base de datos...</div>;

  return (
    <Router>
      <div className="main-app-container">
        
        {/* NAVBAR GLOBAL INTEGRADO CON CARRITO */}
        <nav className="main-navbar">
          <div className="nav-content">
            <Link to="/" className="brand">
              <span className="icon">🛠️</span> 
              San Francisco {user?.rol === 'admin' && <span className="admin-badge">ADMIN</span>}
            </Link>
            
            <div className="nav-actions">
              {/* Icono de Carrito con Contador Dinámico */}
              <div className="cart-icon-wrapper" style={{ position: 'relative', marginRight: '20px' }}>
                <span style={{ fontSize: '1.5rem' }}>🛒</span>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </div>

              {user ? (
                <div className="user-info">
                  <span className="user-welcome">Hola, {user.nombre.split(' ')[0]}</span>
                  {user.rol === 'admin' && (
                    <Link to="/admin" className="counter" style={{marginLeft: '10px', fontSize: '0.8rem', padding: '5px 10px'}}>
                      Panel
                    </Link>
                  )}
                </div>
              ) : (
                <Link to="/login" className="counter">Entrar</Link>
              )}
            </div>
          </div>
        </nav>

        {/* HERO SECTION 3D (Solo en Home) */}
        <Routes>
          <Route path="/" element={
            <div className="hero">
              {/* Aquí es donde tu CSS de transformaciones hace la magia */}
              <div className="base"></div> 
              <div className="framework"></div>
              <div className="vite"></div>
            </div>
          } />
        </Routes>

        {/* CUERPO CENTRAL (#center) */}
        <main id="center">
          <div className="ticks"></div>
          
          <Routes>
            <Route path="/" element={<Catalogo items={repuestos} />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roleRequired="vendedor">
                  <AdminPanel onUpdate={cargarDatos} />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
          <div className="ticks"></div>
        </main>

        {/* FOOTER (#next-steps) */}
        <footer id="next-steps">
          <div id="docs">
            <div className="icon">📄</div>
            <h3>Inventario</h3>
            <p>Control de stock en tiempo real para repuestos automotrices.</p>
          </div>
          <div>
            <div className="icon">🤖</div>
            <h3>Asistente IA</h3>
            <p>Consulta compatibilidad de piezas con nuestro Chatbot experto.</p>
          </div>
        </footer>

        {/* BOTÓN FLOTANTE CHAT IA */}
        <div className="chat-ia-wrapper">
          {chatAbierto && <ChatContainer />}
          <button 
            className={`chat-toggle ${chatAbierto ? 'active' : ''}`}
            onClick={() => setChatAbierto(!chatAbierto)}
          >
            {chatAbierto ? '×' : '🤖'}
          </button>
        </div>

      </div>
    </Router>
  );
}

export default App;
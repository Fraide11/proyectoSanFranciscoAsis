import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { CartContext } from './context/CartContext';

// Servicios y Componentes
import { getRepuestos, deleteRepuesto } from './services/repuestoService';
import ChatContainer from './chat-ia/chatContainer';
import AdminPanel from './admin/AdminPanel';
import './App.css'; 

function App() {
  // 1. ESTADOS GLOBALES Y LOCALES
  const { user } = useContext(AuthContext); // Ahora usamos el usuario real del login
  const { cart, addToCart, removeFromCart, total, cartCount } = useContext(CartContext);
  
  const [repuestos, setRepuestos] = useState([]);
  const [busqueda, setBusqueda] = useState(""); 
  const [detallesSeleccionados, setDetallesSeleccionados] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [modoAdmin, setModoAdmin] = useState(false); // Solo para toggle visual

  // 2. CARGA DE DATOS
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await getRepuestos(busqueda);
    setRepuestos(data);
  };

  // 3. ACCIONES CRUD
  const handleEliminar = async (id) => {
    if(window.confirm("¿Eliminar este repuesto permanentemente?")) {
      await deleteRepuesto(id);
      cargarDatos();
    }
  };

 // 4. FILTRADO (Seguro contra valores undefined/null)
  const filtrados = repuestos.filter(item => {
    // Si el item no existe, lo ignoramos
    if (!item) return false;

    const nombre = item.nombre ? item.nombre.toLowerCase() : "";
    const marca = item.marcaCarro ? item.marcaCarro.toLowerCase() : "";
    const busq = busqueda.toLowerCase();

    return nombre.includes(busq) || marca.includes(busq);
  });
  
  return (
    <div className="main-app-container">
      
      {/* BOTÓN MÁGICO (Solo si el usuario es Admin de verdad) */}
      {user?.rol === 'admin' && (
        <button className="admin-toggle-btn" onClick={() => setModoAdmin(!modoAdmin)}>
          {modoAdmin ? "🚀 Ir a Tienda" : "🛠️ Gestionar"}
        </button>
      )}

      {/* NAVBAR PROFESIONAL */}
      <nav className="main-navbar">
        <h2 className="brand">🛠️ San Francisco {modoAdmin && <span className="admin-tag">ADMIN</span>}</h2>
        <div className="nav-icons">
          <div className="cart-trigger" onClick={() => setCarritoAbierto(true)}>
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </div>
      </nav>

      <main id="center">
        {/* PANEL DE CONTROL (Solo en modo admin) */}
        {modoAdmin && <AdminPanel onUpdate={cargarDatos} />}

        {/* BUSCADOR ESTILIZADO */}
        <div className="search-section">
          <input 
            className="search-input"
            type="text" 
            placeholder="Busca bujías, frenos, marcas..." 
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="products-grid">
          {filtrados.map((item) => (
            <div key={item._id} className={`product-card ${modoAdmin ? 'admin-border' : ''}`}>
              <div className="product-img-container">
                <img src={item.imagenUrl || 'placeholder.jpg'} alt={item.nombre} />
              </div>
              <h3>{item.nombre}</h3>
              <p className="product-meta">{item.marcaCarro} - {item.modeloCarro}</p>
              <p className="product-price">${item.precioVenta}</p>
              
              <div className="product-actions">
                <button className="btn-details" onClick={() => setDetallesSeleccionados(item)}>Info</button>
                <button className="btn-add" onClick={() => addToCart(item)}>+ Carrito</button>
              </div>

              {modoAdmin && (
                <div className="admin-actions">
                  <button className="btn-edit">✏️</button>
                  <button className="btn-delete" onClick={() => handleEliminar(item._id)}>🗑️</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* CARRITO (DRAWER) */}
      {carritoAbierto && (
        <aside className="cart-drawer">
          <div className="drawer-header">
            <h3>Mi Pedido</h3>
            <button onClick={() => setCarritoAbierto(false)}>×</button>
          </div>
          <div className="drawer-content">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <span>{item.nombre} (x{item.cantidad})</span>
                <strong>${item.precioVenta * item.cantidad}</strong>
                <button onClick={() => removeFromCart(item._id)}>🗑️</button>
              </div>
            ))}
          </div>
          <div className="drawer-footer">
            <h4>Total: ${total}</h4>
            <button className="btn-checkout">Pagar Factura</button>
          </div>
        </aside>
      )}

      {/* CHAT IA Y MODAL (Lógica similar...) */}
      <div className="ia-float-btn">
         {chatAbierto && <ChatContainer />}
         <button onClick={() => setChatAbierto(!chatAbierto)}>🤖</button>
      </div>
    </div>
  );
}

export default App;
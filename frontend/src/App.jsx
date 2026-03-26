import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatContainer from './chat-ia/chatContainer';
import AdminPanel from './admin/AdminPanel'; 
import { getRepuestos, deleteRepuesto, updateRepuesto } from './services/repuestoService';
import './App.css'; 

// --- COMPONENTE DE PROTECCIÓN DE RUTAS ---
const ProtectedRoute = ({ children, esAdmin }) => {
  if (!esAdmin) return <Navigate to="/" />;
  return children;
};

function App() {
  // --- ESTADOS ---
  const [repuestos, setRepuestos] = useState([]);
  const [busqueda, setBusqueda] = useState(""); 
  const [detallesSeleccionados, setDetallesSeleccionados] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false); // En el futuro esto vendrá del AuthContext

  // --- CARGA DE DATOS ---
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await getRepuestos();
      setRepuestos(data);
    } catch (error) {
      console.error("Error al cargar repuestos:", error);
    }
  };

  // --- LÓGICA DEL CARRITO ---
  const añadirAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    setCarritoAbierto(true);
  };

  const quitarDelCarrito = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + item.precioVenta, 0);

  // --- LÓGICA CRUD (ADMIN) ---
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este repuesto?")) {
      try {
        await deleteRepuesto(id);
        alert("Eliminado con éxito");
        cargarDatos(); 
      } catch (err) {
        console.error("Error al borrar", err);
      }
    }
  };

  const handleEdit = (producto) => {
    setDetallesSeleccionados({ ...producto, editando: true });
  };

  const handleSaveEdit = async (productoEditado) => {
    try {
      await updateRepuesto(productoEditado._id, productoEditado);
      alert("Producto actualizado con éxito");
      setDetallesSeleccionados(null);
      cargarDatos();
    } catch (err) {
      console.error("Error al actualizar", err);
      alert("Error al guardar cambios");
    }
  };

  // --- FILTRO DE BÚSQUEDA ---
  const repuestosFiltrados = repuestos.filter((item) => 
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.marcaCarro.toLowerCase().includes(busqueda.toLowerCase()) ||
    (item.codigo && item.codigo.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="main-container" style={{ 
      minHeight: '100vh', padding: '20px', color: 'white',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      backgroundAttachment: 'fixed', fontFamily: 'sans-serif'
    }}>
      
      {/* BOTÓN SECRETO ADMIN (Para la demo de mañana) */}
      <button 
        onClick={() => setEsAdmin(!esAdmin)}
        style={{ position: 'fixed', top: '10px', left: '10px', opacity: 0.3, background: 'none', border: 'none', color: 'white', cursor: 'pointer', zIndex: 1000 }}
      >
        {esAdmin ? "Ver Tienda" : "⚙️"}
      </button>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '15px 25px', background: 'rgba(0,0,0,0.3)', borderRadius: '15px', backdropFilter: 'blur(5px)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#00d4ff' }}>🛠️ Automotriz San Francisco {esAdmin && "(Panel Admin)"}</h2>
        <div onClick={() => setCarritoAbierto(true)} style={{ position: 'relative', cursor: 'pointer', padding: '5px' }}>
          <span style={{ fontSize: '1.8rem' }}>🛒</span>
          {carrito.length > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff4757', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {carrito.length}
            </span>
          )}
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      {esAdmin ? (
        <div style={{ animation: 'fadeIn 0.5s' }}>
          <AdminPanel onUpdate={cargarDatos} />
          <h3 style={{marginTop: '40px', color: '#00d4ff'}}>Gestión de Inventario Existente</h3>
          {/* Aquí podrías poner una tabla más compacta para el admin si quisieras */}
        </div>
      ) : null}

      {/* BUSCADOR */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <input 
          type="text" 
          placeholder="Busca repuestos por nombre, marca o código..." 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: '15px 25px', width: '100%', maxWidth: '500px', borderRadius: '30px', border: 'none', outline: 'none', fontSize: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.4)', color: '#333' }}
        />
      </div>

      {/* GRID DE PRODUCTOS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {repuestosFiltrados.map((item) => (
          <div key={item._id} style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '20px', border: esAdmin ? '1px solid #00d4ff' : '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center', transition: '0.3s' }}>
            
            <div style={{ marginBottom: '15px' }}>
              {item.imagenUrl ? (
                <img src={item.imagenUrl} alt={item.nombre} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '15px' }} />
              ) : (
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '15px', fontSize: '4rem' }}>⚙️</div>
              )}
            </div>

            <h3 style={{ color: '#00d4ff', margin: '10px 0', fontSize: '1.1rem' }}>{item.nombre}</h3>
            <p style={{ color: '#ccc', fontSize: '0.8rem' }}>{item.marcaCarro} - {item.modeloCarro}</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#4caf50', margin: '10px 0' }}>${item.precioVenta}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setDetallesSeleccionados(item)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #646cff', background: 'transparent', color: 'white', cursor: 'pointer' }}>Detalles</button>
                  {!esAdmin && <button onClick={() => añadirAlCarrito(item)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#646cff', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>+ Carrito</button>}
                </div>
                
                {esAdmin && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '5px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                    <button onClick={() => handleEdit(item)} style={{ flex: 1, background: '#f39c12', border: 'none', borderRadius: '8px', color: 'white', padding: '8px', cursor: 'pointer' }}>✏️ Editar</button>
                    <button onClick={() => handleDelete(item._id)} style={{ flex: 1, background: '#ff4757', border: 'none', borderRadius: '8px', color: 'white', padding: '8px', cursor: 'pointer' }}>🗑️ Borrar</button>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* CARRITO LATERAL */}
      {carritoAbierto && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '320px', height: '100%', background: '#1a1a2e', zIndex: 5000, boxShadow: '-5px 0 15px rgba(0,0,0,0.5)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>🛒 Tu Pedido</h3>
            <button onClick={() => setCarritoAbierto(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {carrito.length === 0 ? <p style={{color: '#666', textAlign: 'center'}}>El carrito está vacío</p> : 
              carrito.map((prod, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px', marginBottom: '10px' }}>
                <div style={{textAlign: 'left'}}>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>{prod.nombre}</p>
                  <small style={{ color: '#4caf50' }}>${prod.precioVenta}</small>
                </div>
                <button onClick={() => quitarDelCarrito(index)} style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Total:</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#4caf50' }}>${totalCarrito}</span>
            </div>
            <button onClick={() => alert("Procesando pago en Automotriz...")} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: '#00d4ff', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>FINALIZAR COMPRA</button>
          </div>
        </div>
      )}

      {/* CHAT IA */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 3000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        {chatAbierto && <div style={{ marginBottom: '15px' }}><ChatContainer /></div>}
        <button onClick={() => setChatAbierto(!chatAbierto)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#00d4ff', border: 'none', cursor: 'pointer', fontSize: '1.8rem', boxShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>
          {chatAbierto ? '❌' : '🤖'}
        </button>
      </div>

      {/* MODAL DETALLES / EDICIÓN */}
      {detallesSeleccionados && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 6000, backdropFilter: 'blur(5px)' }}>
            <div style={{ background: '#1a1a2e', padding: '25px', borderRadius: '25px', maxWidth: '380px', width: '90%', border: '1px solid #646cff', textAlign: 'center' }}>
                <h3 style={{ color: '#00d4ff', marginBottom: '15px' }}>
                  {detallesSeleccionados.editando ? "📝 Editar Producto" : "🔍 Detalle de Repuesto"}
                </h3>
                <img src={detallesSeleccionados.imagenUrl} style={{ width: '100%', height: '150px', objectFit: 'contain', borderRadius: '15px', marginBottom: '15px' }} alt="" />
                <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
                  <label style={{fontSize: '0.7rem', color: '#646cff'}}>Nombre</label>
                  <input 
                    type="text" 
                    readOnly={!detallesSeleccionados.editando}
                    value={detallesSeleccionados.nombre}
                    onChange={(e) => setDetallesSeleccionados({...detallesSeleccionados, nombre: e.target.value})}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: detallesSeleccionados.editando ? '1px solid #646cff' : 'none', color: 'white', marginBottom: '10px', fontSize: '0.9rem', outline: 'none' }}
                  />
                  <label style={{fontSize: '0.7rem', color: '#646cff'}}>Precio de Venta ($)</label>
                  <input 
                    type="number" 
                    readOnly={!detallesSeleccionados.editando}
                    value={detallesSeleccionados.precioVenta}
                    onChange={(e) => setDetallesSeleccionados({...detallesSeleccionados, precioVenta: Number(e.target.value)})}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: detallesSeleccionados.editando ? '1px solid #646cff' : 'none', color: '#4caf50', fontWeight: 'bold', fontSize: '1.1rem', outline: 'none' }}
                  />
                </div>
                {detallesSeleccionados.editando ? (
                  <button onClick={() => handleSaveEdit(detallesSeleccionados)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#4caf50', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '10px' }}>GUARDAR CAMBIOS</button>
                ) : (
                  <button onClick={() => añadirAlCarrito(detallesSeleccionados)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#646cff', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '10px' }}>AÑADIR AL CARRITO</button>
                )}
                <button onClick={() => setDetallesSeleccionados(null)} style={{ width: '100%', padding: '10px', background: 'transparent', color: '#ccc', border: 'none', cursor: 'pointer' }}>Cerrar</button>
            </div>
          </div>
      )}
    </div>
  );
}

export default App;
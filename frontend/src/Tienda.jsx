import React, { useEffect, useState } from 'react';
import ChatContainer from './chat-ia/chatContainer';
import AdminPanel from './admin/AdminPanel'; 
import { getRepuestos, deleteRepuesto } from './services/repuestoService'; // Añadí delete
import './App.css'; 

function App() {
  const [repuestos, setRepuestos] = useState([]);
  const [busqueda, setBusqueda] = useState(""); 
  const [detallesSeleccionados, setDetallesSeleccionados] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await getRepuestos();
    setRepuestos(data);
  };

  // --- LÓGICA DE CRUD PARA ADMIN ---
  const eliminarProducto = async (id) => {
    if(window.confirm("¿Estás seguro de eliminar este repuesto?")) {
      await deleteRepuesto(id);
      cargarDatos(); // Recargar lista
    }
  };

  const añadirAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    setCarritoAbierto(true); // Abrir al añadir
  };

  const quitarDelCarrito = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + item.precioVenta, 0);

  const repuestosFiltrados = repuestos.filter((item) => 
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.marcaCarro.toLowerCase().includes(busqueda.toLowerCase()) ||
    (item.codigo && item.codigo.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="main-container" style={{ 
      minHeight: '100vh', padding: '20px', color: 'white',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      backgroundAttachment: 'fixed'
    }}>
      
      {/* BOTÓN SECRETO ADMIN */}
      <button 
        onClick={() => setEsAdmin(!esAdmin)}
        style={{ position: 'absolute', top: '10px', left: '10px', opacity: 0.3, background: 'none', border: 'none', color: 'white', cursor: 'pointer', zIndex: 1000 }}
      >
        {esAdmin ? "ver Tienda" : "⚙️"}
      </button>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '15px 25px', background: 'rgba(0,0,0,0.3)', borderRadius: '15px', backdropFilter: 'blur(5px)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#00d4ff' }}>🛠️ San Francisco {esAdmin && "(Modo Admin)"}</h2>
        <div onClick={() => setCarritoAbierto(true)} style={{ position: 'relative', cursor: 'pointer', padding: '5px' }}>
          <span style={{ fontSize: '1.8rem' }}>🛒</span>
          {carrito.length > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff4757', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {carrito.length}
            </span>
          )}
        </div>
      </nav>

      {/* Si es admin, mostramos el Panel de gestión arriba (para crear) */}
      {esAdmin && <AdminPanel onUpdate={cargarDatos} />}

      {/* BUSCADOR */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <input 
          type="text" 
          placeholder="Busca por nombre, marca o código..." 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: '15px 25px', width: '100%', maxWidth: '500px', borderRadius: '30px', border: 'none', outline: 'none', fontSize: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.4)', color: '#333' }}
        />
      </div>

      {/* GRID DE PRODUCTOS (Ahora con lógica CRUD si esAdmin) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {repuestosFiltrados.map((item) => (
          <div key={item._id} style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '20px', border: esAdmin ? '1px solid #00d4ff' : '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
            
            <div style={{ marginBottom: '15px' }}>
              {item.imagenUrl ? (
                <img src={item.imagenUrl} alt={item.nombre} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '15px' }} />
              ) : (
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '15px', fontSize: '4rem' }}>⚙️</div>
              )}
            </div>

            <h3 style={{ color: '#00d4ff', margin: '10px 0' }}>{item.nombre}</h3>
            <p style={{ color: '#ccc', fontSize: '0.8rem' }}>{item.marcaCarro} - {item.modeloCarro}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4caf50', margin: '10px 0' }}>${item.precioVenta}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setDetallesSeleccionados(item)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #646cff', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '0.8rem' }}>Detalles</button>
                  <button onClick={() => añadirAlCarrito(item)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#646cff', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>+ Carrito</button>
                </div>
                
                {/* ACCIONES DE CRUD SOLO PARA ADMIN */}
                {esAdmin && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '5px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                    <button onClick={() => console.log("Editar", item._id)} style={{ flex: 1, background: '#f39c12', border: 'none', borderRadius: '5px', color: 'white', padding: '5px', cursor: 'pointer' }}>✏️</button>
                    <button onClick={() => eliminarProducto(item._id)} style={{ flex: 1, background: '#ff4757', border: 'none', borderRadius: '5px', color: 'white', padding: '5px', cursor: 'pointer' }}>🗑️</button>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* CARRITO LATERAL (Drawer) */}
      {carritoAbierto && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '320px', height: '100%', background: '#1a1a2e', zIndex: 5000, boxShadow: '-5px 0 15px rgba(0,0,0,0.5)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Tu Carrito</h3>
            <button onClick={() => setCarritoAbierto(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {carrito.map((prod, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.9rem' }}>{prod.nombre}</span>
                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>${prod.precioVenta}</span>
                <button onClick={() => quitarDelCarrito(index)} style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer' }}>🗑️</button>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
            <h4>Total: ${totalCarrito}</h4>
            <button onClick={() => alert("Debes iniciar sesión para comprar")} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: '#00d4ff', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>Pagar Ahora</button>
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

      {/* MODAL DETALLES (Reducido de tamaño) */}
      {detallesSeleccionados && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 4000, backdropFilter: 'blur(5px)' }}>
            <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '25px', maxWidth: '350px', width: '90%', border: '1px solid #646cff', textAlign: 'center' }}>
                <img src={detallesSeleccionados.imagenUrl} style={{ width: '100%', height: '150px', objectFit: 'contain', borderRadius: '15px', marginBottom: '10px' }} alt="" />
                <h3 style={{ color: '#00d4ff', fontSize: '1.2rem' }}>{detallesSeleccionados.nombre}</h3>
                <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px', margin: '10px 0', fontSize: '0.85rem' }}>
                  <p>🚗 Marca: {detallesSeleccionados.marcaCarro}</p>
                  <p>🚘 Modelo: {detallesSeleccionados.modeloCarro}</p>
                  <p>🆔 SKU: {detallesSeleccionados.codigo}</p>
                </div>
                <p style={{ color: '#4caf50', fontSize: '1.2rem', fontWeight: 'bold' }}>${detallesSeleccionados.precioVenta}</p>
                <button onClick={() => setDetallesSeleccionados(null)} style={{ marginTop: '10px', width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: '#646cff', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar</button>
            </div>
          </div>
      )}
    </div>
  );
}

export default App;
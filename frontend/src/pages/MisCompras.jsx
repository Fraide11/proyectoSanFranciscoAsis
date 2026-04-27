import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MisCompras = () => {
  const [pedidos, setPedidos] = useState([]); 
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // --- AJUSTE: Usamos la URL completa del backend (puerto 10000) ---
        // Si tienes configurado el .env en el front, usa: `${import.meta.env.VITE_API_URL}/pedidos/mis-pedidos`
        // Si no quieres líos ahora, dejamos la URL directa:
        const res = await axios.get('http://localhost:10000/api/pedidos/mis-pedidos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // --- LÓGICA DE VALIDACIÓN MANTENIDA ---
        if (Array.isArray(res.data)) {
          setPedidos(res.data);
        } else if (res.data.pedidos && Array.isArray(res.data.pedidos)) {
          setPedidos(res.data.pedidos);
        } else {
          setPedidos([]); 
        }

      } catch (err) {
        console.error("Error al traer pedidos", err);
        setPedidos([]); 
      } finally {
        setCargando(false);
      }
    };

    // Verificamos si hay usuario para disparar la carga
    if (localStorage.getItem('token')) { // Mejor verificar el token
        fetchPedidos();
    } else {
        setCargando(false);
    }
  }, []);

  if (cargando) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando historial...</div>;
  }

  return (
    <div style={{ padding: '20px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>Mis Compras Realizadas</h2>
      
      {pedidos && pedidos.length > 0 ? (
        pedidos.map((pedido) => (
          <div key={pedido._id} style={{ background: '#1e293b', padding: '15px', marginBottom: '15px', borderRadius: '10px', borderLeft: '5px solid #38bdf8' }}>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>Orden ID:</strong> {pedido.nroOrden || pedido._id?.slice(-6)}
            </p>
            
            <div style={{ paddingLeft: '15px', borderLeft: '1px solid #334155', fontSize: '0.9rem' }}>
              {pedido.items ? (
                pedido.items.map((item, i) => (
                  <div key={i} style={{ color: '#94a3b8' }}>
                    • {item.nombre} <span style={{ color: '#38bdf8' }}>(x{item.cantidad})</span>
                  </div>
                ))
              ) : (
                pedido.productos?.map((prod, i) => (
                  <div key={i} style={{ color: '#94a3b8' }}>
                    • {prod.nombre} <span style={{ color: '#38bdf8' }}>(x{prod.cantidad})</span>
                  </div>
                ))
              )}
            </div>

            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                Total: ${pedido.total || pedido.totalUSD}
              </span>
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '20px', 
                fontSize: '0.8rem', 
                color: 'white',
                backgroundColor: pedido.estado === 'Pendiente' ? '#f59e0b' : '#10b981' 
              }}>
                {pedido.estado || 'Completada'}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>
          <p>No tienes compras registradas aún en el sistema.</p>
        </div>
      )}
    </div>
  );
};

export default MisCompras;
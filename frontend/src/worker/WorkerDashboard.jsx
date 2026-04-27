import React from 'react';
import { useNavigate } from 'react-router-dom';

const WorkerDashboard = () => {
  const navigate = useNavigate();

  // Estilos para las tarjetas
  const cardStyle = {
    background: '#1a1a2e',
    border: '1px solid #00d4ff',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    flex: '1',
    minWidth: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Función para manejar el hover (Efectos visuales)
  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#00d4ff', fontSize: '2rem' }}>Panel Operativo</h1>
        <p style={{ color: '#ccc' }}>Bienvenido. ¿Qué vamos a gestionar hoy?</p>
      </header>

      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* TARJETA DE VENTAS */}
        <div 
          style={cardStyle} 
          onClick={() => navigate('/worker/ventas')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span style={{ fontSize: '3.5rem', marginBottom: '10px' }}>💰</span>
          <h3 style={{ marginTop: '10px', color: '#fff' }}>Nueva Venta</h3>
          <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '5px' }}>
            Registrar facturas y pedidos de clientes
          </p>
        </div>

        {/* TARJETA DE INVENTARIO */}
        <div 
          style={cardStyle} 
          onClick={() => navigate('/worker/inventario')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span style={{ fontSize: '3.5rem', marginBottom: '10px' }}>📦</span>
          <h3 style={{ marginTop: '10px', color: '#fff' }}>Inventario / Stock</h3>
          <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '5px' }}>
            Consultar disponibilidad de repuestos
          </p>
        </div>

      </div>

      {/* SECCIÓN DE AVISOS RÁPIDOS */}
      <div style={{ 
        marginTop: '50px', 
        background: 'rgba(0, 212, 255, 0.05)', 
        padding: '25px', 
        borderRadius: '15px', 
        border: '1px dashed #00d4ff',
        maxWidth: '800px',
        margin: '50px auto 0'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#00d4ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📌</span> Recordatorio Importante
        </h4>
        <p style={{ fontSize: '0.95rem', margin: 0, color: '#e2e8f0', lineHeight: '1.5' }}>
          Antes de confirmar cualquier salida, verifica físicamente el stock y asegúrate de que el número de referencia coincida con el sistema.
        </p>
      </div>
    </div>
  );
};

export default WorkerDashboard;
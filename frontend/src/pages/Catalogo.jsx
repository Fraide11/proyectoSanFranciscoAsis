//import React, { useState } from 'react';

import React, { useState, useContext } from 'react'; // Agregamos useContext
import { CartContext } from '../context/CartContext'; // Ajusta la ruta a tu carpeta de contextos













const Catalogo = ({ items = [] }) => {
  // Estado para el producto seleccionado (Modal)
  const [productoDetalle, setProductoDetalle] = useState(null);
  
 
   // EXTRAEMOS LA FUNCIÓN DEL CONTEXTO
  const { addToCart } = useContext(CartContext); 

  const handleAgregar = (producto) => {
    // LLAMAMOS A LA FUNCIÓN DEL CONTEXTO
    addToCart(producto); 
    console.log("Producto enviado al context:", producto.nombre);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#00d4ff' }}>Catálogo de Repuestos</h2>
      <p style={{ textAlign: 'center' }}>Total de productos: {items.length}</p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px',
        marginTop: '20px' 
      }}>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item._id} style={{ 
              background: '#1a1a2e', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #333',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <img 
                  src={item.imagenUrl || 'https://picsum.photos/300/200?random='} 
                  alt={item.nombre} 
                  style={{ 
                    width: '100%', 
                    height: '150px', 
                    objectFit: 'cover', 
                    borderRadius: '5px',
                    backgroundColor: '#2a2a40'
                  }} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Error+al+cargar'; }}
                />
                <h3 style={{ fontSize: '1rem', margin: '10px 0', textAlign: 'center' }}>{item.nombre}</h3>
                <p style={{ color: '#00d4ff', fontWeight: 'bold', textAlign: 'center', fontSize: '1.2rem' }}>
                  ${item.precioVenta}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', marginBottom: '15px' }}>
                  {item.marcaCarro}
                </p>
              </div>

              {/* --- BOTONES DE ACCIÓN --- */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
               <button 
  onClick={() => {
    handleAgregar(item); // Tu función local (para alertas o efectos)
    addToCart(item);     // La función del Contexto que guarda el repuesto
  }}
  style={{
    backgroundColor: '#00d4ff',
    color: '#1a1a2e',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }}
>
  🛒 Añadir al carrito
</button>
                <button 
                  onClick={() => setProductoDetalle(item)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#fff',
                    border: '1px solid #00d4ff',
                    padding: '8px',
                    borderRadius: '5px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>
            No hay productos para mostrar.
          </p>
        )}
      </div>

      {/* --- MODAL DE DETALLES --- */}
      {productoDetalle && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 3000
        }}>
          <div style={{
            background: '#1a1a2e', padding: '30px', borderRadius: '15px',
            maxWidth: '500px', width: '90%', border: '1px solid #00d4ff',
            position: 'relative', textAlign: 'center'
          }}>
            <button 
              onClick={() => setProductoDetalle(null)}
              style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
            >✕</button>
            
            <img src={productoDetalle.imagenUrl} alt={productoDetalle.nombre} style={{ width: '100%', borderRadius: '10px', marginBottom: '15px' }} />
            <h2 style={{ color: '#00d4ff' }}>{productoDetalle.nombre}</h2>
            <p><strong>Marca:</strong> {productoDetalle.marcaCarro}</p>
            <p><strong>Precio:</strong> ${productoDetalle.precioVenta}</p>
            <p style={{ color: '#ccc', fontSize: '0.9rem', marginTop: '10px' }}>
              {productoDetalle.descripcion || "Este repuesto es de alta calidad, diseñado para un rendimiento óptimo en tu vehículo."}
            </p>
            
            <button 
              onClick={() => { handleAgregar(productoDetalle); setProductoDetalle(null); }}
              style={{ marginTop: '20px', backgroundColor: '#00d4ff', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Añadir al carrito ahora
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogo;
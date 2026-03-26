import React, { useEffect, useState, useContext } from 'react';
import { getRepuestos } from '../services/repuestoService';
import { CartContext } from '../context/CartContext';

const Catalogo = () => {
    const [repuestos, setRepuestos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Traemos la función para añadir al carrito desde el Contexto
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const cargarData = async () => {
          try {
            const data = await getRepuestos();
            setRepuestos(data);
          } catch (error) {
            console.error("Error al cargar catálogo:", error);
          } finally {
            setLoading(false);
          }
        };
        cargarData();
    }, []);

    if (loading) return <div style={msgStyle}>Cargando las mejores piezas para tu vehículo...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: 'auto' }}>
            <h2 style={{ color: '#00d4ff', textAlign: 'center', fontSize: '2rem', marginBottom: '30px' }}>
                🚀 Catálogo San Francisco de Asís
            </h2>
            
            <div style={gridStyle}>
                {repuestos.map(item => (
                    <div key={item._id} style={cardStyle}>
                        {/* 1. Muestra la imagen real de ImgBB o el placeholder si no hay */}
                        <div style={imageContainerStyle}>
                          <img 
                            src={item.imagenUrl || 'https://via.placeholder.com/300?text=Sin+Imagen'} 
                            alt={item.nombre}
                            style={imageStyle}
                          />
                          {item.stock <= 0 && <span style={badgeStyle}>Agotado</span>}
                        </div>

                        <div style={{ padding: '15px' }}>
                          <h3 style={titleStyle}>{item.nombre}</h3>
                          <p style={subtitleStyle}>{item.marcaCarro} - {item.modeloCarro}</p>
                          <p style={categoryStyle}>🏷️ {item.categoria || 'Repuesto'}</p>
                          
                          <div style={priceStyle}>${item.precioVenta}</div>
                          
                          {/* 2. Botón funcional con el CartContext */}
                          <button 
                            style={{ 
                                ...btnStyle, 
                                opacity: item.stock <= 0 ? 0.5 : 1,
                                cursor: item.stock <= 0 ? 'not-allowed' : 'pointer'
                            }} 
                            disabled={item.stock <= 0}
                            onClick={() => {
                              addToCart(item);
                              alert(`${item.nombre} añadido al carrito 🛒`);
                            }}
                          >
                            {item.stock <= 0 ? 'Sin Stock' : 'Añadir al Carrito'}
                          </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- ESTILOS MEJORADOS (UI MODERNA) ---
const gridStyle = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
    gap: '25px' 
};

const cardStyle = { 
    background: '#1a1a2e', 
    borderRadius: '15px', 
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    border: '1px solid rgba(0, 212, 255, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease'
};

const imageContainerStyle = { position: 'relative', width: '100%', height: '200px', background: '#0f0c29' };
const imageStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const badgeStyle = { position: 'absolute', top: '10px', right: '10px', background: '#ff4d4d', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem' };

const titleStyle = { margin: '0', fontSize: '1.2rem', color: '#fff' };
const subtitleStyle = { fontSize: '0.85em', color: '#00d4ff', marginTop: '5px' };
const categoryStyle = { fontSize: '0.8em', color: '#888', margin: '10px 0' };
const priceStyle = { fontSize: '1.6em', color: '#00ff88', fontWeight: 'bold', margin: '10px 0' };

const btnStyle = { 
    width: '100%', padding: '12px', background: '#646cff', color: 'white', 
    border: 'none', borderRadius: '8px', fontWeight: 'bold', transition: '0.3s'
};

const msgStyle = { textAlign: 'center', color: '#00d4ff', marginTop: '50px', fontSize: '1.2rem' };

export default Catalogo;
import React, { useEffect, useState } from 'react';
import { getRepuestos } from '../services/repuestoService';

const Catalogo = () => {
    const [repuestos, setRepuestos] = useState([]);

    useEffect(() => {
        const cargarData = async () => {
            const data = await getRepuestos();
            setRepuestos(data);
        };
        cargarData();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#646cff', textAlign: 'center' }}>🚀 Catálogo de Repuestos</h2>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '20px', 
                marginTop: '20px' 
            }}>
                {repuestos.map(item => (
                    <div key={item._id} style={{ 
                        background: '#2a2a2a', 
                        padding: '20px', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        border: '1px solid #444'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>{item.nombre}</h3>
                        <p style={{ fontSize: '0.9em', color: '#aaa' }}>{item.marcaCarro} - {item.modeloCarro}</p>
                        <div style={{ 
                            fontSize: '1.5em', 
                            color: '#4caf50', 
                            fontWeight: 'bold', 
                            margin: '15px 0' 
                        }}>${item.precioVenta}</div>
                        <button style={{ 
                            width: '100%', 
                            padding: '10px', 
                            background: '#646cff', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }} onClick={() => alert('¡Próximamente! Primero debemos crear tu cuenta de usuario.')}>
                            Añadir al Carrito
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalogo;
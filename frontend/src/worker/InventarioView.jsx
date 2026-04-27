import React, { useState, useEffect } from 'react';
import { getRepuestos } from '../services/repuestoService';

const InventarioView = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);

    // ESTILOS EXACTOS DE TU ADMIN
    const tableWrapper = { background: 'rgba(26, 26, 46, 0.95)', borderRadius: '20px', padding: '10px', border: '1px solid #2a2a40', overflowX: 'auto' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse' };
    const theadStyle = { background: '#00d4ff', color: '#000' };
    const thStyle = { padding: '15px', textAlign: 'left', textTransform: 'uppercase', fontSize: '0.8rem' };
    const trStyle = { borderBottom: '1px solid #2a2a40' };
    const tdStyle = { padding: '15px', color: 'white' };
    const imgThumbStyle = { width: '55px', height: '55px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #00d4ff' };

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            const data = await getRepuestos();
            setProductos(Array.isArray(data) ? data : (data.productos || []));
            setLoading(false);
        };
        cargarDatos();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#00d4ff', textAlign: 'center', marginBottom: '25px', textTransform: 'uppercase' }}>
                Control de Inventario - San Francisco
            </h2>

            <div style={tableWrapper}>
                {loading ? <p style={{color: '#00d4ff', textAlign: 'center'}}>Cargando tabla...</p> : (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={theadStyle}>
                                <th style={thStyle}>Imagen</th>
                                <th style={thStyle}>Cód / Nombre</th>
                                <th style={thStyle}>Vehículo / Pasillo</th>
                                <th style={thStyle}>Precio</th>
                                <th style={thStyle}>Stock</th>
                                <th style={thStyle}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map(p => (
                                <tr key={p._id} style={trStyle}>
                                    <td style={tdStyle}>
                                        <img src={p.imagenUrl} alt={p.nombre} style={imgThumbStyle} />
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 'bold', color: '#00d4ff' }}>{p.codigo}</div>
                                        <div style={{ fontSize: '0.85rem' }}>{p.nombre}</div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div>{p.marcaCarro} {p.modeloCarro}</div>
                                        <div style={{fontSize: '0.75rem', color: '#888'}}>📍 {p.ubicacionPasillo || 'A-1'}</div>
                                    </td>
                                    <td style={tdStyle}>${p.precioVenta}</td>
                                    <td style={{ ...tdStyle, color: p.stock <= p.stockMinimo ? '#ff4d4d' : '#00ff88', fontWeight: 'bold' }}>
                                        {p.stock}
                                    </td>
                                    <td style={tdStyle}>
                                        <button style={{ background: '#f39c12', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                            ✏️ Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default InventarioView;
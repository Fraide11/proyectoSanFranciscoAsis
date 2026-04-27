import React, { useEffect, useState } from 'react';
import './VentasPage.css';
import { descargarArchivoPDF } from '../services/pdfService';


const VentasPage = () => {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);

    // --- FUNCIÓN PARA OBTENER LAS VENTAS ---
    const obtenerVentas = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const response = await fetch('http://localhost:10000/api/pedidos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setPedidos(Array.isArray(data) ? data : data.pedidos || []);
            setCargando(false);
        } catch (error) {
            console.error("Error al obtener ventas:", error);
            setCargando(false);
        }
    };





//desacaragr pdf
const AccionesVenta = ({ ventaId }) => {
    return (
        <div className="flex gap-2">
            <button
                onClick={() => descargarArchivoPDF(`/api/ventas/descargar/${ventaId}`, `Factura_${ventaId}.pdf`)}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
                <span>📄</span> Factura
            </button>
            
            {/* Si estás en la vista de administrador/reportes */}
            <button
                onClick={() => descargarArchivoPDF(`/api/reportes/stock-bajo?download=pdf`, `Reporte_Inventario.pdf`)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm"
            >
                <span>⚠️</span> Exportar PDF
            </button>
        </div>
    );
};



// --- NUEVA FUNCIÓN: ELIMINAR PEDIDO ---
const eliminarPedido = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.")) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:10000/api/pedidos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            setPedidos(prev => prev.filter(p => p._id !== id));
            console.log("Pedido eliminado");
        } else {
            alert("No se pudo eliminar el pedido.");
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
};











    // --- NUEVA FUNCIÓN: ACTUALIZAR ESTADO ---
   const actualizarEstadoPedido = async (id, nuevoEstado) => {
    try {
        const token = localStorage.getItem('token');
        
        // LA RUTA CORRECTA: Agregamos "/estado" al final
        const url = `http://localhost:10000/api/pedidos/${id}/estado`;
        
        console.log("Enviando actualización a:", url);

        const response = await fetch(url, {
            method: 'PUT', // CAMBIADO A PUT según tu backend
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ estado: nuevoEstado })
        });

        if (response.ok) {
            // Actualizamos la interfaz de Automotriz San Francisco de Asís
            setPedidos(prev => prev.map(p => 
                p._id === id ? { ...p, estado: nuevoEstado } : p
            ));
            console.log("Estado actualizado con éxito");
        } else {
            const errorData = await response.json();
            console.error("Error del servidor:", errorData);
            alert("Error al actualizar: " + (errorData.mensaje || "Revisa permisos de Admin"));
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
};







    useEffect(() => { obtenerVentas(); }, []);

    if (cargando) return <div className="admin-container">Cargando datos...</div>;

    return (
        <div className="admin-container">
            <div className="admin-content">
                <header className="admin-header">
                    <div className="admin-title">
                        <h1>Gestión de <span>Ventas</span></h1>
                        <p style={{color: '#64748b', fontSize: '12px', marginTop: '5px'}}>Automotriz San Francisco de Asís</p>
                    </div>
                    <div className="stats-card">
                        <span style={{color: '#64748b', fontSize: '10px', fontWeight: 'bold'}}>TOTAL ORDENES</span>
                        <div style={{fontSize: '24px', fontWeight: 'bold', color: '#3b82f6'}}>{pedidos.length}</div>
                    </div>
                </header>

                <div className="table-wrapper">
                    <table className="ventas-table">
                        <thead>
    <tr>
        <th>Orden</th>
        <th>Cliente</th>
        <th>Productos</th>
        <th>Monto</th>
        <th>Referencia</th>
        <th style={{textAlign: 'center'}}>Estado</th>
        <th style={{textAlign: 'center'}}>Acciones</th> {/* Columna para botones */}
    </tr>
</thead>
<tbody>
    {pedidos.map((p) => (
        <tr key={p._id}>
            <td data-label="Orden"><span className="order-number">{p.nroOrden}</span></td>
            <td data-label="Cliente">
                <div style={{fontWeight: 'bold'}}>{p.cliente?.nombre}</div>
            </td>
            <td data-label="Productos">
                <div className="items-list-container">
                    {p.items?.map((item, idx) => (
                        <div key={idx} className="item-row">
                           <span><b style={{color: '#3b82f6'}}>{item.cantidad}x</b> {item.nombre}</span>
                        </div>
                    )) || 'Sin productos'}
                </div>
            </td>
            <td data-label="Monto"><div className="price-tag">${p.totalUSD}</div></td>
            <td data-label="Referencia">{p.pago?.referencia || 'SIN REF'}</td>
            <td data-label="Estado" style={{ textAlign: 'center' }}>
                <select
                    value={p.estado || 'Pendiente'}
                    onChange={(e) => actualizarEstadoPedido(p._id, e.target.value)}
                    className={`status-select ${p.estado === 'Pagado' ? 'bg-pagado' : p.estado === 'Cancelado' ? 'bg-cancelado' : 'bg-pendiente'}`}
                >
                    <option value="Pendiente">PENDIENTE</option>
                    <option value="Pagado">PAGADO</option>
                    <option value="Cancelado">CANCELADO</option>
                </select>
            </td>
            <td data-label="Acciones" style={{ textAlign: 'center' }}>
                <div style={{display: 'flex', gap: '5px', justifyContent: 'center'}}>
                    <button className="btn-delete-order" onClick={() => eliminarPedido(p._id)}>
                        Eliminar
                    </button>
                </div>
            </td>
        </tr>
    ))}
</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VentasPage;
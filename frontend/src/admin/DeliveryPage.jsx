import React, { useEffect, useState } from 'react';
import './VentasPage.css'; // MANTENEMOS TU CSS PARA EL DISEÑO CIAN
import deliveryService from '../services/deliveryService';

const DeliveryPage = () => {
    const [envios, setEnvios] = useState([]);
    const [cargando, setCargando] = useState(true);

    // --- 1. CARGA DE DATOS (useEffect con Detector de Errores) ---
    useEffect(() => {
        const cargarEnvios = async () => {
            try {
                const data = await deliveryService.obtenerTodos();
                
                // --- EL DETECTOR DE ERRORES ---
                console.log("ESTRUCTURA REAL DEL PRIMER ENVÍO:", data[0]);
                console.log("¿TIENE PEDIDOID?:", data[0]?.pedidoId);
                // ------------------------------

                // Validamos que data sea un array o venga envuelto en .deliveries
                setEnvios(Array.isArray(data) ? data : data.deliveries || []);
                setCargando(false);
            } catch (error) {
                console.error("Error cargando envíos:", error);
                setCargando(false);
            }
        };
        cargarEnvios();
    }, []);

    // --- 2. FUNCIONES DE INTERACCIÓN ---

    const verUbicacionEnMapa = (coords) => {
        if (!coords || coords === "Sin GPS" || coords === "Ubicación pendiente") {
            return alert("El cliente no compartió ubicación GPS.");
        }
        // Si coords ya es un link, lo abrimos; si son coordenadas, las concatenamos
        const url = coords.startsWith('http') ? coords : `https://www.google.com/maps?q=${coords}`;
        window.open(url, '_blank');
    };

    const actualizarEstadoEnvio = async (id, nuevoEstado) => {
        try {
            await deliveryService.actualizarEstado(id, nuevoEstado);
            setEnvios(prev => prev.map(e => 
                e._id === id ? { ...e, estado: nuevoEstado } : e
            ));
            console.log("Estado de entrega actualizado con éxito");
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Error al actualizar el estado del delivery");
        }
    };

    // --- 3. RENDERIZADO ---

    if (cargando) return <div className="admin-container">Cargando logística...</div>;

    return (
        <div className="admin-container">
            <div className="admin-content">
                <header className="admin-header">
                    <div className="admin-title">
                        <h1>Gestión de <span>Logística</span></h1>
                        <p style={{ color: '#64748b', fontSize: '12px', marginTop: '5px' }}>
                            Automotriz San Francisco de Asís
                        </p>
                    </div>
                    <div className="stats-card">
                        <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold' }}>TOTAL ENTREGAS</span>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{envios.length}</div>
                    </div>
                </header>

                <div className="table-wrapper">
                  
                   <table className="ventas-table">
        <thead>
            <tr>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Dirección</th>
                <th style={{ textAlign: 'center' }}>Total</th> {/* Nueva columna */}
                <th style={{ textAlign: 'center' }}>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {envios.map((env) => (
                <tr key={env._id}>
                    {/* 1. Orden: Prioriza nroOrden o usa el ID como respaldo */}
                    <td data-label="Orden">
                        <span className="order-number">
                            {env.pedidoId?.nroOrden || `SF-${env.pedidoId?._id?.toString().slice(-6).toUpperCase() || 'S/N'}`}
                        </span>
                    </td>

                    {/* 2. Cliente */}
                    <td data-label="Cliente">
                        <div style={{ fontWeight: 'bold' }}>
                            {env.pedidoId?.cliente?.nombre || 'Sin nombre'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {env.pedidoId?.cliente?.telefono || 'Sin teléfono'}
                        </div>
                    </td>

                    {/* 3. Dirección y Referencia */}
                    <td data-label="Dirección">
                        <div style={{ fontSize: '13px' }}>
                            {env.pedidoId?.cliente?.direccion || "⚠️ No guardada en pedido"}
                        </div>
                        {env.pedidoId?.cliente?.puntoReferencia && (
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                                Ref: {env.pedidoId.cliente.puntoReferencia}
                            </div>
                        )}
                    </td>

                    {/* 4. Total (Agregado según log) */}
                    <td data-label="Total" style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>
                            {env.pedidoId?.totalUSD || '0.00'} USD
                        </div>
                    </td>

                    {/* 5. Estado */}
                    <td data-label="Estado" style={{ textAlign: 'center' }}>
                        <select
                            value={env.estado || 'Pendiente'}
                            onChange={(e) => actualizarEstadoEnvio(env._id, e.target.value)}
                            className={`status-select ${
                                env.estado === 'Entregado' ? 'bg-pagado' : 
                                env.estado === 'Pendiente' ? 'bg-pendiente' : 'bg-cancelado'
                            }`}
                        >
                            <option value="Pendiente">PENDIENTE</option>
                            <option value="Asignado">ASIGNADO</option>
                            <option value="En Camino">EN CAMINO</option>
                            <option value="Entregado">ENTREGADO</option>
                        </select>
                    </td>

                    {/* 6. Acciones */}
                    <td data-label="Acciones" style={{ textAlign: 'center' }}>
                        <button 
                            onClick={() => verUbicacionEnMapa(env.logistica?.destinoCoords)}
                            className="btn-delete-order"
                            style={{ 
                                backgroundColor: (env.logistica?.destinoCoords && env.logistica.destinoCoords !== "Ubicación pendiente") ? '#10b981' : '#475569',
                                color: 'white',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: (env.logistica?.destinoCoords && env.logistica.destinoCoords !== "Ubicación pendiente") ? 'pointer' : 'not-allowed'
                            }}
                        >
                            {(env.logistica?.destinoCoords && env.logistica.destinoCoords !== "Ubicación pendiente") ? "📍 Ver Ruta" : "Sin GPS"}
                        </button>
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

export default DeliveryPage;
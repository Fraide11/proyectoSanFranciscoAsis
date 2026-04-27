import React, { useEffect, useState } from 'react';

const VentasDiarias = () => {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const obtenerVentas = async () => {
        try {
            const token = localStorage.getItem('token'); 
            // Usamos la misma ruta que el AdminPanel
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

    useEffect(() => { obtenerVentas(); }, []);

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <h2>Registro de Ventas Hoy</h2>
            {/* Aquí puedes copiar la tabla que tienes en VentasPage.jsx para que se vea igual */}
            <p>Total de órdenes: {pedidos.length}</p>
        </div>
    );
};

export default VentasDiarias; // <--- ESTO QUITA EL ERROR DE APP.JSX
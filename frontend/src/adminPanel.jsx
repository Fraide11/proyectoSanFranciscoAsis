import React, { useState, useEffect } from 'react';
import { getRepuestos, deleteRepuesto, createRepuesto } from '../services/repuestoService';
import './AdminStyles.css';

const AdminPanel = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Cargar el inventario de Automotriz al iniciar
    useEffect(() => {
        cargarStock();
    }, []);

    const cargarStock = async () => {
        try {
            const data = await getRepuestos();
            setProductos(data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar stock de Automotriz:", error);
            setLoading(false);
        }
    };

    // 2. Función para eliminar con confirmación
    const manejarEliminar = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de eliminar ${nombre}? Esta acción quedará registrada en auditoría.`)) {
            try {
                await deleteRepuesto(id);
                // Actualizar estado local sin recargar página
                setProductos(productos.filter(p => p._id !== id));
                alert("Producto eliminado correctamente.");
            } catch (error) {
                alert(error); // Muestra el mensaje "No tienes permiso para eliminar"
            }
        }
    };

    if (loading) return <div className="loader">Cargando inventario de Automotriz...</div>;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h2>Panel de Inventario - Automotriz</h2>
                <button className="btn-add" onClick={() => {/* Aquí abrirías tu modal de crear */}}>
                    + Agregar Nuevo Repuesto
                </button>
            </header>

            <table className="stock-table">
                <thead>
                    <tr>
                        <th>Código (SKU)</th>
                        <th>Nombre</th>
                        <th>Marca/Modelo</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((item) => (
                        <tr key={item._id}>
                            <td>{item.codigo}</td>
                            <td>{item.nombre}</td>
                            <td>{item.marcaCarro} - {item.modeloCarro}</td>
                            <td>${item.precioVenta}</td>
                            <td className={item.stock < 5 ? 'low-stock' : ''}>
                                {item.stock}
                            </td>
                            <td>
                                <button className="btn-edit" onClick={() => {/* Lógica editar */}}>
                                    Editar
                                </button>
                                <button className="btn-delete" onClick={() => manejarEliminar(item._id, item.nombre)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
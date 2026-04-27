import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getRepuestos, deleteRepuesto } from '../services/repuestoService';
import { uploadImageToImgBB } from "../services/imageServices";

const AdminPanel = () => {
    const [view, setView] = useState('list'); 
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [archivo, setArchivo] = useState(null);
    const token = localStorage.getItem('token');

    const API_URL = "http://localhost:10000/api/repuestos";

    const initialFormState = {
        codigo: '', 
        nombre: '', 
        descripcion: '',
        categoria: 'Motor', 
        marcaCarro: '', 
        modeloCarro: '',
        precioVenta: '', 
        costoCompra: '', 
        stock: 0,
        stockMinimo: 2, 
        ubicacionPasillo: '', 
        imagenUrl: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (view === 'list') cargarStock();
    }, [view]);

    const cargarStock = async () => {
        setLoading(true);
        try {
            const data = await getRepuestos();
            setProductos(Array.isArray(data) ? data : (data.productos || []));
        } catch (error) {
            console.error("Error cargando stock:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImageUrl = formData.imagenUrl;

            // 1. Subida a ImgBB si hay archivo nuevo
            if (archivo) {
                finalImageUrl = await uploadImageToImgBB(archivo);
            }

            // 2. PAYLOAD SINCRONIZADO CON EL NUEVO SCHEMA
            const payload = { 
                codigo: formData.codigo.trim().toUpperCase(), // Siempre en mayúsculas
                nombre: formData.nombre.trim() || "Sin Nombre",
                descripcion: formData.descripcion || "",
                categoria: formData.categoria || "Motor",
                marcaCarro: formData.marcaCarro || "Universal",
                modeloCarro: formData.modeloCarro || "N/A",
                precioVenta: Number(formData.precioVenta) || 0,
                costoCompra: Number(formData.costoCompra) || 0,
                stock: Number(formData.stock) || 0,
                stockMinimo: Number(formData.stockMinimo) || 2,
                ubicacionPasillo: formData.ubicacionPasillo || "Almacén",
                imagenUrl: finalImageUrl || "https://via.placeholder.com/150?text=Sin+Imagen"
            };

            const config = {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            };

            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, payload, config);
                alert("✅ Actualizado en Automotriz San Francisco");
            } else {
                await axios.post(API_URL, payload, config);
                alert("✅ Registrado con éxito");
            }

            resetForm();
            setView('list');
            await cargarStock(); 
        } catch (error) {
            // ERROR DETALLADO: Aquí verás si es duplicado o validación
            const errorMsg = error.response?.data?.error || error.response?.data?.msg || "Fallo de conexión";
            console.error("DETALLE DEL ERROR:", error.response?.data);
            alert("⚠️ Error: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const prepararEdicion = (item) => {
        setFormData({
            ...item,
            // Aseguramos que los números se conviertan a string para los inputs
            precioVenta: item.precioVenta.toString(),
            costoCompra: item.costoCompra ? item.costoCompra.toString() : '0',
            stock: item.stock.toString(),
            stockMinimo: item.stockMinimo.toString()
        });
        setEditingId(item._id);
        setView('add');
    };

    const eliminarItem = async (id, nombre) => {
        if (window.confirm(`¿Seguro que deseas eliminar ${nombre}?`)) {
            try {
                await deleteRepuesto(id);
                setProductos(productos.filter(p => p._id !== id));
            } catch (error) { alert("Error al eliminar"); }
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setArchivo(null);
        setEditingId(null);
    };

    return (
        <div className="admin-container" style={containerStyle}>
            <h2 style={headerStyle}>Panel Administrativo - Automotriz San Francisco</h2>
            
            <div style={tabContainerStyle}>
                <button onClick={() => { setView('list'); resetForm(); }} style={tabBtnStyle(view === 'list')}>📦 Inventario</button>
                <button onClick={() => setView('add')} style={tabBtnStyle(view === 'add')}>➕ {editingId ? 'Editando...' : 'Nuevo Registro'}</button>
            </div>

            {view === 'list' ? (
                <div style={tableWrapper}>
                    {loading ? <p style={{textAlign:'center', color:'#00d4ff'}}>Sincronizando...</p> : (
                        <table style={tableStyle}>
                            <thead>
                                <tr style={theadStyle}>
                                    <th style={thStyle}>Imagen</th>
                                    <th style={thStyle}>Cód / Nombre</th>
                                    <th style={thStyle}>Vehículo / Pasillo</th>
                                    <th style={thStyle}>Precio</th>
                                    <th style={thStyle}>Stock</th>
                                    <th style={thStyle}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(p => (
                                    <tr key={p._id} style={trStyle}>
                                        <td style={tdStyle}><img src={p.imagenUrl} alt={p.nombre} style={imgThumbStyle} /></td>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: 'bold', color: '#00d4ff' }}>{p.codigo}</div>
                                            <div style={{ fontSize: '0.85rem' }}>{p.nombre}</div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div>{p.marcaCarro} {p.modeloCarro}</div>
                                            <div style={{fontSize: '0.75rem', color: '#888'}}>📍 {p.ubicacionPasillo || 'No asignado'}</div>
                                        </td>
                                        <td style={tdStyle}>${p.precioVenta}</td>
                                        <td style={{ ...tdStyle, color: p.stock <= p.stockMinimo ? '#ff4d4d' : '#00ff88', fontWeight: 'bold' }}>{p.stock}</td>
                                        <td style={tdStyle}>
                                            <button onClick={() => prepararEdicion(p)} style={editBtn}>✏️</button>
                                            <button onClick={() => eliminarItem(p._id, p.nombre)} style={deleteBtn}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div style={formCardStyle}>
                    <h3 style={{ color: '#00d4ff', marginBottom: '20px', textAlign: 'center' }}>{editingId ? 'Actualizar Datos' : 'Entrada de Mercancía'}</h3>
                    <form onSubmit={handleSubmit} style={gridFormStyle}>
                        <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
                             <img src={archivo ? URL.createObjectURL(archivo) : (formData.imagenUrl || 'https://via.placeholder.com/150')} alt="Preview" style={previewImgStyle} />
                            <input type="file" onChange={(e) => setArchivo(e.target.files[0])} style={{ display: 'block', margin: '10px auto', fontSize: '0.8rem' }} />
                        </div>

                        <div style={inputGroup}><label style={labelStyle}>Código (SKU)</label><input name="codigo" value={formData.codigo} onChange={handleChange} required style={inputStyle} placeholder="EJ: BOM-100" /></div>
                        <div style={inputGroup}><label style={labelStyle}>Nombre del Repuesto</label><input name="nombre" value={formData.nombre} onChange={handleChange} required style={inputStyle} /></div>
                        
                        <div style={inputGroup}>
                            <label style={labelStyle}>Categoría</label>
                            <select name="categoria" value={formData.categoria} onChange={handleChange} style={inputStyle}>
                                <option value="Motor">Motor</option>
                                <option value="Frenos">Frenos</option>
                                <option value="Suspension">Suspensión</option>
                                <option value="Electricidad">Electricidad</option>
                                <option value="Carroceria">Carrocería</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>

                        <div style={inputGroup}><label style={labelStyle}>Ubicación (Pasillo)</label><input name="ubicacionPasillo" value={formData.ubicacionPasillo} onChange={handleChange} placeholder="Ej: Pasillo A-4" style={inputStyle} /></div>
                        
                        <div style={inputGroup}><label style={labelStyle}>Marca Vehículo</label><input name="marcaCarro" value={formData.marcaCarro} onChange={handleChange} style={inputStyle} placeholder="Toyota, Ford..." /></div>
                        <div style={inputGroup}><label style={labelStyle}>Modelo Vehículo</label><input name="modeloCarro" value={formData.modeloCarro} onChange={handleChange} style={inputStyle} placeholder="Corolla, Fiesta..." /></div>
                        
                        <div style={inputGroup}><label style={labelStyle}>Precio Venta ($)</label><input type="number" name="precioVenta" value={formData.precioVenta} onChange={handleChange} style={inputStyle} /></div>
                        <div style={inputGroup}><label style={labelStyle}>Costo Compra ($)</label><input type="number" name="costoCompra" value={formData.costoCompra} onChange={handleChange} style={inputStyle} /></div>
                        
                        <div style={inputGroup}><label style={labelStyle}>Stock Actual</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} style={inputStyle} /></div>
                        <div style={inputGroup}><label style={labelStyle}>Stock Mínimo (Alerta)</label><input type="number" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} style={inputStyle} /></div>

                        <div style={{ ...inputGroup, gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Descripción Adicional</label>
                            <textarea name="descripcion" rows="2" value={formData.descripcion} onChange={handleChange} style={{ ...inputStyle, resize: 'none' }} />
                        </div>

                        <button type="submit" disabled={loading} style={btnSubmitStyle}>
                            {loading ? "PROCESANDO..." : editingId ? 'GUARDAR CAMBIOS' : 'REGISTRAR EN INVENTARIO'}
                        </button>
                        {editingId && <button type="button" onClick={() => {resetForm(); setView('list');}} style={cancelBtn}>Cancelar Edición</button>}
                    </form>
                </div>
            )}
        </div>
    );
};

// Estilos se mantienen igual que los tuyos (omitiendo por brevedad para que quepa el código)
const containerStyle = { padding: '20px', color: 'white', minHeight: '100vh', background: '#0f0c29', fontFamily: 'sans-serif' };
const headerStyle = { textAlign: 'center', color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px' };
const tabContainerStyle = { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' };
const tabBtnStyle = (active) => ({ padding: '12px 25px', background: active ? '#00d4ff' : 'transparent', color: active ? '#000' : '#fff', border: '1px solid #00d4ff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' });
const tableWrapper = { background: 'rgba(26, 26, 46, 0.95)', borderRadius: '20px', padding: '10px', border: '1px solid #2a2a40', overflowX: 'auto' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const theadStyle = { background: '#00d4ff', color: '#000' };
const thStyle = { padding: '15px', textAlign: 'left', textTransform: 'uppercase', fontSize: '0.8rem' };
const trStyle = { borderBottom: '1px solid #2a2a40' };
const tdStyle = { padding: '15px' };
const imgThumbStyle = { width: '55px', height: '55px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #00d4ff' };
const previewImgStyle = { width: '130px', height: '130px', objectFit: 'cover', borderRadius: '15px', border: '2px dashed #00d4ff', padding: '5px' };
const formCardStyle = { maxWidth: '700px', margin: 'auto', background: 'rgba(26, 26, 46, 0.95)', padding: '30px', borderRadius: '25px', border: '1px solid #00d4ff' };
const gridFormStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '0.85rem', color: '#888', marginLeft: '5px' };
const inputStyle = { padding: '12px', background: '#050510', border: '1px solid #333', color: 'white', borderRadius: '10px', outline: 'none' };
const btnSubmitStyle = { gridColumn: 'span 2', padding: '15px', background: '#00d4ff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', marginTop: '10px' };
const editBtn = { background: '#f39c12', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', marginRight: '8px' };
const deleteBtn = { background: '#e74c3c', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' };
const cancelBtn = { gridColumn: 'span 2', background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer', marginTop: '5px' };

export default AdminPanel;
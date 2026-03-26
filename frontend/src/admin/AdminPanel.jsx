import React, { useState } from 'react';
import axios from 'axios';
import { uploadImageToImgBB } from "../services/imageServices";
import AdminLayout from '../admin/AdminLayout'; 

const AdminPanel = () => {
  const [view, setView] = useState('inventory'); 
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token'); // NECESARIO PARA EL BACKEND

  const [formData, setFormData] = useState({
    codigo: '', nombre: '', descripcion: '',
    marcaCarro: '', modeloCarro: '', precioVenta: '',
    costoCompra: '', stock: 0, ubicacionPasillo: '',
    categoria: 'Motor'
  });
  
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) return alert("Por favor, selecciona una foto del repuesto");

    setLoading(true);
    try {
      // 1. Subir imagen a ImgBB
      const imageUrl = await uploadImageToImgBB(archivo);

      if (imageUrl) {
        const nuevoRepuesto = { 
          ...formData, 
          imagenUrl: imageUrl, 
          precioVenta: Number(formData.precioVenta),
          stock: Number(formData.stock),
          costoCompra: Number(formData.costoCompra || 0)
        };
        
        // 2. Enviar al Backend con TOKEN DE AUTORIZACIÓN (CRÍTICO)
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        await axios.post(
          'https://proyectosanfranciscoasis.onrender.com/api/repuestos', 
          nuevoRepuesto, 
          config
        );
        
        alert("¡Registro exitoso en San Francisco de Asís! 🛠️");
        
        // Resetear formulario
        setFormData({
          codigo: '', nombre: '', descripcion: '',
          marcaCarro: '', modeloCarro: '', precioVenta: '',
          costoCompra: '', stock: 0, ubicacionPasillo: '',
          categoria: 'Motor'
        });
        setArchivo(null);
        e.target.reset();
      }
    } catch (error) {
      console.error(error);
      const mensaje = error.response?.data?.msg || "Error de conexión con Render";
      alert(`Error: ${mensaje}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Selector de Vistas */}
      {userRole === 'admin' && (
        <div style={tabContainerStyle}>
          <button onClick={() => setView('inventory')} style={view === 'inventory' ? activeTabStyle : tabStyle}>📦 Inventario</button>
          <button onClick={() => setView('workers')} style={view === 'workers' ? activeTabStyle : tabStyle}>👥 Trabajadores</button>
        </div>
      )}

      {view === 'inventory' ? (
        <div style={{ maxWidth: '700px', margin: 'auto' }}>
          <div style={formCardStyle}>
            <h3 style={{ color: '#00d4ff', marginBottom: '20px', textAlign: 'center' }}>🛠️ Registro de Inventario</h3>
            
            <form onSubmit={handleSubmit} style={gridFormStyle}>
              
              {/* Grupo 1: Identificación */}
              <div style={inputGroup}>
                <label style={labelStyle}>Código / SKU</label>
                <input name="codigo" placeholder="Ej: REP-001" onChange={handleChange} value={formData.codigo} style={inputStyle} required />
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>Categoría</label>
                <select name="categoria" onChange={handleChange} value={formData.categoria} style={inputStyle}>
                  <option value="Motor">Motor</option>
                  <option value="Frenos">Frenos</option>
                  <option value="Suspension">Suspensión</option>
                  <option value="Electricidad">Electricidad</option>
                  <option value="Carroceria">Carrocería</option>
                </select>
              </div>

              {/* Grupo 2: Detalles del Producto */}
              <div style={{...inputGroup, gridColumn: 'span 2'}}>
                <label style={labelStyle}>Nombre del Repuesto</label>
                <input name="nombre" placeholder="Ej: Alternador 12V" onChange={handleChange} value={formData.nombre} style={inputStyle} required />
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>Marca de Carro</label>
                <input name="marcaCarro" placeholder="Ej: Toyota" onChange={handleChange} value={formData.marcaCarro} style={inputStyle} required />
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>Modelo/Año</label>
                <input name="modeloCarro" placeholder="Ej: Corolla 2015" onChange={handleChange} value={formData.modeloCarro} style={inputStyle} required />
              </div>

              {/* Grupo 3: Precios y Stock */}
              <div style={inputGroup}>
                <label style={labelStyle}>Costo Compra ($)</label>
                <input type="number" name="costoCompra" onChange={handleChange} value={formData.costoCompra} style={inputStyle} required />
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>Precio Venta ($)</label>
                <input type="number" name="precioVenta" onChange={handleChange} value={formData.precioVenta} style={inputStyle} required />
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>Cantidad en Stock</label>
                <input type="number" name="stock" onChange={handleChange} value={formData.stock} style={inputStyle} required />
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>Ubicación (Pasillo/Estante)</label>
                <input name="ubicacionPasillo" placeholder="Ej: A-12" onChange={handleChange} value={formData.ubicacionPasillo} style={inputStyle} />
              </div>

              {/* Foto */}
              <div style={{...inputGroup, gridColumn: 'span 2'}}>
                <label style={labelStyle}>Foto del Repuesto</label>
                <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files[0])} style={inputStyle} />
              </div>

              <button type="submit" disabled={loading} style={{ ...btnStyle, gridColumn: 'span 2', background: loading ? '#444' : '#00d4ff' }}>
                {loading ? "🚀 Subiendo a la Nube..." : "Finalizar Registro"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: 'white', marginTop: '50px' }}>
            <h3>👥 Módulo de Gestión de Personal</h3>
            <p>Aquí puedes gestionar los accesos de vendedores y otros administradores.</p>
        </div>
      )}
    </AdminLayout>
  );
};

// --- ESTILOS OPTIMIZADOS PARA PRESENTACIÓN ---
const tabContainerStyle = { display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center' };
const tabStyle = { background: 'transparent', color: '#888', border: '1px solid #333', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: '0.3s' };
const activeTabStyle = { ...tabStyle, background: '#00d4ff', color: '#000', border: '1px solid #00d4ff', fontWeight: 'bold' };
const formCardStyle = { background: 'rgba(26, 26, 46, 0.95)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(0, 212, 255, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };
const gridFormStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column' };
const labelStyle = { fontSize: '0.8rem', color: '#00d4ff', marginBottom: '8px', fontWeight: '500' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #2a2a40', background: '#0f0c29', color: 'white', fontSize: '0.9rem', outline: 'none' };
const btnStyle = { padding: '18px', borderRadius: '12px', border: 'none', color: '#000', fontWeight: '800', cursor: 'pointer', fontSize: '1rem', textTransform: 'uppercase', marginTop: '10px' };

export default AdminPanel;
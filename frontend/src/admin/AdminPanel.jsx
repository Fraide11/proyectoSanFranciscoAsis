import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Importación corregida con 's' y ruta ajustada
import { uploadImageToImgBB } from "../services/imageServices";
import AdminLayout from '../admin/AdminLayout'; 

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    codigo: '', 
    nombre: '', 
    descripcion: '',
    marcaCarro: '', 
    modeloCarro: '', 
    precioVenta: '',
    costoCompra: '', 
    stock: 0, 
    ubicacionPasillo: ''
  });
  
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) return alert("Por favor, selecciona una foto del repuesto");

// Dentro de tu switch o condicional de vistas en AdminPanel.jsx
{view === 'workers' && user.rol === 'admin' && (
    <WorkerManagement />
)}

    setLoading(true);
    try {
      // 1. Subida a ImgBB
      const imageUrl = await uploadImageToImgBB(archivo);

      if (imageUrl) {
        // 2. Preparar objeto para MongoDB
        const nuevoRepuesto = { 
          ...formData, 
          imagenUrl: imageUrl, 
          precioVenta: Number(formData.precioVenta),
          stock: Number(formData.stock),
          costoCompra: Number(formData.costoCompra || 0)
        };
        
        // 3. Petición al Backend
        await axios.post('https://proyectosanfranciscoasis.onrender.com/api/repuestos', nuevoRepuesto);
        
        alert("¡Registro exitoso en San Francisco de Asís! 🛠️");
        
        // 4. Limpieza del formulario
        setFormData({
          codigo: '', nombre: '', descripcion: '',
          marcaCarro: '', modeloCarro: '', precioVenta: '',
          costoCompra: '', stock: 0, ubicacionPasillo: ''
        });
        setArchivo(null);
        e.target.reset();
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error. Verifica que el código SKU no esté repetido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
        
        {/* BOTÓN PARA VOLVER A LA TIENDA */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <Link to="/" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            ⬅️ Ver Tienda (Vista Cliente)
          </Link>
        </div>

        <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ color: '#00d4ff', marginBottom: '20px', textAlign: 'center' }}>📦 Registrar Nuevo Repuesto</h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 2 }}>
                <label style={labelStyle}>Código / SKU</label>
                <input type="text" name="codigo" placeholder="Ej: BOM-001" onChange={handleChange} required style={inputStyle} value={formData.codigo} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Stock</label>
                <input type="number" name="stock" placeholder="Cantidad" onChange={handleChange} style={inputStyle} value={formData.stock} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Nombre del Producto</label>
              <input type="text" name="nombre" placeholder="Ej: Bomba de Agua" onChange={handleChange} required style={inputStyle} value={formData.nombre} />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Marca Vehículo</label>
                <input type="text" name="marcaCarro" placeholder="Toyota" onChange={handleChange} required style={inputStyle} value={formData.marcaCarro} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Modelo</label>
                <input type="text" name="modeloCarro" placeholder="Corolla" onChange={handleChange} required style={inputStyle} value={formData.modeloCarro} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Precio Venta ($)</label>
                <input type="number" name="precioVenta" placeholder="0.00" onChange={handleChange} required style={inputStyle} value={formData.precioVenta} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Ubicación (Pasillo)</label>
                <input type="text" name="ubicacionPasillo" placeholder="A-12" onChange={handleChange} style={inputStyle} value={formData.ubicacionPasillo} />
              </div>
            </div>

            <div style={{ background: 'rgba(100, 108, 255, 0.1)', padding: '15px', borderRadius: '10px', border: '1px dashed #646cff', marginTop: '10px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', color: '#ccc' }}>📷 Foto del Repuesto:</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setArchivo(e.target.files[0])} 
                required 
                style={{ color: 'white', fontSize: '0.8rem' }} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              style={{ 
                ...btnStyle, 
                background: loading ? '#444' : '#646cff',
                marginTop: '10px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? "🚀 Subiendo a la nube..." : "Finalizar Registro"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

// Estilos rápidos
const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#00d4ff', marginBottom: '5px', marginLeft: '5px' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f0c29', color: 'white', width: '100%', outline: 'none', fontSize: '0.9rem' };
const btnStyle = { padding: '15px', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '1rem', transition: '0.3s', boxShadow: '0 4px 15px rgba(100, 108, 255, 0.3)' };

export default AdminPanel;
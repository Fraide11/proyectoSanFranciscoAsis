import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { uploadImageToImgBB } from "../services/imageServices";
import AdminLayout from '../admin/AdminLayout'; 

// Importa WorkerManagement si lo vas a usar aquí
// import WorkerManagement from './WorkerManagement';

const AdminPanel = () => {
  // Estado para controlar qué vista mostrar (Inventario o Trabajadores)
  const [view, setView] = useState('inventory'); 
  const userRole = localStorage.getItem('userRole');

  const [formData, setFormData] = useState({
    codigo: '', nombre: '', descripcion: '',
    marcaCarro: '', modeloCarro: '', precioVenta: '',
    costoCompra: '', stock: 0, ubicacionPasillo: '',
    categoria: 'Motor' // Valor por defecto
  });
  
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) return alert("Por favor, selecciona una foto del repuesto");

    setLoading(true);
    try {
      const imageUrl = await uploadImageToImgBB(archivo);

      if (imageUrl) {
        const nuevoRepuesto = { 
          ...formData, 
          imagenUrl: imageUrl, 
          precioVenta: Number(formData.precioVenta),
          stock: Number(formData.stock),
          costoCompra: Number(formData.costoCompra || 0)
        };
        
        await axios.post('https://proyectosanfranciscoasis.onrender.com/api/repuestos', nuevoRepuesto);
        
        alert("¡Registro exitoso en San Francisco de Asís! 🛠️");
        
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
      alert("Error: Verifica el SKU o la conexión con Render.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Selector de Vistas (Solo si es Admin) */}
      {userRole === 'admin' && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
          <button onClick={() => setView('inventory')} style={view === 'inventory' ? activeTabStyle : tabStyle}>📦 Inventario</button>
          <button onClick={() => setView('workers')} style={view === 'workers' ? activeTabStyle : tabStyle}>👥 Trabajadores</button>
        </div>
      )}

      {view === 'inventory' ? (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
          {/* Tu formulario actual */}
          <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: '#00d4ff', marginBottom: '20px', textAlign: 'center' }}>📦 Registrar Nuevo Repuesto</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Categoría (Nueva) */}
              <div>
                <label style={labelStyle}>Categoría</label>
                <select name="categoria" onChange={handleChange} style={inputStyle} value={formData.categoria}>
                  <option value="Motor">Motor</option>
                  <option value="Frenos">Frenos</option>
                  <option value="Suspension">Suspensión</option>
                  <option value="Electricidad">Electricidad</option>
                </select>
              </div>

              {/* ... Resto de tus inputs (Código, Nombre, etc.) ... */}
              {/* (Mantén tus inputs actuales aquí) */}

              <button type="submit" disabled={loading} style={{ ...btnStyle, background: loading ? '#444' : '#646cff' }}>
                {loading ? "🚀 Subiendo..." : "Finalizar Registro"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Renderizado condicional de la gestión de trabajadores */
        <div>Aquí va el componente de WorkerManagement</div>
      )}
    </AdminLayout>
  );
};

// Estilos adicionales
const tabStyle = { background: 'transparent', color: '#888', border: '1px solid #333', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' };
const activeTabStyle = { ...tabStyle, background: '#646cff', color: 'white', border: '1px solid #646cff' };
const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#00d4ff', marginBottom: '5px' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f0c29', color: 'white', width: '100%' };
const btnStyle = { padding: '15px', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' };

export default AdminPanel;
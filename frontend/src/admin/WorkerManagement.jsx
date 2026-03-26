import React, { useState } from 'react';
import axios from 'axios'; // Usamos axios directamente o vía service para mayor control

const WorkerManagement = () => {
    // 1. Estado inicial con Rol (Importante para tu diagrama de clases)
    const [formData, setFormData] = useState({ 
        nombre: '', 
        email: '', 
        password: '',
        rol: 'vendedor' // Por defecto, el admin crea vendedores/trabajadores
    });
    
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const token = localStorage.getItem('token');

        try {
            // 2. Configuración con Token (Solo el Admin tiene permiso)
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };

            // 3. Petición al endpoint de registro
            // Ajusta la URL si tienes un endpoint específico como /api/auth/register-worker
            await axios.post(
                'https://proyectosanfranciscoasis.onrender.com/api/auth/register', 
                formData, 
                config
            );

            setMessage({ type: 'success', text: '¡Personal registrado con éxito! 👥' });
            setFormData({ nombre: '', email: '', password: '', rol: 'vendedor' }); 
            
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.msg || "Error al conectar con el servidor";
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="worker-management-container">
            <h3 style={{ color: '#00d4ff', marginBottom: '20px' }}>👥 Registro de Personal</h3>
            
            {message.text && (
                <div className={`alert-box ${message.type === 'success' ? 'alert-ok' : 'alert-error'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="admin-form-grid">
                <div className="form-group">
                    <label>Nombre Completo</label>
                    <input 
                        type="text" name="nombre" placeholder="Ej: Juan Pérez" 
                        value={formData.nombre} onChange={handleChange} required 
                    />
                </div>

                <div className="form-group">
                    <label>Correo Electrónico (Login)</label>
                    <input 
                        type="email" name="email" placeholder="ejemplo@sanfrancisco.com" 
                        value={formData.email} onChange={handleChange} required 
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña Temporal</label>
                    <input 
                        type="password" name="password" placeholder="Mínimo 6 caracteres" 
                        value={formData.password} onChange={handleChange} required 
                    />
                </div>

                <div className="form-group">
                    <label>Rol del Usuario</label>
                    <select name="rol" value={formData.rol} onChange={handleChange}>
                        <option value="vendedor">Vendedor / Trabajador</option>
                        <option value="admin">Administrador (Cuidado)</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={loading}
                    style={{ marginTop: '10px' }}
                >
                    {loading ? "Registrando..." : "Confirmar Alta de Personal"}
                </button>
            </form>

            <div className="worker-list-preview">
                <h4>Estatus del Módulo</h4>
                <p>⚠️ El sistema de auditoría registrará este alta bajo tu usuario: <strong>{localStorage.getItem('userName')}</strong></p>
            </div>
        </div>
    );
};

export default WorkerManagement;
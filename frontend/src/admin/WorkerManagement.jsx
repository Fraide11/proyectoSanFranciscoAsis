import React, { useState } from 'react';
import axios from 'axios';
import { FaUserPlus, FaShieldAlt } from 'react-icons/fa';

const WorkerManagement = () => {
    // 1. Estado inicial coherente con tu Backend
    const [formData, setFormData] = useState({ 
        nombre: '', 
        email: '', 
        password: '',
        rol: 'trabajador' // Ajustado a 'trabajador' para coincidir con el option
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
        // CONFIGURACIÓN CORRECTA SEGÚN TU MIDDLEWARE
        const config = {
            headers: { 
                // Así es como lo busca tu función 'proteger'
                'Authorization': `Bearer ${token}` 
            }
        };

        const res = await axios.post(
            'http://localhost:10000/api/auth/register-worker', 
            formData, 
            config
        );

        setMessage({ type: 'success', text: res.data.msg || '¡Personal registrado! 👥' });
        setFormData({ nombre: '', email: '', password: '', rol: 'trabajador' }); 
        
    } catch (err) {
        console.error("Error Auth:", err.response?.data);
        const errorMsg = err.response?.data?.msg || "Acceso denegado";
        setMessage({ type: 'error', text: errorMsg });
    } finally {
        setLoading(false);
    }
};




    return (
        <div className="worker-management-container">
            <h3 style={{ color: '#00d4ff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaUserPlus /> Registro de Personal
            </h3>
            
            {/* Sistema de Alertas Visuales */}
            {message.text && (
                <div className={`alert-box ${message.type === 'success' ? 'alert-ok' : 'alert-error'}`} 
                     style={{ 
                        padding: '15px', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        backgroundColor: message.type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                        color: message.type === 'success' ? '#00ff88' : '#ff4d4d',
                        border: `1px solid ${message.type === 'success' ? '#00ff88' : '#ff4d4d'}`
                     }}>
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
                        <option value="trabajador">Trabajador</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={loading}
                    style={{ 
                        marginTop: '10px', 
                        padding: '12px', 
                        backgroundColor: '#00d4ff', 
                        color: '#000', 
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    {loading ? "PROCESANDO..." : "CONFIRMAR ALTA"}
                </button>
            </form>

            <div className="worker-list-preview" style={{ marginTop: '30px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#888' }}>Estatus del Módulo</h4>
                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>
                    <FaShieldAlt style={{ color: '#ffa500', marginRight: '5px' }} /> 
                    Auditoría activa: Registrando como <strong>{localStorage.getItem('userName') || 'Admin'}</strong>
                </p>
            </div>
        </div>
    );
};

export default WorkerManagement;
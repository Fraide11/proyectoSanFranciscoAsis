import React, { useState } from 'react';
import { registerWorker } from '../services/authService';

const WorkerManagement = () => {
    const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerWorker(formData);
            setMessage({ type: 'success', text: '¡Trabajador creado con éxito!' });
            setFormData({ nombre: '', email: '', password: '' }); // Limpiar campos
        } catch (err) {
            setMessage({ type: 'error', text: err });
        }
    };

    return (
        <div className="worker-management">
            <h3>Registrar Nuevo Trabajador</h3>
            
            {message.text && (
                <p className={message.type === 'success' ? 'msg-ok' : 'msg-error'}>
                    {message.text}
                </p>
            )}

            <form onSubmit={handleSubmit} className="admin-form">
                <input 
                    type="text" name="nombre" placeholder="Nombre completo" 
                    value={formData.nombre} onChange={handleChange} required 
                />
                <input 
                    type="email" name="email" placeholder="Correo electrónico" 
                    value={formData.email} onChange={handleChange} required 
                />
                <input 
                    type="password" name="password" placeholder="Contraseña temporal" 
                    value={formData.password} onChange={handleChange} required 
                />
                <button type="submit" className="btn-save">Crear Trabajador</button>
            </form>

            <hr />
            {/* Aquí podrías mapear una lista de trabajadores existentes más adelante */}
            <h4>Lista de Personal Actual</h4>
            <p>Sección en desarrollo: Aquí aparecerán los trabajadores para poder eliminarlos.</p>
        </div>
    );
};

export default WorkerManagement;
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const { token } = useParams(); // Extrae el token de la URL (:token)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMensaje({ texto: 'Las contraseñas no coinciden', tipo: 'error' });
            return;
        }

        try {
            // Llamada al backend usando el token de los params
            const res = await axios.post(`http://localhost:10000/api/auth/reset-password/${token}`, { password });
            setMensaje({ texto: res.data.msg, tipo: 'success' });
            
            // Redirigir al login después de 3 segundos
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setMensaje({ 
                texto: error.response?.data?.msg || 'Error al restablecer la contraseña', 
                tipo: 'error' 
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <form onSubmit={handleSubmit} className="p-8 bg-gray-800 shadow-xl rounded-xl w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Nueva Contraseña</h2>
                
                <p className="text-sm text-gray-400 mb-6 text-center">
                    Ingresa tu nueva clave de acceso para **Automotriz San Francisco**.
                </p>

                <input 
                    type="password" 
                    placeholder="Nueva contraseña" 
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded mb-4 focus:outline-none focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <input 
                    type="password" 
                    placeholder="Confirmar contraseña" 
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded mb-6 focus:outline-none focus:border-blue-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-200">
                    Actualizar Contraseña
                </button>

                {mensaje.texto && (
                    <div className={`mt-4 p-3 rounded text-center text-sm ${mensaje.tipo === 'error' ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                        {mensaje.texto}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ResetPassword;
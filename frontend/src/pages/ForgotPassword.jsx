// vista para recuperar la contra...
import React, { useState } from 'react';
import axios from 'axios'; // Importación vital

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('Enviando...'); // Feedback visual rápido

        try {
            // Usamos la IP y puerto directos para evitar fallos de proxy
            const res = await axios.post('http://localhost:10000/api/auth/forgot-password', { email });
            setMensaje(res.data.msg);
        } catch (error) {
            // Si el backend responde, mostramos su mensaje, si no, error de conexión
            const errorMsg = error.response?.data?.msg || 'Error al conectar con el servidor';
            setMensaje(errorMsg);
            console.error("Error en la petición:", error.response || error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#0f0c29' }}>
            <form onSubmit={handleSubmit} className="p-8 bg-gray-800 shadow-xl rounded-xl border border-gray-700 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Recuperar Contraseña</h2>
                
                <p className="text-sm text-gray-400 mb-6 text-center">
                    Ingresa tu correo para recibir un enlace de recuperación.
                </p>

                <input 
                    type="email" 
                    placeholder="Tu correo electrónico" 
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded mb-4 text-white focus:outline-none focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-200">
                    Enviar enlace de recuperación
                </button>

                {mensaje && (
                    <div className={`mt-4 p-3 rounded text-center text-sm ${mensaje.includes('Error') ? 'bg-red-900/50 text-red-300' : 'bg-blue-900/50 text-blue-300'}`}>
                        {mensaje}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ForgotPassword;
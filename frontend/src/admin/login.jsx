import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import './LoginStyles.css'; // Asegúrate de tener estilos para que no se vea plano

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Feedback visual
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Llamamos al contexto que hace el POST al backend
            const data = await login(email, password);

            // 2. GUARDADO DE DATOS (Vital para que el AdminLayout y AdminPanel funcionen)
            // El backend debe devolver: { token, rol, nombre }
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.rol); // 'admin' o 'vendedor'
            localStorage.setItem('userName', data.nombre || "Fraider Figueroa"); 

            // 3. REDIRECCIÓN SEGÚN ROL
            // Ajustado a las rutas que hemos estado trabajando
            if (data.rol === 'admin') {
                navigate('/admin'); // Al dashboard principal
            } else if (data.rol === 'vendedor') {
                navigate('/admin'); // El vendedor también va al panel pero con menos opciones
            } else {
                navigate('/'); // El cliente a la tienda principal
            }

            alert(`¡Bienvenido, ${data.nombre || 'al sistema'}!`);

        } catch (error) {
            console.error("Login Error:", error);
            alert("Credenciales incorrectas. Verifica tu correo y contraseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <span className="logo-icon">⚙️</span>
                    <h1>Autopartes San Francisco</h1>
                    <p>Gestión de Inventario y Ventas</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            placeholder="ejemplo@correo.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Verificando..." : "Ingresar al Sistema"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>¿Olvidaste tu acceso? Contacta al administrador.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
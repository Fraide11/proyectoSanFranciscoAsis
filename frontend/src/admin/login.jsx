import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await login(credentials.email, credentials.password);
            
            // Redirección lógica por ROL
            if (data.user.rol === 'admin' || data.user.rol === 'trabajador') {
                navigate('/admin/panel'); 
            } else {
                navigate('/'); // Clientes a la tienda
            }
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Iniciar Sesión</h2>
                {error && <p className="error-msg">{error}</p>}
                
                <input 
                    type="email" name="email" 
                    placeholder="Correo Electrónico" 
                    onChange={handleChange} required 
                />
                <input 
                    type="password" name="password" 
                    placeholder="Contraseña" 
                    onChange={handleChange} required 
                />
                
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;
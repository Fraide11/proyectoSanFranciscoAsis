import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Asumiendo que usas Context

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Llamamos a la función de login que conecta con el Backend
            const data = await login(email, password);

            // 2. LA MAGIA: Redirección según el ROL que viene del backend
            if (data.rol === 'admin') {
                navigate('/admin/dashboard'); // Al panel que me mostraste en la foto
            } else if (data.rol === 'vendedor') {
                navigate('/admin/inventario'); // Directo a gestionar repuestos
            } else {
                navigate('/tienda'); // El cliente se queda viendo las cards de productos
            }
        } catch (error) {
            alert("Error al iniciar sesión: " + error.message);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Iniciar Sesión - Automotriz</h2>
                <input 
                    type="email" 
                    placeholder="Tu correo" 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
};

export default Login;
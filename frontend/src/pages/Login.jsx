import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService'; 

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(usuario, password); 
      
      // ✅ PERSISTENCIA DE DATOS VITAL PARA "MIS COMPRAS"
      // Guardamos el token para las peticiones y el ID para filtrar el historial
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuarioId', data.user._id || data.user.id);

      const userRol = data.user.rol; 

      // USAMOS window.location.href PARA FORZAR LA RECARGA
      // Esto asegura que el AuthContext capture los nuevos datos del localStorage
      switch (userRol) {
        case 'admin':
          window.location.href = '/admin';
          break;
        case 'trabajador':
          window.location.href = '/worker'; 
          break;
        case 'cliente':
          window.location.href = '/mis-compras'; 
          break;
        default:
          window.location.href = '/';
          break;
      }

    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Error al iniciar sesión';
      setError(errorMsg); 
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', color: 'white' }}>
      <h2 style={{ color: '#00d1ff', marginBottom: '20px' }}>Inicia Sesión</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
        
        {error && (
          <div style={{ color: '#ff4d4d', fontSize: '0.85rem', textAlign: 'center', backgroundColor: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '5px', border: '1px solid #ff4d4d' }}>
            {error}
          </div>
        )}

        <input 
          type="text" 
          placeholder="Usuario" 
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', background: '#1a1d23', color: 'white' }}
        />

        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', background: '#1a1d23', color: 'white' }}
        />

        <button 
          type="submit" 
          style={{ padding: '12px', backgroundColor: '#00d1ff', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
        >
          ENTRAR
        </button>
      </form>

      <div style={{ marginTop: '25px', textAlign: 'center' }}>
        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>¿Nuevo por aquí? </span>
        <Link to="/register" style={{ color: '#00d1ff', textDecoration: 'none', fontWeight: 'bold' }}>
          Regístrate
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
        >
          Volver al inicio
        </button>

        <button 
          onClick={() => navigate('/forgot-password')} 
          style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
        >
          Recuperar contraseña
        </button>
      </div>
    </div>
  );
};

export default Login;
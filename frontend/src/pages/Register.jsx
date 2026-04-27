import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Paleta de colores San Francisco de Asís
    const azulNeon = '#00d4ff';
    const fondoOscuro = '#0f0c29';
    const fondoCard = '#1a1a2e';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Las contraseñas no coinciden');
        }

        if (formData.password.length < 6) {
            return setError('La clave debe tener al menos 6 caracteres');
        }

        try {
            // Enviamos exactamente lo que pide tu Schema de Mongoose
            const res = await axios.post('http://localhost:10000/api/auth/register', {
                nombre: formData.nombre,
                email: formData.email,
                password: formData.password
                // El rol se pone 'cliente' por defecto en el Schema
            });

            if (res.data) {
                alert("¡Usuario registrado con éxito!");
                navigate('/login');
            }
        } catch (err) {
            // Capturamos el error 400 o 500 del backend
            setError(err.response?.data?.msg || err.response?.data?.message || 'Error al registrarse');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: fondoOscuro }}>
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                padding: '40px 20px'
            }}>
                <div style={{
                    background: fondoCard,
                    padding: '40px',
                    borderRadius: '20px',
                    border: `1px solid ${azulNeon}`,
                    width: '100%',
                    maxWidth: '450px',
                    boxShadow: `0 0 25px ${azulNeon}22`,
                    backdropFilter: 'blur(10px)'
                }}>
                    <h2 style={{ 
                        textAlign: 'center', 
                        color: azulNeon, 
                        marginBottom: '30px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>
                        Registro de Cliente
                    </h2>

                    {error && (
                        <div style={{ 
                            background: 'rgba(255, 77, 77, 0.1)', 
                            color: '#ff4d4d', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            marginBottom: '20px',
                            border: '1px solid #ff4d4d',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Nombre de Usuario</label>
                            <input
                                type="text" name="nombre" placeholder="Ej: Fraider"
                                style={inputStyle} onChange={handleChange} required
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Correo Electrónico</label>
                            <input
                                type="email" name="email" placeholder="tu@email.com"
                                style={inputStyle} onChange={handleChange} required
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Contraseña (mín. 6 caracteres)</label>
                            <input
                                type="password" name="password" placeholder="••••••••"
                                style={inputStyle} onChange={handleChange} required
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>Confirmar Contraseña</label>
                            <input
                                type="password" name="confirmPassword" placeholder="••••••••"
                                style={inputStyle} onChange={handleChange} required
                            />
                        </div>

                        <button type="submit" style={{
                            width: '100%', 
                            background: azulNeon, 
                            color: fondoOscuro,
                            border: 'none', 
                            padding: '14px', 
                            borderRadius: '8px',
                            fontWeight: 'bold', 
                            cursor: 'pointer',
                            fontSize: '1rem',
                            boxShadow: `0 4px 15px ${azulNeon}44`,
                            transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            CREAR CUENTA
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '25px', color: '#aaa', fontSize: '0.9rem' }}>
                        ¿Ya eres parte de San Francisco? <br/>
                        <Link to="/login" style={{ color: azulNeon, textDecoration: 'none', fontWeight: 'bold' }}>
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Estilos rápidos para no ensuciar el JSX
const inputGroupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#00d4ff', fontWeight: '500' };
const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#0f0c29',
    color: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    fontSize: '1rem',
    transition: 'border 0.3s',
};

export default Register;
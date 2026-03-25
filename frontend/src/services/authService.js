import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Ajusta a tu puerto de backend

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        
        if (response.data.token) {
            // Guardamos el token y los datos del usuario (id, nombre, rol)
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        }
        
        return response.data;
    } catch (error) {
        throw error.response.data.msg || "Error al iniciar sesión";
    }
};

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export const registerWorker = async (workerData) => {
    const token = localStorage.getItem('token'); // Necesitamos el token del Admin
    try {
        const response = await axios.post(`${API_URL}/register-worker`, workerData, {
            headers: {
                'Authorization': `Bearer ${token}` // Enviamos el token para validar que es Admin
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data.msg || "Error al registrar al trabajador";
    }
};
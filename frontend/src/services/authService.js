import axios from 'axios';

const API_URL = 'http://localhost:10000/api/auth';

// 1. Configuración de instancia para no repetir el Token en cada llamada
const authApi = axios.create({
    baseURL: API_URL
});

// Interceptor: Antes de cada petición, revisa si hay token y lo pega al Header
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));


// --- FUNCIONES EXPORTADAS ---

export const login = async (email, password) => {
    try {
        const response = await authApi.post('/login', { email, password });
        
        if (response.data.token) {
            // Guardamos todo de una vez para que el AuthContext lo detecte
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        }
        
        return response.data;
    } catch (error) {
        // Manejo de errores blindado
        const message = error.response?.data?.msg || "Error de conexión con el servidor";
        throw message;
    }
};

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Forzamos un reload limpio para limpiar estados de React si es necesario
    window.location.href = '/login';
};

export const getCurrentUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        return null;
    }
};

export const registerWorker = async (workerData) => {
    try {
        // Ya no necesitas sacar el token a mano, el interceptor lo hace por ti
        const response = await authApi.post('/register-worker', workerData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.msg || "No tienes permisos de administrador";
        throw message;
    }
};

// Función extra para validar si el token sigue siendo válido (útil para el useEffect de App.js)
export const verifyToken = async () => {
    try {
        const response = await authApi.get('/verify');
        return response.data.valid;
    } catch (error) {
        return false;
    }
};
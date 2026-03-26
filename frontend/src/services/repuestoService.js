import axios from 'axios';

// 1. Centralizamos la URL usando la variable de entorno de Vite
const BASE_URL = import.meta.env.VITE_API_URL || 'https://proyectosanfranciscoasis.onrender.com/api';
const API_URL = `${BASE_URL}/repuestos`;

// 2. Configuramos una instancia de Axios para Repuestos
// Esto hereda la lógica de seguridad automáticamente
const repuestosApi = axios.create({
    baseURL: API_URL
});

// Interceptor para inyectar el token en cada petición (indispensable para Render)
repuestosApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- FUNCIONES CRUD ---

export const getRepuestos = async (busqueda = "") => {
    try {
        // Usamos params de Axios para que la URL quede limpia: ?buscar=bujia
        const response = await repuestosApi.get('/', {
            params: { buscar: busqueda }
        });
        return response.data;
    } catch (error) {
        console.error("Error en getRepuestos:", error.response?.data || error.message);
        return []; // Retornamos array vacío para que el .map() de React no explote
    }
};

export const createRepuesto = async (datos) => {
    try {
        const response = await repuestosApi.post('/', datos);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Error al crear el repuesto";
    }
};

export const updateRepuesto = async (id, datos) => {
    try {
        const response = await repuestosApi.put(`/${id}`, datos);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "Error al actualizar el repuesto";
    }
};

export const deleteRepuesto = async (id) => {
    try {
        const response = await repuestosApi.delete(`/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || "No tienes permiso para eliminar";
    }
};
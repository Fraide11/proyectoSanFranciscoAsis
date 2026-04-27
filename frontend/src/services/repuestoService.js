import axios from 'axios';

// 1. Centralizamos la URL usando la variable de entorno de Vite
const BASE_URL = import.meta.env.VITE_API_URL || 'VITE_API_URL=http://localhost:10000/api';
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

// frontend/src/services/repuestoService.js
export const getRepuestos = async () => {
  try {
    const response = await fetch('http://localhost:10000/api/repuestos');
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error en service:", error);
    return [];
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
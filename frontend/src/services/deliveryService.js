import axios from 'axios';

// Asegúrate de que termine en /api/delivery
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/delivery';

const deliveryService = {
    // 1. Obtener todos (Corregido el Path)
    obtenerTodos: async () => {
        try {
            // Eliminamos el "/delivery" extra porque ya está en API_URL
            const response = await axios.get(`${API_URL}/todos`); 
            return response.data;
        } catch (error) {
            console.error("Error obteniendo entregas:", error);
            throw error;
        }
    },

    // 2. Crear registro
    crearDelivery: async (deliveryData) => {
        try {
            const response = await axios.post(`${API_URL}/crear`, deliveryData);
            return response.data;
        } catch (error) {
            console.error("Error en crearDelivery:", error);
            throw error;
        }
    },

    // 3. Actualizar estado
    actualizarEstado: async (id, nuevoEstado) => {
        try {
            const response = await axios.put(`${API_URL}/actualizar-estado/${id}`, { nuevoEstado });
            return response.data;
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            throw error;
        }
    }
};

export default deliveryService;
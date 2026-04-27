import axios from 'axios';

// Asegúrate de que el puerto coincida con el de tu backend (ej. 5000 o 4000)
const API_URL = 'http://localhost:10000/api/logs-update'; 

export const getHistorialCompleto = async (token) => {
    try {
        const config = { 
            headers: { 
                Authorization: `Bearer ${token}` 
            } 
        };
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        console.error("Error en logService:", error.response?.data || error.message);
        throw error;
    }
};
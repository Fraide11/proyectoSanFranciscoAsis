import axios from 'axios';

// Asegúrate de que este puerto sea el que usa tu backend (normalmente 5000)
const API_URL = 'http://localhost:5000/api/chat'; 

export const sendMessageToAI = async (message) => {
    try {
        const response = await axios.post(API_URL, { prompt: message });
        // Retornamos la respuesta que viene del backend
        return response.data.reply; 
    } catch (error) {
        console.error("Error en ChatService:", error);
        throw error;
    }
};
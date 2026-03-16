// frontend/src/services/chatService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://proyectosanfranciscoasis.onrender.com/api';
const API_URL = `${BASE_URL}/chat`;

export const sendMessageToAI = async (message) => {
    try {
        const response = await axios.post(API_URL, { prompt: message });
        return response.data.reply; 
    } catch (error) {
        console.error("Error en Luna Chat:", error);
        throw error;
    }
};
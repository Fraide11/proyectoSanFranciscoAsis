// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};
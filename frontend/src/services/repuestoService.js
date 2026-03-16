// frontend/src/services/repuestoService.js
const BASE_URL = import.meta.env.VITE_API_URL || 'https://proyectosanfranciscoasis.onrender.com/api';
const API_URL = `${BASE_URL}/repuestos`;

export const getRepuestos = async (busqueda = "") => {
    try {
        const response = await fetch(`${API_URL}?query=${busqueda}`);
        if (!response.ok) throw new Error("Error en la petición");
        return await response.json();
    } catch (error) {
        console.error("Error al traer repuestos:", error);
        return [];
    }
};
// frontend/src/services/repuestoService.js
const API_URL = 'http://localhost:5000/api/repuestos';

export const getRepuestos = async (busqueda = "") => {
    try {
        const response = await fetch(`${API_URL}?query=${busqueda}`);
        // Verificamos si la respuesta es ok
        if (!response.ok) throw new Error("Error en la petición");
        return await response.json();
    } catch (error) {
        console.error("Error al traer repuestos:", error);
        return [];
    }
};
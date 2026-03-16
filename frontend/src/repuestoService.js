const API_URL = 'http://localhost:5000/api/repuestos';

export const getRepuestos = async (busqueda = "") => {
    try {
        const response = await fetch(`${API_URL}?query=${busqueda}`);
        return await response.json();
    } catch (error) {
        console.error("Error al traer repuestos:", error);
        return [];
    }
};
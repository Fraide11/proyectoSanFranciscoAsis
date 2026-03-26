const BASE_URL = import.meta.env.VITE_API_URL || 'https://proyectosanfranciscoasis.onrender.com/api';
const API_URL = `${BASE_URL}/repuestos`;

// Helper para el token
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const getRepuestos = async (busqueda = "") => {
    try {
        // Usamos 'buscar' para que coincida con el controlador que te pasé antes
        const response = await fetch(`${API_URL}?buscar=${busqueda}`); 
        if (!response.ok) throw new Error("Error en la petición");
        return await response.json();
    } catch (error) {
        console.error("Error al traer repuestos:", error);
        return [];
    }
};

export const deleteRepuesto = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return await response.json();
};

export const updateRepuesto = async (id, datos) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await response.json();
};
import axios from 'axios';

// 1. Configuración de la URL Base
// En tu .env solo debes tener: VITE_API_URL=http://localhost:10000/api
const API_BASE_URL = import.meta.env.VITE_API_URL;

// 2. Creamos una instancia personalizada
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Servicio de Tasa de Cambio
 * Obtiene el valor actual del dólar para los cálculos de Automotriz San Francisco de Asís.
 */
export const getTasaActual = async () => {
    try {
        // Al usar la instancia 'api', solo necesitas poner el endpoint relativo
        const response = await api.get('/tasa');
        
        // Verificamos que la data exista
        if (response.data) {
            return response.data;
        }
        
        throw new Error("Respuesta de API vacía");
    } catch (error) {
        // Si el backend cae o el internet en Ciudad Bolívar falla, 
        // devolvemos un valor seguro para que el usuario pueda seguir viendo precios
        console.error("❌ Error en getTasaActual:", error.message);
        
        return { 
            valor: 36.50, // Valor de respaldo (fallback)
            isFallback: true 
        };
    }
};

/**
 * Ejemplo de cómo agregarías otros servicios en este mismo archivo
 */
export const getDeliveryConfig = async () => {
    try {
        const response = await api.get('/delivery');
        return response.data;
    } catch (error) {
        console.error("❌ Error en getDeliveryConfig:", error.message);
        return null;
    }
};
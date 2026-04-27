import axios from 'axios';

export const descargarArchivoPDF = async (url, nombreArchivo) => {
    try {
        const response = await axios.get(url, {
            responseType: 'blob', // Crítico para manejar archivos binarios
        });

        // Crear el objeto para descarga
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', nombreArchivo);
        document.body.appendChild(link);
        link.click();
        
        // Limpieza
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error al descargar el PDF:", error);
        alert("No se pudo generar el archivo. Verifica el servidor.");
    }
};
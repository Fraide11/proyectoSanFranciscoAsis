import React from 'react';

const ReportesPage = () => {
    // Función unificada para descargar ambos tipos de PDF
    const descargarPDF = async (tipo) => {
        console.log(`🚀 Iniciando descarga para: ${tipo}`);
        
        // Definimos el endpoint según el botón presionado
        const endpoint = tipo === 'critico' ? 'stock-bajo' : 'inventario-completo';
        const nombreSugerido = tipo === 'critico' ? 'Reporte_Stock_Critico.pdf' : 'Inventario_General.pdf';

        try {
            const token = localStorage.getItem('token');
            // Usamos el puerto 10000 que ya confirmamos
            const response = await fetch(`http://localhost:10000/api/reportes/${endpoint}?download=pdf`, {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', nombreSugerido);
                document.body.appendChild(link);
                link.click();
                link.remove();
                console.log("✅ Descarga completada con éxito");
            } else {
                const errorData = await response.json();
                console.error("❌ Error en el servidor:", errorData);
                alert(`Error: ${errorData.message || 'No se pudo generar el PDF'}`);
            }
        } catch (error) {
            console.error("🚨 Error de red o conexión:", error);
            alert("No se pudo conectar con el servidor. Revisa si el backend está corriendo.");
        }
    };

    return (
        <div style={{ padding: '30px', color: 'white', minHeight: '80vh' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>📊 Inteligencia de Inventario</h1>
                <p style={{ color: '#888' }}>
                    Gestión de reportes oficiales para <strong>Automotriz San Francisco de Asís</strong>.
                </p>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '20px' 
            }}>
                {/* TARJETA 1: STOCK CRÍTICO */}
                <div style={cardStyle('#e74c3c')}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚠️</div>
                    <h3>Stock Crítico</h3>
                    <p style={{ fontSize: '0.9rem', color: '#ccc', margin: '15px 0' }}>
                        Muestra solo los repuestos cuyo stock es menor o igual al mínimo establecido.
                    </p>
                    <button 
                        onClick={() => descargarPDF('critico')}
                        style={buttonStyle('#e74c3c')}
                    >
                        Descargar PDF
                    </button>
                </div>

                {/* TARJETA 2: INVENTARIO TOTAL */}
                <div style={cardStyle('#2ecc71')}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>📦</div>
                    <h3>Inventario Total</h3>
                    <p style={{ fontSize: '0.9rem', color: '#ccc', margin: '15px 0' }}>
                        Genera un listado completo de todos los productos registrados en el sistema.
                    </p>
                    <button 
                        onClick={() => descargarPDF('general')}
                        style={buttonStyle('#2ecc71')}
                    >
                        Descargar PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

// Estilos rápidos en objetos para no complicarnos con CSS externo ahora
const cardStyle = (color) => ({
    background: '#161b22',
    padding: '25px',
    borderRadius: '15px',
    border: `1px solid ${color}44`,
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
});

const buttonStyle = (color) => ({
    backgroundColor: color,
    color: 'white',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
    marginTop: '10px'
});

export default ReportesPage;
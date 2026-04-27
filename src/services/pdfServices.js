const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generarDocumentoPDF = async (datos, tipo) => {
    console.log("--- [SERVICE] Entrando a generarDocumentoPDF ---");
    
    return new Promise((resolve, reject) => {
        try {
            // 1. Configuración inicial
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `reporte_${Date.now()}.pdf`;
            // Asegúrate de que esta carpeta exista
            const filePath = path.join(__dirname, '../storage/backups', fileName);
            const azulSFA = '#0f0c29'; 

            console.log("--- [SERVICE] Intentando escribir en:", filePath);

            const stream = fs.createWriteStream(filePath);
            
            stream.on('open', () => console.log("--- [SERVICE] Stream abierto correctamente"));
            
            doc.pipe(stream);

            // 2. Lógica de diseño según el tipo
            if (tipo === 'REPORTE' || tipo === 'INVENTARIO_TOTAL') {
    const titulo = tipo === 'INVENTARIO_TOTAL' ? 'REPORTE DE INVENTARIO ACTUAL' : 'REPORTE DE STOCK CRÍTICO';

                doc.fillColor(azulSFA).fontSize(18).text('AUTOMOTRIZ SAN FRANCISCO DE ASÍS', { align: 'center' });
                doc.fontSize(14).fillColor('black').text('REPORTE DE CONTROL INTERNO', { align: 'center' }).moveDown();
                doc.fontSize(14).fillColor('black').text(titulo, { align: 'center' }).moveDown();
    // ... resto del código de la tabla igual ...!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                doc.fontSize(10).text(`Generado el: ${new Date().toLocaleString()}`).moveDown();
                
                const tableTop = doc.y;
                
                // Cabecera de la tabla
                doc.rect(50, tableTop, 500, 20).fill(azulSFA);
                doc.fillColor('white')
                   .text('PRODUCTO', 60, tableTop + 5)
                   .text('STOCK', 300, tableTop + 5)
                   .text('ESTADO', 450, tableTop + 5);
                
                let y = tableTop + 25;
                
                // 3. Renderizado de datos
                if (datos.data && datos.data.length > 0) {
                    datos.data.forEach(item => {
                        // Salto de página automático si se acaba el espacio
                        if (y > 750) {
                            doc.addPage();
                            y = 50; 
                        }

                        doc.fillColor('black').fontSize(9).text(item.nombre || 'Sin nombre', 60, y, { width: 230 });
                        doc.text(item.stock?.toString() || '0', 300, y);
                        
                        const status = (item.stock <= (item.stockMinimo || 0)) ? 'CRÍTICO' : 'OK';
                        doc.fillColor(status === 'CRÍTICO' ? 'red' : 'green').text(status, 450, y);
                        
                        y += 20; // Espaciado entre filas
                    });
                } else {
                    doc.fillColor('black').text('No se encontraron repuestos con stock bajo.', 60, y);
                }
            } else {
                // Caso por defecto por si acaso
                doc.text("PRUEBA DE REPORTE - AUTOMOTRIZ");
            }

            // 4. Finalización
            doc.end();

            stream.on('finish', () => {
                console.log("--- [SERVICE] Escritura de archivo terminada");
                resolve(filePath);
            });

            stream.on('error', (err) => {
                console.error("--- [SERVICE] Error en el Stream:", err);
                reject(err);
            });

        } catch (err) {
            console.error("--- [SERVICE] Error síncrono en servicio:", err);
            reject(err);
        }
    });
};

module.exports = { generarDocumentoPDF };
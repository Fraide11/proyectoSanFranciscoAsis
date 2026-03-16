const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generarFacturaPDF = (venta) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const fileName = `factura_${venta._id}.pdf`;
        const filePath = path.join(__dirname, '../storage/pdfs', fileName);

        // Crear el archivo físico
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // --- CABECERA ---
        doc.fontSize(20).text('AUTO-REPUESTOS SAN FRANCISCO DE ASÍS', { align: 'center' });
        doc.fontSize(10).text('Ciudad Bolívar, Venezuela', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Factura Nro: ${venta._id}`, { align: 'right' });
        doc.text(`Fecha: ${new Date(venta.fecha).toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        // --- DATOS DEL CLIENTE ---
        doc.text(`Cliente: ${venta.cliente.nombre}`);
        doc.text(`Cédula/RIF: ${venta.cliente.cedulaRif || 'N/A'}`);
        doc.moveDown();

        // --- TABLA DE PRODUCTOS ---
        doc.text('------------------------------------------------------------');
        doc.text('Cant. | Descripción | Precio Unit. | Subtotal');
        doc.text('------------------------------------------------------------');

        venta.items.forEach(item => {
            const subtotal = item.cantidad * item.precioUnitario;
            doc.text(`${item.cantidad} x ${item.nombreCapturado} - $${item.precioUnitario} = $${subtotal}`);
        });

        doc.text('------------------------------------------------------------');
        doc.fontSize(14).text(`TOTAL A PAGAR: $${venta.total}`, { align: 'right' });

        // Finalizar el PDF
        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', (err) => reject(err));
    });
};

module.exports = { generarFacturaPDF };
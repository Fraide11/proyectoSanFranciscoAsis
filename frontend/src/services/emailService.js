const nodemailer = require('nodemailer');

const enviarFacturaEmail = async (usuario, pedido) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: '"Automotriz San Francisco" <tu-correo@gmail.com>',
        to: usuario.email,
        subject: `Factura de Compra #${pedido._id}`,
        html: `
            <h1>¡Gracias por tu compra, ${usuario.nombre}!</h1>
            <p>Hemos recibido tu pago correctamente.</p>
            <h3>Detalle de tu factura:</h3>
            <ul>
                ${pedido.items.map(item => `<li>${item.nombre} x${item.cantidad} - $${item.precioUnitario}</li>`).join('')}
            </ul>
            <p><strong>Total Pagado: Bs. ${pedido.totalBS}</strong></p>
            <p>Puedes retirar tus repuestos en nuestra sede de Ciudad Bolívar.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};
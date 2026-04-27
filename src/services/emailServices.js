const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.enviarCorreoRecuperacion = async (email, nombre, token) => {
    // 1. AQUÍ construimos la URL usando SOLO el token que viene del controller
    // Si el link se duplica, es porque en el controller estás mandando la URL completa en vez del token.
    const urlRecuperacion = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
        from: `"Automotriz San Francisco" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperación de Contraseña - Automotriz San Francisco',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Hola, ${nombre}</h2>
                <p style="color: #555;">Has solicitado restablecer tu contraseña para el sistema.</p>
                <p style="color: #555;">Haz clic en el siguiente botón para continuar:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${urlRecuperacion}" 
                       style="background-color: #007bff; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Restablecer Contraseña
                    </a>
                </div>

                <p style="font-size: 11px; color: #999; text-align: center;">
                    Si el botón no funciona, copia y pega este enlace:<br>
                    <span style="color: #007bff;">${urlRecuperacion}</span>
                </p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 10px; color: #aaa; text-align: center;">© 2026 Automotriz San Francisco de Asís</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Correo enviado a ${email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error al enviar el email:', error.message);
        return { success: false, error: error.message };
    }
};
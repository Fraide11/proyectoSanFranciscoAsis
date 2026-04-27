const axios = require('axios');

const generarBotonPago = async (pedido, usuario) => {
    // Por ahora solo retorna un string vacío o un log para que el controlador no falle
    console.log("Simulando generación de botón de pago...");
    return "https://pagoflash.com/pago-simulado"; 
};

module.exports = { generarBotonPago };
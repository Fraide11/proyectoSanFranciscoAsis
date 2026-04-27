const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Conectado... en el puert 10000 ');
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        process.exit(1);
    }
};

module.exports = { conectarDB };
const Venta = require('../models/venta'); // Asegúrate de que el nombre coincida con tu modelo

exports.obtenerVentasPorDia = async (req, res) => {
    try {
        const estadisticas = await Venta.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
                    totalVentas: { $sum: "$total" },
                    cantidadPedidos: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener estadísticas", error });
    }
};
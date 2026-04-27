import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const obtenerEstadisticas = async () => {
    try {
      const token = localStorage.getItem('token'); 
      
      const response = await fetch('http://localhost:10000/api/ventas/estadisticas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Vital para pasar por el middleware 'proteger'
        }
      });

      // Validamos si la respuesta es correcta (status 200-299)
      if (!response.ok) {
        // Si hay error, leemos el cuerpo como texto para evitar el SyntaxError del JSON
        const errorHTML = await response.text();
        console.error("❌ Error del servidor (posible 404 o 500):", errorHTML);
        return;
      }

      const data = await response.json();

      // Configuramos los datos del gráfico
      setChartData({
        labels: data.map(item => item._id),
        datasets: [
          {
            label: 'Ventas Totales ($)',
            data: data.map(item => item.totalVenta),
            backgroundColor: 'rgba(56, 189, 248, 0.6)',
            borderColor: 'rgba(56, 189, 248, 1)',
            borderWidth: 1,
          },
        ],
      });
      
      console.log("✅ Datos cargados correctamente");

    } catch (error) {
      console.error("❌ Error fatal cargando estadísticas:", error);
    }
  };

  useEffect(() => {
    obtenerEstadisticas();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Rendimiento de Ventas Diarias' },
    },
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px' }}>
      <h2 style={{ textAlign: 'center' }}>Ventas Diarias - Automotriz San Francisco de Asís</h2>
      {chartData.labels.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p style={{ textAlign: 'center' }}>Esperando datos del servidor...</p>
      )}
    </div>
  );
};

export default SalesChart;
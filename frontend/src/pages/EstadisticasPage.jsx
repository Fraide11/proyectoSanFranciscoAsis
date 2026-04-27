import React from 'react';
import SalesChart from '../components/SalesChart';

const EstadisticasPage = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Panel de Inteligencia de Negocios</h1>
        <p style={styles.subtitle}>Automotriz San Francisco de Asís - Análisis en Tiempo Real</p>
      </header>

      <section style={styles.chartCard}>
        <SalesChart />
      </section>

      <div style={styles.gridMini}>
        <div style={{ ...styles.miniCard, borderLeft: '5px solid #007bff' }}>
          <h4>Ventas Totales</h4>
          <p>Esperando datos...</p>
        </div>
        <div style={{ ...styles.miniCard, borderLeft: '5px solid #28a745' }}>
          <h4>Repuestos Vendidos</h4>
          <p>Esperando datos...</p>
        </div>
      </div>
    </div>
  );
};

// --- CSS en el mismo archivo ---
const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    color: '#fff' // Para que resalte en tu layout oscuro
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '5px'
  },
  subtitle: {
    opacity: 0.8,
    fontSize: '1rem'
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    marginBottom: '30px'
  },
  gridMini: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  miniCard: {
    backgroundColor: '#1e1e2d',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  }
};

export default EstadisticasPage;
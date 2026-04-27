import React, { useEffect, useState } from 'react';
import { getHistorialCompleto } from '../services/logService';

const HistorialCambios = () => {
    const [logs, setLogs] = useState([]);
    const token = localStorage.getItem('token'); // O donde guardes tu JWT

    useEffect(() => {
        const fetchLogs = async () => {
            const data = await getHistorialCompleto(token);
            setLogs(data);
        };
        fetchLogs();
    }, []);

    return (
        <div className="container mt-4">
            <h2><i className="bi bi-clock-history"></i> Historial de Modificaciones</h2>
            <table className="table table-dark table-hover mt-3">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th>Repuesto</th>
                        <th>Cambios (Campo: Antes → Ahora)</th>
                    </tr>
                </thead>
                <tbody>
  {logs.map((log) => (
    <tr key={log._id}>
      <td>{new Date(log.fecha).toLocaleString()}</td>
      <td>{log.usuarioId ? `${log.usuarioId.nombre} ${log.usuarioId.apellido}` : 'Sistema'}</td>
      <td>
        <strong>{log.repuestoId?.nombre || 'N/A'}</strong><br />
        <small className="text-muted">{log.repuestoId?.codigo || ''}</small>
      </td>
      <td>
        {log.cambios && log.cambios.map((c, index) => (
          <div key={index} className="mb-1" style={{ fontSize: '0.85rem' }}>
            <span className="badge bg-info text-dark" style={{ marginRight: '5px' }}>{c.campo}</span>
            <span className="text-danger">{c.valorAnterior}</span>
            <span className="mx-2">→</span>
            <span className="text-success">{c.valorNuevo}</span>
          </div>
        ))}
      </td>
    </tr>
  ))}
</tbody>
            </table>
        </div>
    );
};

export default HistorialCambios;
import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); // Obtenemos el rol del login
    const [view, setView] = useState('inventory'); // Vista actual

    return (
        <div className="admin-container">
            <aside className="sidebar">
                <h2>Panel {user.rol === 'admin' ? 'Administrador' : 'Trabajador'}</h2>
                <button onClick={() => setView('inventory')}>Inventario</button>
                <button onClick={() => setView('sales')}>Ventas</button>
                
                {/* ESTO SOLO LO VE EL ADMIN */}
                {user.rol === 'admin' && (
                    <button onClick={() => setView('workers')} className="btn-admin">
                        Gestionar Trabajadores
                    </button>
                )}
            </aside>

            <main className="content">
                {view === 'inventory' && <InventoryComponent />}
                {view === 'sales' && <SalesComponent />}
                
                {/* VISTA PRIVADA DE ADMIN */}
                {view === 'workers' && user.rol === 'admin' && (
                    <WorkerManagement />
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
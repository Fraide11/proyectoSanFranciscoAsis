import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

// Contextos
import { AuthContext } from './context/AuthContext';
import { CartContext } from './context/CartContext';

// Servicios y Componentes
import { getRepuestos } from './services/repuestoService';
import AdminLayout from './admin/AdminLayout';
import AdminPanel from './admin/AdminPanel'; 
import WorkerManagement from './admin/WorkerManagement';
import VentasPage from './admin/VentasPage';
import ReportesPage from './admin/ReportesPage';
import EstadisticasPage from './pages/EstadisticasPage'; // Asegúrate de que el nombre coincida
import Navbar from './components/Navbar'; 
import Checkout from './pages/Checkout'; // Importación de la pasarela de pago
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword'

import MisCompras from './pages/MisCompras';

// delivery
import DeliveryPage from './admin/DeliveryPage';

// Trabajadores
import WorkerLayout from './worker/WorkerLayout'; 
// Añade estos debajo de WorkerLayout
import WorkerDashboard from './worker/WorkerDashboard'; 
import InventarioView from './worker/InventarioView'; 
import VentasDiarias from './worker/VentasDiarias';
import Register from './pages/Register';
import Catalogo from './pages/Catalogo'; 
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoutes';

import HistorialCambios from './components/HistorialCambios';

// IMPORTACIÓN DEL CHAT
import ChatContainer from './chat-ia/chatContainer'; 

// --- COMPONENTE PARA QUE NO EXPLOTE EL USELOCATION ---
const NavigationWatcher = ({ setIsChatOpen }) => {
  const location = useLocation();
  useEffect(() => {
    // Esto se ejecuta cada vez que cambias de ruta
    console.log("Ruta actual:", location.pathname);
    setIsChatOpen(false); 
  }, [location.pathname, setIsChatOpen]);
  return null;
};

function App() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [repuestos, setRepuestos] = useState([]);
  
  // Estado para controlar la visibilidad del chat
  const [isChatOpen, setIsChatOpen] = useState(false);

  const cargarDatos = async () => {
    try {
      const data = await getRepuestos();
      const listaLimpia = Array.isArray(data) ? data : (data.productos || []);
      setRepuestos(listaLimpia);
    } catch (err) {
      console.error("Error cargando API:", err);
      setRepuestos([]);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (authLoading) return <div style={{color: 'white', textAlign: 'center', marginTop: '20%'}}>Cargando San Francisco...</div>;

  return (
    <Router>
      <NavigationWatcher setIsChatOpen={setIsChatOpen} />

      <div style={{ backgroundColor: '#0f0c29', minHeight: '100vh', color: 'white', position: 'relative' }}>
        
        <main style={{ padding: '20px' }}>
          
          <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route 
              path="/forgot-password" 
              element={
                <>
                  <Navbar user={user} cartCount={cartCount} />
                  <ForgotPassword />
                </>
              } 
            />
            <Route 
              path="/reset-password/:token" 
              element={
                <>
                  <Navbar user={user} cartCount={cartCount} />
                  <ResetPassword />
                </>
              } 
            />

            <Route 
              path="/" 
              element={
                <>
                  <Navbar user={user} cartCount={cartCount} />
                  <Catalogo items={repuestos} />
                </>
              } 
            />

            {/* ✅ RUTA DE CHECKOUT AÑADIDA Y OPTIMIZADA */}
            <Route path="/checkout" 
              element={
                <>
                  <Navbar user={user} cartCount={cartCount} />
                  <Checkout />
                </>
              } 
            />

            {/* RUTA PROTEGIDA: Mis Compras */}
            <Route 
              path="/mis-compras" 
              element={
                <ProtectedRoute>
                  <Navbar user={user} cartCount={cartCount} />
                  <MisCompras />
                </ProtectedRoute>
              } 
            />

            <Route path="/login" element={<Login />} />

            <Route 
              path="/register" 
              element={
                <>
                  <Navbar user={user} cartCount={cartCount} />
                  <Register />
                </>
              } 
            />

            {/* --- SECCIÓN ADMINISTRATIVA ANIDADA --- */}
           {/* --- SECCIÓN ADMINISTRATIVA ANIDADA --- */}
<Route path="/admin" element={<ProtectedRoute roleRequired={['admin']}><AdminLayout /></ProtectedRoute>}>
  <Route index element={<AdminPanel />} />
  <Route path="reportes" element={<ReportesPage />} />
  <Route path="ventas" element={<VentasPage />} />
  <Route path="workers" element={<WorkerManagement />} />
  <Route path="delivery" element={<DeliveryPage />} />
  <Route path="estadisticas" element={<EstadisticasPage />} />
  <Route path="historial-cambios" element={<HistorialCambios />} />
</Route>

            {/* --- SECCIÓN OPERATIVA (LIBRE) --- */}
            <Route path="/worker" element={<WorkerLayout />}>
              {/* Esta es la pantalla principal con los botones */}
              <Route index element={<WorkerDashboard />} /> 
              {/* Esta cargará lo mismo que el admin en ventas */}
              <Route path="ventas" element={<VentasPage />} />
              {/* Esta cargará el inventario usando tu componente Catalogo */}
              <Route path="inventario" element={<InventarioView />} />
            </Route>

            {/* REDIRECCIÓN POR DEFECTO SI LA RUTA NO EXISTE */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        </main>

        {/* --- LÓGICA DE LA VENTANA DE CHAT --- */}
        {isChatOpen && (
          <div style={{
            position: 'fixed', bottom: '100px', left: '30px', zIndex: 2000,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)', borderRadius: '15px',
            overflow: 'hidden', border: '1px solid #00d4ff'
          }}>
            <ChatContainer />
          </div>
        )}

        {/* --- BOTONES FLOTANTES --- */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          style={{
            position: 'fixed', bottom: '30px', left: '30px',
            width: '60px', height: '60px', borderRadius: '50%',
            backgroundColor: isChatOpen ? '#ff4d4d' : '#00d4ff',
            color: '#0f0c29', border: 'none', fontSize: '30px', cursor: 'pointer', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease'
          }}
        >
          {isChatOpen ? '✕' : '🤖'}
        </button>

        <a 
          href="https://wa.me/numero_aqui" 
          target="_blank" rel="noopener noreferrer"
          style={{
            position: 'fixed', bottom: '30px', right: '30px',
            width: '60px', height: '60px', borderRadius: '50%',
            backgroundColor: '#25d366', color: 'white', border: 'none',
            fontSize: '30px', cursor: 'pointer', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'
          }}
        >
          📱
        </a>

      </div>
    </Router>
  );
}

export default App;
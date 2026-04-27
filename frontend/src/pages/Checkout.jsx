import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  // 1. Datos del Contexto
  const { cart, total, clearCart, tasaCambio } = useContext(CartContext);
  const cartItems = cart || [];
  const navigate = useNavigate();

  // 2. Cálculos de Tasa y Totales
  const totalUSD = Number(total) || 0;
  const tasaFinal = Number(tasaCambio) || 36.50; 
  const totalBS = (totalUSD * tasaFinal).toFixed(2);

  // 3. Estados del Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
    bancoOrigen: '',
    referencia: '',
    direccion: '', 
    puntoReferencia: ''
  });

  const [ubicacion, setUbicacion] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Lógica de Geolocalización
  const obtenerUbicacionActual = () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const coords = `${position.coords.latitude},${position.coords.longitude}`;
            setUbicacion(coords);
            alert("📍 Ubicación capturada con éxito");
        }, (error) => {
            console.error("Error al obtener ubicación", error);
            alert("No pudimos obtener tu ubicación exacta, usaremos la dirección escrita.");
        });
    }
  };

  // 5. Envío del Pedido (La funcionalidad que rescatamos)
  const enviarPedido = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("El carrito está vacío");

    setCargando(true);

    const pedidoFull = {
      items: cartItems.map(i => ({ 
          repuesto: i._id, 
          nombre: i.nombre, 
          cantidad: i.cantidad,
          precioUnitario: i.precioVenta 
      })),
      tasaCambio: tasaFinal, 
      total: Number(totalUSD),
      totalBS: Number(totalBS),
      pago: {
          referencia: formData.referencia, 
          bancoOrigen: formData.bancoOrigen 
      },
      cliente: { 
          nombre: formData.nombre, 
          cedula: formData.cedula,
          email: formData.email, 
          telefono: formData.telefono,
          direccion: formData.direccion,
          puntoReferencia: formData.puntoReferencia
      },
      metodoPago: "Pago Móvil",
      ubicacion: ubicacion
    };

    try {
      // Petición limpia (sin 401 Unauthorized)
      const res = await axios.post('http://localhost:10000/api/pedidos', pedidoFull);
      
      alert("¡Pedido enviado con éxito a San Francisco de Asís!");
      clearCart();
      localStorage.removeItem('cart_san_francisco'); 
      navigate('/resumen-pedido', { state: { pedido: res.data } });

    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Error al procesar: " + (err.response?.data?.msg || "Error de conexión"));
    } finally {
      setCargando(false);
    }
  };

  const manejarSalida = () => {
    clearCart(); 
    localStorage.removeItem('cart_san_francisco'); 
    navigate('/');
  };


  // ESTILOS
  const inputStyle = { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white' };
  const btnStyle = { width: '100%', padding: '15px', marginTop: '10px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* FORMULARIO */}
        <div style={{ flex: 1, minWidth: '320px', background: '#1e293b', padding: '25px', borderRadius: '12px' }}>
          <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>Datos de Entrega y Pago</h2>
          
          <form onSubmit={enviarPedido}>
            <input required name="nombre" placeholder="Nombre y Apellido" onChange={handleChange} style={inputStyle} />
            <div style={{ display: 'flex', gap: '10px' }}>
                <input required name="cedula" placeholder="V-12345678" onChange={handleChange} style={inputStyle} />
                <input required name="telefono" placeholder="Teléfono" onChange={handleChange} style={inputStyle} />
            </div>
            <input required name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} style={inputStyle} />
            
            <div style={{ margin: '15px 0', border: '1px dashed #334155', padding: '15px', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '10px' }}>Logística de Envío</p>
                <input required name="direccion" placeholder="Dirección exacta de entrega" onChange={handleChange} style={inputStyle} />
                <input name="puntoReferencia" placeholder="Punto de referencia (opcional)" onChange={handleChange} style={inputStyle} />
                
                <button type="button" onClick={obtenerUbicacionActual} 
                    style={{ ...btnStyle, backgroundColor: ubicacion ? '#059669' : '#10b981', color: 'white' }}>
                    {ubicacion ? "✅ UBICACIÓN CAPTURADA" : "📍 CAPTURAR UBICACIÓN GPS"}
                </button>
            </div>

            <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                <p style={{ textAlign: 'center', fontSize: '13px', color: '#38bdf8' }}>Pago Móvil (Banesco)</p>
                <select required name="bancoOrigen" onChange={handleChange} style={inputStyle}>
                    <option value="">¿Desde qué banco pagaste?</option>
                    <option value="Banesco">Banesco</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Mercantil">Mercantil</option>
                    <option value="Provincial">Provincial</option>
                </select>
                <input required name="referencia" placeholder="Número de Referencia" onChange={handleChange} style={inputStyle} />
            </div>

            <button type="submit" disabled={cargando} 
                style={{ ...btnStyle, backgroundColor: '#38bdf8', color: '#0f172a' }}>
                {cargando ? "PROCESANDO..." : `REPORTAR PAGO (${totalBS} Bs)`}
            </button>
          </form>

          <button onClick={manejarSalida} style={{ ...btnStyle, backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', marginTop: '20px' }}>
            ❌ CANCELAR Y SALIR
          </button>
        </div>

        {/* RESUMEN LATERAL */}
        <div style={{ width: '320px', background: '#1e293b', padding: '25px', borderRadius: '12px', height: 'fit-content' }}>
          <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Resumen</h3>
          <div style={{ margin: '15px 0' }}>
              {cartItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>{item.cantidad}x {item.nombre}</span>
                  <span style={{ fontWeight: 'bold' }}>${(item.precioVenta * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
          </div>
          <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #38bdf8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span style={{ color: '#38bdf8' }}>${totalUSD.toFixed(2)}</span>
            </div>
            <p style={{ textAlign: 'right', color: '#94a3b8', fontSize: '14px' }}>Tasa: {tasaFinal} Bs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
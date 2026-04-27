// src/pages/Comprar.jsx
const [datosCliente, setDatosCliente] = useState({
  nombre: '',
  correo: '',
  telefono: '',
  referenciaPago: ''
});

const finalizarVenta = async () => {
  const pedidoFinal = {
    cliente: datosCliente,
    items: cartItems, // Lo que trae del Context
    total: totalUSD
  };
  
  // Enviamos todo al backend de una vez
  await axios.post('/api/pedidos/invitado', pedidoFinal);
  alert("¡Gracias por su compra!");
};
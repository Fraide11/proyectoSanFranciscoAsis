# 🏎️ Sistema ERP - Auto-Repuestos San Francisco de Asís

Sistema integral de gestión de inventario, ventas y administración para la venta de autopartes. Desarrollado con el **Stack MEN** (MongoDB, Express, Node.js).

## 📌 Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Módulos del Sistema](#módulos-del-sistema)
4. [Niveles de Usuario](#niveles-de-usuario)
5. [Requisitos Técnicos](#requisitos-técnicos)
6. [Instalación](#instalación)

---

## 📖 Descripción General
Este software permite el control total de una tienda de repuestos, facilitando el manejo de stock por marcas de vehículos, la facturación rápida y la generación de reportes legales en PDF/Word. Incluye un sistema de respaldo de datos para garantizar la continuidad del negocio.

## 📂 Estructura del Proyecto (MVC)
```text
src/
├── config/      # Conexiones y variables globales
├── controllers/ # Lógica de los 10 módulos
├── models/      # Esquemas de MongoDB (Mongoose)
├── routes/      # Endpoints de la API
├── middleware/  # Seguridad y control de roles
├── services/    # Generación de PDF/Word y Backups
└── utils/       # Validadores y manejadores de errores



🛠️ Módulos del Sistema
El sistema consta de 10 módulos integrados:

Seguridad y Acceso: Login, registro y recuperación de contraseña.

Inventario Pro: Gestión de piezas por código, marca, modelo de auto y año.

Ventas y Facturación: Proceso de cobro con cálculo de impuestos.

Clientes: Directorio de compradores y crédito.

Proveedores: Gestión de compras y cuentas por pagar.

Reportes: Emisión de facturas y reportes de stock en PDF/Word.

Caja Chica: Registro de ingresos y egresos diarios.

Auditoría: Historial de movimientos críticos por usuario.

Backup y Restauración: Copias de seguridad de la base de datos.

Catálogo Público: Vista para clientes sin registro.


👥 Niveles de Usuario (Roles)
Administrador: Acceso total (Gestión de usuarios, auditoría y backups).

Vendedor: Gestión de ventas, inventario y reportes. No puede eliminar registros.

Cliente: Consulta de precios y disponibilidad de repuestos.

🚀 Instalación y Uso
Requisitos Mínimos
Node.js (v18 o superior)

MongoDB (Local o Atlas)

Navegador moderno

PROYECTO_AUTOMOTRIZ/
├── frontend/
│   ├── public/
│   │   ├── img/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── AdminStyles.css
│   │   │   ├── login.jsx
│   │   │   ├── ReportesPage.jsx
│   │   │   ├── VentasPage.css
│   │   │   ├── VentasPage.jsx
│   │   │   └── WorkerManager.jsx
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── chat-ia/
│   │   │   ├── chatContainer.jsx
│   │   │   ├── chatMessage.jsx
│   │   │   └── chatService.js
│   │   ├── components/
│   │   │   ├── CartItem.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProtectedRoutes.jsx
│   │   │   └── SalesChart.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── PedidoContext.js
│   │   ├── pages/
│   │   │   ├── Catalogo.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Comprar.jsx
│   │   │   ├── EstadisticasPage.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MisCompras.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── emailService.js
│   │   │   ├── imageServices.js
│   │   │   ├── pagoFlashService.js
│   │   │   ├── pdfService.js
│   │   │   ├── pedidoService.js
│   │   │   └── repuestoService.js
│   │   ├── worker/
│   │   │   ├── InventarioView.jsx
│   │   │   ├── VentasDiarias.jsx
│   │   │   ├── WorkerDashboard.jsx
│   │   │   ├── WorkerLayout.jsx
│   │   │   └── WorkerStyles.css
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── PublicLayout.js
│   │   └── Tienda.jsx
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
├── backend/ (Raíz secundaria/src)
│   ├── config/
│   │   ├── constants.js
│   │   ├── db.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├──auditoriaController.js
│   │   ├──authController.js
│   │   ├──backupController.js
│   │   ├──chatController.js
│   │   ├──estadisticasController.js
│   │   ├──inventarioController.js
│   │   ├──pedidoController.js
│   │   ├──reportesController.js
│   │   ├──repuestosController.js
│   │   └── ventasController.js
│   ├── middleware/
│   │   ├──auditoria.js
│   │   ├──pedido.js
│   │   ├──proveedor.js
│   │   ├──repuestos.js
│   │   ├──usuario.js
│   │   ├──
│   │   ├──
│   │   ├──
│   │   ├──
│   │   └──venta.js

│   ├── models/
│   │   ├── auditoria.js
│   │   ├── pedido.js
│   │   ├── proveedor.js
│   │   ├── repuesto.js
│   │   ├── usuario.js
│   │   └── venta.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── chatRoutes.js
│   │   ├── estadisticas.routes.js
│   │   ├── pedidoRoutes.js
│   │   ├── repuestos.routes.js
│   │   ├── ventas.routes.js
│   │   └── worker.routes.js
│   ├── services/
│   │   ├── auditoriaService.js
│   │   ├── emailServices.js
│   │   ├── pdfServices.js
│   │   └── repuestoService.js
│   ├── storage/
│   │   └── backups/ (JSON backups & PDF Reports)
│   ├── utils/
│   │   ├── errorHandler.js
│   │   └── validators.js
│   ├── server.js
│   ├── seedAdmin.js
│   ├── avance.md
│   ├── package.json
│   └── vercel.json








ventas page:

<thead>
                            <tr>
                                <th>Orden</th>
                                <th>Cliente</th>
                                <th>Monto</th>
                                <th>Referencia</th>
                                <th style={{textAlign: 'center'}}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map((p) => (
                                <tr key={p._id}>
                                    <td data-label="Orden"><span className="order-number">{p.nroOrden}</span></td>
    <td data-label="Cliente">
        <div style={{fontWeight: 'bold'}}>{p.cliente?.nombre}</div>
    </td>
    <td data-label="Monto">
        <div className="price-tag">${p.totalUSD}</div>
    </td>
    <td data-label="Referencia">
        {p.pago?.referencia || 'SIN REF'}
    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <select
                                            value={p.estado || 'Pendiente'}
                                            onChange={(e) => actualizarEstadoPedido(p._id, e.target.value)}
                                            className={`status-select ${
                                                p.estado === 'Pagado' ? 'bg-pagado' : 
                                                p.estado === 'Cancelado' ? 'bg-cancelado' : 'bg-pendiente'
                                            }`}
                                        >
                                            <option value="Pendiente">PENDIENTE</option>
                                            <option value="Pagado">PAGADO</option>
                                            <option value="Cancelado">CANCELADO</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>






                        version 2
    

                    <thead>
    <tr>
        <th>Orden</th>
        <th>Cliente</th>
        <th>Productos</th>
        <th>Monto</th>
        <th>Referencia</th>
        <th style={{textAlign: 'center'}}>Estado</th>
        <th style={{textAlign: 'center'}}>Acciones</th> {/* Columna para botones */}
    </tr>
</thead>
<tbody>
    {pedidos.map((p) => (
        <tr key={p._id}>
            <td data-label="Orden"><span className="order-number">{p.nroOrden}</span></td>
            <td data-label="Cliente">
                <div style={{fontWeight: 'bold'}}>{p.cliente?.nombre}</div>
            </td>
            <td data-label="Productos">
                <div className="items-list-container">
                    {p.items?.map((item, idx) => (
                        <div key={idx} className="item-row">
                           <span><b style={{color: '#3b82f6'}}>{item.cantidad}x</b> {item.nombre}</span>
                        </div>
                    )) || 'Sin productos'}
                </div>
            </td>
            <td data-label="Monto"><div className="price-tag">${p.totalUSD}</div></td>
            <td data-label="Referencia">{p.pago?.referencia || 'SIN REF'}</td>
            <td data-label="Estado" style={{ textAlign: 'center' }}>
                <select
                    value={p.estado || 'Pendiente'}
                    onChange={(e) => actualizarEstadoPedido(p._id, e.target.value)}
                    className={`status-select ${p.estado === 'Pagado' ? 'bg-pagado' : p.estado === 'Cancelado' ? 'bg-cancelado' : 'bg-pendiente'}`}
                >
                    <option value="Pendiente">PENDIENTE</option>
                    <option value="Pagado">PAGADO</option>
                    <option value="Cancelado">CANCELADO</option>
                </select>
            </td>
            <td data-label="Acciones" style={{ textAlign: 'center' }}>
                <div style={{display: 'flex', gap: '5px', justifyContent: 'center'}}>
                    <button className="btn-delete-order" onClick={() => eliminarPedido(p._id)}>
                        Eliminar
                    </button>
                </div>
            </td>
        </tr>
    ))}
</tbody>



¡Qué buen ecosistema de base de datos estás montando para San Francisco de Asís! El hecho de tener ya 8 colecciones muestra que el sistema tiene una arquitectura sólida.Para esas colecciones que tienes vacías, aquí te doy una ruta lógica para que cobren vida dentro de tu flujo de trabajo:1. Compradeclientes (Fidelización)Esta colección es clave para que el cliente no sea solo un número. Al asociarla por correo y usuario, puedes generar un "Historial de Lealtad".Qué guardar: ID del usuario, array de IDs de pedidos completados, fecha de la última compra y total gastado.Utilidad: En el futuro, podrías hacer que el sistema le dé un descuento automático al cliente que tenga más de, por ejemplo, 10 compras registradas aquí.2. Delivery (Logística)Aunque no sepas qué hacer con ella aún, en una venta de repuestos es vital. Piénsala como el puente entre la venta y que el cliente reciba su tornillo o estefano.Propuesta de uso: Úsala para rastrear el estado del envío.Campos sugeridos: pedidoId, direccionEnvio, metodoEnvio (si es motorizado propio o agencia), costoEnvio y estadoEnvio (En preparación / En camino / Entregado).Ventaja: Te permite separar la "Venta" (dinero) del "Delivery" (movimiento físico).3. Facturación (Automatización)Como mencionaste, esto se dispara tras la verificación del admin. Para que sea eficiente:El proceso: Cuando el admin cambia el estado a "PAGADO", un trigger o función en tu backend debería:Generar un número de factura correlativo.Guardar en esta colección los datos fiscales (RIF/Cédula, dirección, desglose de IVA).Llamar a tu servicio de correo (como Nodemailer) para enviar el PDF al cliente.Dato importante: Mantener las facturas en una colección propia (y no solo dentro de 'ventas') te ayuda muchísimo para los reportes de contabilidad al final del mes.Estructura de ColeccionesColecciónEstado ActualAcción SugeridacompradeclientesVacíaVincular historial por email para analítica de clientes.deliveryVacíaGestionar direcciones y estados de despacho.facturacionVacíaAlmacenar registros legales post-verificación de pago.Tienes las piezas sobre la mesa. Ahora que ya eliminamos lo naranja del CSS y tienes el servidor volando, lo siguiente es conectar el botón de "Eliminar" en la tabla con la lógica de estas colecciones para que, por ejemplo, si borras un pedido, también se limpie (o se cancele) su entrada en delivery.Talking to the moon... ¿Te gustaría que armemos el esquema de campos (el Schema de Mongoose) para la colección de Delivery de una vez?


























1. notificaciones (El motor de feedback)
Con deliveries y pedidos, necesitas algo que conecte esos eventos con el usuario o el administrador en tiempo real.

Por qué es clave: Te permite manejar un historial de alertas (ej. "Tu repuesto ya salió", "Stock bajo en bujías"). Si algún día implementas WebSockets (Socket.io), esta colección será tu mejor amiga.

Campos sugeridos:

user_id: (Referencia a usuarios)

type: (String: 'pedido_status', 'stock_alert', 'pago_confirmado')

message: (String)

is_read: (Boolean)

metadata: (Object: para guardar el ID del pedido o venta relacionado)

2. carrito o wishlist (Persistencia de sesión)
Muchos desarrolladores cometen el error de dejar el carrito solo en el LocalStorage del navegador. Si el usuario cambia de PC o de celular, pierde sus repuestos seleccionados.

Por qué es clave: Permite que la experiencia de compra sea continua. Además, te da datos valiosos: puedes saber qué repuestos la gente mete al carrito pero no termina comprando (análisis de abandono).

Campos sugeridos:

user_id: (ObjectId)

items: [
{ repuesto_id: ObjectId, cantidad: Number }
]

last_updated: (Date)

Una alternativa más "técnica": tasa_cambio
Dado que estás manejando facturacion y ventas, y considerando el contexto económico donde te encuentras, tener una colección separada para el historial de precios del dólar es vital.



La Tasa de Cambio: Es la más sencilla pero la más crítica para tus cálculos de ventas.

El Carrito: Para que tus usuarios puedan empezar a armar sus pedidos.

Notificaciones: Para darle el toque final de interactividad.




















Dale plomo! No queremos que la máquina se apague en plena actualización de la base de datos. Mientras carga, aquí tienes el "Plan de Ataque" para cerrar con broche de oro la Autogestión del Perfil y los detalles finales:

📋 Puntos a Tratar (Fase de Cierre)
1. Blindaje del Backend (El "Muro")
Actualización del Controlador: Crear la función en authController.js que solo acepte cambios en nombre, email y password, ignorando cualquier intento de cambiar el rol.

Lógica de Password: Asegurarnos de que si el usuario escribe una nueva clave, se encripte con bcrypt antes de guardarla.

2. La Interfaz de Usuario (Frontend)
Componente Perfil.jsx: Crear el formulario donde el usuario vea sus datos actuales.

Seguridad Visual: Colocar el campo de "Rol" como Solo Lectura (con un candado o un diseño grisáceo) para dejar claro que no es editable.

Feedback: Implementar un mensaje de "¡Éxito!" cuando los datos se guarden.

3. Integración en el Dashboard
Acceso Rápido: Poner un link de "Mi Perfil" en el Sidebar o en el menú desplegable donde sale el nombre del Admin/Trabajador.

Actualización de Contexto: Hacer que, al cambiar el nombre, este se actualice automáticamente en el Header sin tener que cerrar sesión y volver a entrar.

4. Auditoría de Perfil (Opcional pero recomendado)
Log de Seguridad: ¿Vale la pena registrar cuando un usuario cambia su propia contraseña? (Para saber si alguien "hackeó" la cuenta de un trabajador).

5. Prueba de Intrusión (El "Test del Hacker")
Intentar forzar un cambio de rol desde Postman hacia la ruta de perfil para confirmar que el servidor lo rechaza.

¿Cómo lo ves?
Cuando vuelvas con la batería al 100%, empezamos a picar el código del controlador. Me avisas si quieres que el perfil sea una página completa o si prefieres que sea un Modal que salga por encima de lo que estés haciendo.

¡Tómate tu café, Luna está esperando para seguir dándole al teclado! ☕🤖
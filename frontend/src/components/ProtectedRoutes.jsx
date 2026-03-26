import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roleRequired }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation(); // Guardamos dónde intentaba entrar el usuario

    // 1. Mientras el Contexto verifica el Token en localStorage
    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#00d4ff' }}>
                <p>Verificando credenciales en San Francisco de Asís...</p>
            </div>
        );
    }

    // 2. Si no hay usuario detectado
    if (!user) {
        // 'replace' evita que el usuario pueda volver atrás a la ruta protegida
        // 'state' nos permite redirigirlo de vuelta aquí después de que haga login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Verificación de Rol (RBAC - Role Based Access Control)
    // Permitimos entrar si el rol coincide O si el usuario es 'admin' (el admin entra a todo)
    if (roleRequired && user.rol !== roleRequired && user.rol !== 'admin') {
        console.warn(`Acceso denegado: Se requiere ${roleRequired}, pero el usuario es ${user.rol}`);
        return <Navigate to="/" replace />;
    }

    // 4. Si todo está en orden, mostramos el componente
    return children;
};

export default ProtectedRoute;
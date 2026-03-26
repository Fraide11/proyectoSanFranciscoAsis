import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roleRequired }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>Cargando...</p>;

    // Si no está logueado, al login de una
    if (!user) return <Navigate to="/login" />;

    // Si el rol no coincide con lo que pide la ruta, a la tienda
    if (roleRequired && user.rol !== roleRequired) {
        return <Navigate to="/tienda" />;
    }

    return children;
};

export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;

  if (!usuario) return <Navigate to="/usuario" />;

  if (!allowedRoles.includes(usuario.tipo)) {
    return <Navigate to="/" />;
  }

  return children;
}

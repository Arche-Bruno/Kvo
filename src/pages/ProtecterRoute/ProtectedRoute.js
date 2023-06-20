import { Navigate } from "react-router-dom";
import { UseAuth } from "../../context/authContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = UseAuth();

  if (loading) return <h1>Cargando..</h1>;

  // SI NO ESTA EL OBJETO USER SIGNIFICA QUE NO HAY USUARIO ENTONCES VAMOS A REDIRECCIONANDO

  if (!user) return <Navigate to="/login"></Navigate>;

  // Si tiene la informacion le digo que retorne el children

  return <>{children}</>;
}

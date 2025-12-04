import { useAuth } from "../context/AuthContext";
import FormularioUsuario from "../components/FormularioUsuario";
import ClientePanel from "../components/ClientePanel";
import CarritoUsuario from "../components/CarritoUsuario";
import AdminPanel from "../components/AdminPanel";

export default function Usuario() {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;

  // SI NO ESTÁ LOGUEADO → mostrar login/registro
  if (!usuario) {
    return <FormularioUsuario />;
  }

  // SI ESTÁ LOGUEADO → mostrar su perfil
  return (
    <div className="container my-5">
      <ClientePanel/>
      <CarritoUsuario/>

      {usuario.tipo === "administrador" && (
        <AdminPanel/>
      )}
    </div>
  );
}

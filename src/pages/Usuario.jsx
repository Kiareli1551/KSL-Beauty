import { useAuth } from "../context/AuthContext";
import FormularioUsuario from "../components/FormularioUsuario";
import ClientePanel from "../components/ClientePanel";
import CarritoUsuario from "../components/CarritoUsuario";
import AdminPanel from "../components/AdminPanel";

export default function Usuario() {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;

  if (!usuario) {
    return <FormularioUsuario />;
  }

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


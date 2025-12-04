import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Tienda from "./pages/Tienda";
import Nosotras from "./pages/Nosotras";
import Contacto from "./pages/Contacto";
import Usuario from "./pages/Usuario";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/nosotras" element={<Nosotras />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Página que controla login / perfil / admin */}
        <Route path="/usuario" element={<Usuario />} />

        {/* Área del cliente */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute allowedRoles={["cliente", "administrador"]}>
              <h2>Perfil del Usuario</h2>
            </ProtectedRoute>
          }
        />

        {/* Área del administrador */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["administrador"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

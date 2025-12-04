import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario } = useAuth();
  const role = usuario?.tipo ?? null;

  return (
    <nav className="navbar navbar-expand-lg navbarcustom">
      <div className="container-fluid">
        <Link className="navbar-brand ms-5" to="/">
          <img src="/images/Logo KSL Beauty.png" width="90" height="90" />
          KSL BEAUTY
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-5 me-5">

            <li><NavLink className="nav-link" to="/">INICIO</NavLink></li>
            <li><NavLink className="nav-link" to="/tienda">TIENDA</NavLink></li>
            <li><NavLink className="nav-link" to="/nosotras">NOSOTRAS</NavLink></li>
            <li><NavLink className="nav-link" to="/contacto">CONTACTO</NavLink></li>

            <li className="nav-item">

              {!role && (
                <NavLink className="nav-link" to="/usuario">INICIAR SESIÓN</NavLink>
              )}

              {role === "cliente" && (
                <NavLink className="nav-link" to="/usuario">PERFIL</NavLink>
              )}

              {role === "administrador" && (
                <NavLink className="nav-link" to="/usuario">ADMIN</NavLink>
              )}

            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

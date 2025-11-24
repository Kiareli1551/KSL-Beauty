import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbarcustom">
      <div className="container-fluid">
        <Link className="navbar-brand ms-5" to="/">
          <img
            src="/images/Logo KSL Beauty.png"
            alt="KLS Beauty"
            width="90"
            height="90"
            className="d-inline-block align-text-center"
          />
          KSL BEAUTY
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-5 me-5">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">INICIO</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/tienda">TIENDA</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/nosotras">NOSOTRAS</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contacto">CONTACTO</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

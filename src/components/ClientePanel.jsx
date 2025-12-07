import { useAuth } from "../context/AuthContext";

export default function ClientePanel() {
  const { usuario, logout } = useAuth();

  return (
    <div className="container my-5">
      <div className="col-md-6 mx-auto">

        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">

            <h2 className="text-center mb-3">
              Bienvenido, <strong>{usuario.nombre}</strong>
            </h2>

            <p className="text-center text-muted" id="textN">
              Información de tu perfil
            </p>

            <hr />

            <div className="mb-3">
              <label className="fw-bold">Nombre de usuario:</label>
              <p className="mb-2" id="textN">{usuario.nombre}</p>
            </div>

            <div className="mb-3">
              <label className="fw-bold">Correo:</label>
              <p className="mb-2" id="textN">{usuario.email}</p>
            </div>

            <div className="d-grid mt-4">
              <button
                className="btn btn-danger rounded-pill py-2"
                id="btn-shop"
                onClick={logout}>
                Cerrar sesión
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

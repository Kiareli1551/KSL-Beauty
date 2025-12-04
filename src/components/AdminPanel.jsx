import { useState } from "react";
import AñadirProducto from "./AñadirProducto";
import ModificarProducto from "./ModificarProducto";

export default function AdminPanel() {
  const [tabActiva, setTabActiva] = useState("añadir");

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Panel de Administración</h1>
      
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 col-lg-6">
          <div className="btn-group w-100 shadow-sm" role="group">
            <button
              type="button"
              className={`btn btn-lg ${
                tabActiva === "añadir" 
                  ? "btn-primary" 
                  : "btn-outline-primary"
              }`}
              onClick={() => setTabActiva("añadir")}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Añadir Producto
            </button>
            <button
              type="button"
              className={`btn btn-lg ${
                tabActiva === "modificar" 
                  ? "btn-warning" 
                  : "btn-outline-warning"
              }`}
              onClick={() => setTabActiva("modificar")}
            >
              <i className="bi bi-pencil-square me-2"></i>
              Modificar/Eliminar
            </button>
          </div>
        </div>
      </div>
      
      <div className="row justify-content-center">
        <div className="col-12">
          {tabActiva === "añadir" ? <AñadirProducto /> : <ModificarProducto />}
        </div>
      </div>
    </div>
  );

}

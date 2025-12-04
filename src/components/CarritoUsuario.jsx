import { useEffect, useState } from "react";

export default function CarritoUsuario() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [cantidadTemp, setCantidadTemp] = useState(1);

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    setCargando(true);
    const res = await fetch("http://localhost/ksl-backend/usuario/obtenerCarrito.php", {
      credentials: "include",
    });
    const data = await res.json();
    setProductos(data.productos || []);
    setCargando(false);
  };

  const eliminarProducto = async (idProducto) => {
    const res = await fetch("http://localhost/ksl-backend/usuario/eliminarCarrito.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idProducto }),
    });

    const data = await res.json();
    if (data.ok) cargarCarrito();
  };

  const guardarCambio = async (idProducto) => {
    const res = await fetch("http://localhost/ksl-backend/usuario/modificarCarrito.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idProducto,
        cantidad: cantidadTemp,
      }),
    });

    const data = await res.json();
    if (data.ok) {
      setEditando(null);
      cargarCarrito();
    }
  };

  if (cargando) return <p>Cargando carrito...</p>;

  const totalCompra = productos.reduce(
    (sum, p) => sum + p.precioProducto * p.cantidadUsuarioProducto,
    0
  );

  return (
    <div className="container my-4">

      <h3 className="mb-3">Tu carrito</h3>

      {productos.length === 0 && (
        <div className="alert alert-warning text-center py-4">
          <strong>Aún no se añaden productos</strong>
        </div>
      )}

      {productos.map((p) => (
        <div
          key={p.idProducto}
          className="d-flex align-items-center border rounded p-2 mb-2"
          style={{ background: "#fafafa" }}
        >
          <img
            src={p.imagenProducto || "/images/Imagen_no_disponible.png"}
            alt={p.nombreProducto}
            style={{
              width: "70px",
              height: "70px",
              objectFit: "contain",
              marginRight: "15px",
            }}
          />

          <div className="flex-grow-1">
            <h6 className="m-0">{p.nombreProducto}</h6>
            <small className="text-muted">Precio: ${p.precioProducto}</small>
            <br />

            {editando === p.idProducto ? (
              <input
                type="number"
                className="form-control mt-1"
                value={cantidadTemp}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCantidadTemp(val < 1 ? 1 : val);
                }}
                style={{ width: "90px" }}
                min="1"
              />
            ) : (
              <span className="badge bg-dark mt-1">
                Cantidad: {p.cantidadUsuarioProducto}
              </span>
            )}

            <p className="mt-1 fw-bold">
              Total: ${(p.precioProducto * p.cantidadUsuarioProducto).toFixed(2)}
            </p>
          </div>

          <div className="text-end">
            {editando === p.idProducto ? (
              <>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => guardarCambio(p.idProducto)}
                >
                  Guardar
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditando(null)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => {
                    setEditando(p.idProducto);
                    setCantidadTemp(p.cantidadUsuarioProducto);
                  }}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarProducto(p.idProducto)}
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      <div className="mt-4 p-3 border rounded bg-light">
        <h4>Total a pagar: ${totalCompra.toFixed(2)}</h4>

        <button
          className="btn btn-success w-100 mt-3"
          disabled={productos.length === 0}
        >
          Comprar
        </button>
      </div>

    </div>
  );
}


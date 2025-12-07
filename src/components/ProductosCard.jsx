import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProductosCard({ producto }) {
  const { usuario } = useAuth();

  const [cantidad, setCantidad] = useState(1);
  const [imgSrc, setImgSrc] = useState(
    producto.imagenProducto && producto.imagenProducto.trim() !== ""
      ? producto.imagenProducto
      : "/images/Imagen_no_disponible.png"
  );

  const recortarTexto = (texto, max = 100) => {
    if (!texto) return "";
    return texto.length > max ? texto.substring(0, max) + "... ver más" : texto;
  };

  const handleAddToCart = async () => {
    if (!usuario) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    const res = await fetch("http://localhost/ksl-backend/usuario/añadirCarrito.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idProducto: producto.idProducto,
        cantidad: cantidad,
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.mensaje);
      return;
    }

    alert("Producto añadido al carrito.");
  };

  return (
    <div className="col">
      <div className="card h-100 shadow-sm">

        <div
          style={{
            width: "100%",
            height: "250px",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            borderBottom: "1px solid #eee"
          }}
        >
          <img
            src={imgSrc}
            alt={producto.nombreProducto}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
            onError={(e) => {
              if (!e.target.dataset.fallback) {
                e.target.dataset.fallback = "true";
                setImgSrc("/images/Imagen_no_disponible.png");
              }
            }}
          />
        </div>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{producto.nombreProducto}</h5>

          <p className="card-text text-muted" id="textN">
            {recortarTexto(producto.descripcionProducto, 90)}
          </p>

          <p className="card-text small" id="textN">
            <strong>Marca:</strong> {producto.nombreMarca}<br />
            <strong>Categoría:</strong> {producto.nombreCategoria}
          </p>

          <h6 className="mt-auto fw-bold">${producto.precioProducto}</h6>

          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => {
              const valor = Number(e.target.value);
              setCantidad(valor < 1 ? 1 : valor);
            }}
            className="form-control mt-2"
          />

          <button
            className="btn btn-dark w-100 mt-3"
            id="btn-shop"
            onClick={handleAddToCart}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

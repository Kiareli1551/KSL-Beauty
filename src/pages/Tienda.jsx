import { useEffect, useState } from "react";
import ProductosCard from "../components/ProductosCard";

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost/ksl-backend/producto/obtenerProductos.php?pagina=${pagina}`)
      .then((res) => res.json())
      .then((data) => {
        setProductos(data.productos);
        setTotalPaginas(Math.ceil(data.total / data.porPagina));
        setLoading(false);
      });
  }, [pagina]);

  if (loading) return <p className="text-center mt-5">Cargando productos...</p>;

  return (
    <div className="container mt-4">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {productos.map((p) => (<ProductosCard key={p.idProducto} producto={p} />))}
      </div>

      <div className="d-flex justify-content-center mt-4 mb-5">
        <button className="btn btn-outline-dark mx-2"
          disabled={pagina === 1}
          onClick={() => setPagina(pagina - 1)}
        >&laquo; Anterior
        </button>

        <span className="px-3 py-2">Página {pagina} de {totalPaginas}</span>

        <button className="btn btn-outline-dark mx-2"
          disabled={pagina === totalPaginas}
          onClick={() => setPagina(pagina + 1)}
        >Siguiente &raquo;</button>

      </div>
    </div>
  );
}

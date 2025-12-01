import { useEffect, useState } from "react";
import ProductosCard from "../components/ProductosCard";

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=10")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data.products);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-5">Cargando productos...</p>;

  return (
    <div className="tienda-grid">
      <div className="container mt-4">
        <div className="row row-cols-1 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {productos.map((p) => (
            <ProductosCard key={p.id} producto={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

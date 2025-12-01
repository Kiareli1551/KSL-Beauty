export default function ProductosCard({ producto }) {
  return (
    <div className="col">
      <div className="card h-100">
        <img src={producto.thumbnail} className="card-img-top" />

        <div className="card-body">
          <h5 className="card-title text-center">{producto.title}</h5>
          <p className="card-text text-center" style={{fontSize:"20px"}}>${producto.price}</p>
          <p className="text-center">Cantidad disponible: <strong>{producto.stock}</strong></p>
        </div>
        <a href="#" id="btn-carrito" className="btn btn-primary mb-3 mx-3">AÑADIR AL CARRITO</a>
      </div>
    </div>
  );
}

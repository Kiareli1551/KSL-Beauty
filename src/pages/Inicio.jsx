import Hero from "../components/Hero";

export default function Inicio() {
  return (
    <div>
      <Hero />

      <div className="container-fluid mt-4">
        <div className="row align-items-center">

          <div className="col-md-6">
            <p id="text1" className="ms-5 me-5">
              ★ Luminosidad que se nota <br />
              Productos que realzan tu brillo natural sin saturar.
              <br /><br />
              ★ Suavidad que se siente <br />
              Tratamientos hidratantes y nutritivos.
              <br /><br />
              ★ Kosmética inspirada en ti <br />
              Productos seguros para todo tipo de piel.
            </p>
          </div>

          <div className="col-md-6 d-flex gap-3 justify-content-center">
            <img src="/src/images/foto1.jpg" className="img-thumbnail img-style" />
            <img src="/src/images/foto2.jpg" className="img-thumbnail img-style" />
            <img src="/src/images/foto3.jpg" className="img-thumbnail img-style" />
          </div>

        </div>
      </div>

      <div className="text-center mt-4 mb-5">
        <a id="btn-shop" href="/tienda" className="btn btn-lg px-5">SHOP NOW</a>
      </div>
    </div>
  );
}

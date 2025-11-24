import HeroCt from "../components/HeroCt";

export default function Contacto() {
  return (
    <div>
      <HeroCt />

      <div className="container mt-5 mb-5">

        <div className="row justify-content-between">

          <div className="col-md-5">
            <h2 className="fw-bold mb-3">KSL Beauty</h2>
            <p >
              En KSL Beauty creemos en la luminosidad natural,
              el cuidado consciente de la piel y la confianza que nace desde adentro.  
              <br /><br />
              Si tienes preguntas sobre nuestros productos, pedidos, envíos o deseas recibir
              asesoría personalizada para tu tipo de piel, estaremos encantados de ayudarte.
              <br /><br />
              Completa el formulario y nos pondremos en contacto contigo lo antes posible.
            </p>

            <div className="mt-4">
              <h5 className="fw-bold">Información de contacto</h5>
              <p className="mb-1"> contacto@kslbeauty.com</p>
              <p className="mb-1"> +52 656-124-5678</p>
              <p>CD Juárez — Envíos a toda la República Mexicana</p>
            </div>
          </div>

          <div className="col-md-6 mt-4 mt-md-0">
            <form className="p-4 shadow rounded bg-white">

              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribe tu nombre"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="tucorreo@email.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Asunto</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Motivo de tu mensaje"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mensaje </label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>

              <button className="btn btn-dark px-4 w-100">
                Enviar mensaje
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

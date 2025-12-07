import HeroCt from "../components/HeroCt";
import { useState } from "react"; 

export default function Contacto() {
 
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  });
  const [errors, setErrors] = useState({});

  //  onChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  // onBlur (validación)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value.trim() && name !== "asunto") {
      setErrors({...errors, [name]: "Campo requerido"});
    }
  };

  // onClick/onSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado");
  };

  return (
    <div>
      <HeroCt />

      <div className="container mt-5 mb-5">
        <div className="contacto-grid">
          <div className="col-md-5">
            <h2 id="titulos" className="fw-bold mb-3">KSL Beauty</h2>
            <p>
              En KSL Beauty creemos en la luminosidad natural,
              el cuidado consciente de la piel y la confianza que nace desde adentro.  
              <br /><br />
              Si tienes preguntas sobre nuestros productos, pedidos, envíos o deseas recibir
              asesoría personalizada para tu tipo de piel, estaremos encantados de ayudarte.
              <br /><br />
              Completa el formulario y nos pondremos en contacto contigo lo antes posible.
            </p>

            <div className="mt-4">
              <h5 id="titulos" className="fw-bold">Información de contacto</h5>
              <p className="mb-1"> contacto@kslbeauty.com</p>
              <p className="mb-1"> +52 656-124-5678</p>
              <p>CD Juárez — Envíos a toda la República Mexicana</p>
            </div>
          </div>

          <div className="col-md-6 mt-4 mt-md-0">
            {/*onBlur se dispara aquí */}
            <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">

              <div className="mb-3">
                <label id="textN" className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre" 
                  className="form-control"
                  placeholder="Escribe tu nombre"
                  value={formData.nombre} // onChange
                  onChange={handleChange} // onChange
                  onFocus={() => {}} // onFocus (vacío pero existe)
                  onBlur={handleBlur} // onBlur
                />
              </div>

              <div className="mb-3">
                <label id="textN" className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="tucorreo@email.com"
                  value={formData.email}
                  onChange={handleChange} // onChange
                  onFocus={() => {}} // onFocus
                  onBlur={handleBlur} //  onBlur
                />
              </div>

              <div className="mb-3">
                <label id="textN" className="form-label">Asunto</label>
                <input
                  type="text"
                  name="asunto"
                  className="form-control"
                  placeholder="Motivo de tu mensaje"
                  value={formData.asunto}
                  onChange={handleChange} // onChange
                  onFocus={() => {}} // onFocus
                  onBlur={handleBlur} // onBlur
                />
              </div>

              <div className="mb-3">
                <label id="textN" className="form-label">Mensaje</label>
                <textarea
                  name="mensaje"
                  className="form-control"
                  rows="5"
                  placeholder="Escribe tu mensaje aquí..."
                  value={formData.mensaje}
                  onChange={handleChange} // onChange
                  onFocus={() => {}} // onFocus
                  onBlur={handleBlur} //onBlur
                ></textarea>
              </div>

              <button id="btn-shop"
                type="submit"
                className="btn btn-dark px-4 w-100"
                onMouseOver={() => {}} // onMouseover
                onMouseOut={() => {}} //onMouseout
              >
                Enviar mensaje
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
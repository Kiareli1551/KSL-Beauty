import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function FormularioUsuario() {
  const { login } = useAuth();
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  const [formData, setFormData] = useState({
    nombreUsuario: "",
    emailUsuario: "",
    contraseña: "",
    repetirContraseña: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errores[e.target.name]) {
      setErrores(prev => ({
        ...prev,
        [e.target.name]: ""
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (mostrarRegistro) {
      // Validación para registro
      if (!formData.nombreUsuario.trim()) {
        nuevosErrores.nombreUsuario = "El nombre de usuario es obligatorio";
      } else if (formData.nombreUsuario.length < 3) {
        nuevosErrores.nombreUsuario = "El nombre de usuario debe tener al menos 3 caracteres";
      }
      
      if (!formData.emailUsuario.trim()) {
        nuevosErrores.emailUsuario = "El correo electrónico es obligatorio";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailUsuario)) {
        nuevosErrores.emailUsuario = "El correo electrónico no es válido";
      }
      
      if (!formData.contraseña) {
        nuevosErrores.contraseña = "La contraseña es obligatoria";
      } else if (formData.contraseña.length < 6) {
        nuevosErrores.contraseña = "La contraseña debe tener al menos 6 caracteres";
      }
      
      if (!formData.repetirContraseña) {
        nuevosErrores.repetirContraseña = "Debes repetir la contraseña";
      } else if (formData.contraseña !== formData.repetirContraseña) {
        nuevosErrores.repetirContraseña = "Las contraseñas no coinciden";
      }
    } else {
      // Validación para login
      if (!formData.nombreUsuario.trim()) {
        nuevosErrores.nombreUsuario = "El nombre de usuario es obligatorio";
      }
      
      if (!formData.contraseña) {
        nuevosErrores.contraseña = "La contraseña es obligatoria";
      }
    }
    
    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setErrores({});

    const erroresValidacion = validarFormulario();
    
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      setCargando(false);
      return;
    }

    // === LOGIN ===
    if (!mostrarRegistro) {
      const respuesta = await login(formData.nombreUsuario, formData.contraseña);

      if (!respuesta.ok) {
        setErrores({ general: respuesta.mensaje });
        setCargando(false);
        return;
      }

      alert("Inicio de sesión exitoso");
      setCargando(false);
      return;
    }

    // === REGISTRO ===
    if (mostrarRegistro) {
      try {
        const respuesta = await fetch("http://localhost/ksl-backend/usuario/registrarUsuario.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombreUsuario: formData.nombreUsuario,
            emailUsuario: formData.emailUsuario,
            contraseña: formData.contraseña
          })
        });

        const resultado = await respuesta.json();

        if (!resultado.ok) {
          setErrores({ general: resultado.mensaje });
          if (resultado.campo) {
            setErrores(prev => ({ ...prev, [resultado.campo]: resultado.mensaje }));
          }
        } else {
          alert("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
          // Cambiar a modo login y limpiar formulario
          setMostrarRegistro(false);
          setFormData({
            nombreUsuario: "",
            emailUsuario: "",
            contraseña: "",
            repetirContraseña: "",
          });
        }
      } catch (error) {
        setErrores({ general: "Error de conexión con el servidor" });
      }
    }
    
    setCargando(false);
  };

  return (
    <div className="container my-5">
      <div className="col-md-6 mx-auto">

        <button
          className="btn btn-outline-dark w-100 mb-4"
          onClick={() => {
            setMostrarRegistro(!mostrarRegistro);
            setErrores({});
            setFormData({
              nombreUsuario: "",
              emailUsuario: "",
              contraseña: "",
              repetirContraseña: "",
            });
          }}
          disabled={cargando}
        >
          {mostrarRegistro
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Crear una cuenta"}
        </button>

        <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
          <h3 className="text-center mb-4">
            {mostrarRegistro ? "Crear Cuenta" : "Iniciar Sesión"}
          </h3>

          {errores.general && (
            <div className="alert alert-danger" role="alert">
              {errores.general}
            </div>
          )}

          {/* Nombre de usuario */}
          <div className="mb-3">
            <label className="form-label">Nombre de usuario *</label>
            <input
              type="text"
              name="nombreUsuario"
              className={`form-control ${errores.nombreUsuario ? 'is-invalid' : ''}`}
              value={formData.nombreUsuario}
              onChange={handleChange}
              disabled={cargando}
            />
            {errores.nombreUsuario && (
              <div className="invalid-feedback">{errores.nombreUsuario}</div>
            )}
          </div>

          {/* Email: solo en registro */}
          {mostrarRegistro && (
            <div className="mb-3">
              <label className="form-label">Correo electrónico *</label>
              <input
                type="email"
                name="emailUsuario"
                className={`form-control ${errores.emailUsuario ? 'is-invalid' : ''}`}
                value={formData.emailUsuario}
                onChange={handleChange}
                disabled={cargando}
              />
              {errores.emailUsuario && (
                <div className="invalid-feedback">{errores.emailUsuario}</div>
              )}
            </div>
          )}

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label">Contraseña *</label>
            <input
              type="password"
              name="contraseña"
              className={`form-control ${errores.contraseña ? 'is-invalid' : ''}`}
              value={formData.contraseña}
              onChange={handleChange}
              disabled={cargando}
            />
            {errores.contraseña && (
              <div className="invalid-feedback">{errores.contraseña}</div>
            )}
            {mostrarRegistro && (
              <small className="text-muted">Mínimo 6 caracteres</small>
            )}
          </div>

          {/* Repetir contraseña: solo en registro */}
          {mostrarRegistro && (
            <div className="mb-3">
              <label className="form-label">Repetir contraseña *</label>
              <input
                type="password"
                name="repetirContraseña"
                className={`form-control ${errores.repetirContraseña ? 'is-invalid' : ''}`}
                value={formData.repetirContraseña}
                onChange={handleChange}
                disabled={cargando}
              />
              {errores.repetirContraseña && (
                <div className="invalid-feedback">{errores.repetirContraseña}</div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-dark px-4 w-100"
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                {mostrarRegistro ? "Creando cuenta..." : "Iniciando sesión..."}
              </>
            ) : (
              mostrarRegistro ? "Crear cuenta" : "Iniciar sesión"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
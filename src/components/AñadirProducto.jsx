import { useState, useEffect } from "react";

export default function AñadirProducto() {
  // Estados para los datos del formulario
  const [formData, setFormData] = useState({
    nombreProducto: "",
    descripcionProducto: "",
    precioProducto: "",
    imagenProducto: "",
    cantidadProducto: "",
    idCategoria: "",
    idMarca: "",
    nuevaMarca: ""
  });

  // Estados para datos de la base de datos
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [mostrarNuevaMarca, setMostrarNuevaMarca] = useState(false);

  // Cargar categorías y marcas al inicio
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      
      // Cargar categorías
      const resCategorias = await fetch("http://localhost/ksl-backend/producto/obtenerCategoria.php");
      const dataCategorias = await resCategorias.json();
      
      // Cargar marcas
      const resMarcas = await fetch("http://localhost/ksl-backend/producto/obtenerMarca.php");
      const dataMarcas = await resMarcas.json();
      
      setCategorias(dataCategorias);
      setMarcas(dataMarcas);
      setCargando(false);
    } catch (error) {
      setError("Error al cargar los datos de categorías y marcas");
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si cambia el campo idMarca y es "nueva", mostrar campo para nueva marca
    if (name === "idMarca") {
      setMostrarNuevaMarca(value === "nueva");
      if (value !== "nueva") {
        setFormData(prev => ({ ...prev, nuevaMarca: "" }));
      }
    }
  };

  const validarFormulario = () => {
    // Validar campos obligatorios
    if (!formData.nombreProducto.trim()) {
      return "El nombre del producto es obligatorio";
    }
    if (!formData.descripcionProducto.trim()) {
      return "La descripción es obligatoria";
    }
    if (!formData.precioProducto || parseFloat(formData.precioProducto) <= 0) {
      return "El precio debe ser mayor a 0";
    }
    if (!formData.cantidadProducto || parseInt(formData.cantidadProducto) < 0) {
      return "La cantidad no puede ser negativa";
    }
    if (!formData.idCategoria) {
      return "Debes seleccionar una categoría";
    }
    if (formData.idMarca === "nueva" && !formData.nuevaMarca.trim()) {
      return "Debes ingresar el nombre de la nueva marca";
    }
    if (!formData.idMarca || (formData.idMarca !== "nueva" && !formData.idMarca)) {
      return "Debes seleccionar o crear una marca";
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    // Validar formulario
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      // Preparar datos para enviar
      const datosEnviar = {
        nombreProducto: formData.nombreProducto.trim(),
        descripcionProducto: formData.descripcionProducto.trim(),
        precioProducto: parseFloat(formData.precioProducto),
        imagenProducto: formData.imagenProducto.trim() || "default.jpg",
        cantidadProducto: parseInt(formData.cantidadProducto),
        idCategoria: parseInt(formData.idCategoria),
        idMarca: formData.idMarca,
        nuevaMarca: formData.nuevaMarca.trim()
      };

      // Enviar datos al backend
      const respuesta = await fetch("http://localhost/ksl-backend/producto/añadirProducto.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(datosEnviar)
      });

      const resultado = await respuesta.json();

      if (resultado.ok) {
        setExito(resultado.mensaje);
        // Limpiar formulario
        setFormData({
          nombreProducto: "",
          descripcionProducto: "",
          precioProducto: "",
          imagenProducto: "",
          cantidadProducto: "",
          idCategoria: "",
          idMarca: "",
          nuevaMarca: ""
        });
        setMostrarNuevaMarca(false);
        // Recargar marcas si se añadió una nueva
        if (formData.idMarca === "nueva") {
          cargarDatos();
        }
      } else {
        setError(resultado.mensaje);
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    }
  };

  if (cargando) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Añadir Nuevo Producto</h4>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError("")}
                  ></button>
                </div>
              )}
              
              {exito && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {exito}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setExito("")}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Nombre del Producto */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Nombre del Producto *</label>
                  <input
                    type="text"
                    name="nombreProducto"
                    className="form-control"
                    value={formData.nombreProducto}
                    onChange={handleChange}
                    placeholder="Ej: Purple Gloss"
                    required
                  />
                </div>

                {/* Descripción */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Descripción *</label>
                  <textarea
                    name="descripcionProducto"
                    className="form-control"
                    rows="4"
                    value={formData.descripcionProducto}
                    onChange={handleChange}
                    placeholder="Describe el producto..."
                    required
                  ></textarea>
                </div>

                <div className="row">
                  {/* Precio */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Precio ($) *</label>
                    <input
                      type="number"
                      name="precioProducto"
                      className="form-control"
                      value={formData.precioProducto}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>

                  {/* Cantidad */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Cantidad en Stock *</label>
                    <input
                      type="number"
                      name="cantidadProducto"
                      className="form-control"
                      value={formData.cantidadProducto}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Imagen (URL) */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    URL de la Imagen <small className="text-muted">(Opcional)</small>
                  </label>
                  <input
                    type="url"
                    name="imagenProducto"
                    className="form-control"
                    value={formData.imagenProducto}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <small className="text-muted">
                    Si no se proporciona imagen, se usará una por defecto
                  </small>
                </div>

                {/* Categoría */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Categoría *</label>
                  <select
                    name="idCategoria"
                    className="form-select"
                    value={formData.idCategoria}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.idCategoria} value={categoria.idCategoria}>
                        {categoria.nombreCategoria}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marca */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Marca *</label>
                  <select
                    name="idMarca"
                    className="form-select"
                    value={formData.idMarca}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una marca</option>
                    {marcas.map((marca) => (
                      <option key={marca.idMarca} value={marca.idMarca}>
                        {marca.nombreMarca}
                      </option>
                    ))}
                    <option value="nueva">➕ Añadir nueva marca</option>
                  </select>
                </div>

                {/* Campo para nueva marca (solo si se selecciona "Añadir nueva marca") */}
                {mostrarNuevaMarca && (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nombre de la Nueva Marca *</label>
                    <input
                      type="text"
                      name="nuevaMarca"
                      className="form-control"
                      value={formData.nuevaMarca}
                      onChange={handleChange}
                      placeholder="Ingresa el nombre de la nueva marca"
                      required={mostrarNuevaMarca}
                    />
                  </div>
                )}

                {/* Botones */}
                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-dark flex-grow-1 py-2">
                    <i className="bi bi-plus-circle me-2"></i>
                    Añadir Producto
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setFormData({
                        nombreProducto: "",
                        descripcionProducto: "",
                        precioProducto: "",
                        imagenProducto: "",
                        cantidadProducto: "",
                        idCategoria: "",
                        idMarca: "",
                        nuevaMarca: ""
                      });
                      setMostrarNuevaMarca(false);
                      setError("");
                    }}
                  >
                    Limpiar
                  </button>
                </div>

                <div className="mt-3 text-muted">
                  <small>* Campos obligatorios</small>
                </div>
              </form>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-4">
            <div className="alert alert-info">
              <h5><i className="bi bi-info-circle me-2"></i>Información importante</h5>
              <ul className="mb-0">
                <li>El ID del producto se generará automáticamente (máximo ID actual + 1)</li>
                <li>Las categorías no se pueden crear desde aquí</li>
                <li>Las marcas se pueden crear directamente en este formulario</li>
                <li>La imagen debe ser un enlace URL válido</li>
                <li>Si no se proporciona imagen, se usará "default.jpg"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
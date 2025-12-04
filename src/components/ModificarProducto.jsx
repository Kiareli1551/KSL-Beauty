import { useState, useEffect } from "react";

export default function ModificarProducto() {
  // Estados para la búsqueda y datos del formulario
  const [idProductoBuscar, setIdProductoBuscar] = useState("");
  const [producto, setProducto] = useState(null);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [cargandoFormulario, setCargandoFormulario] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  
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
  const [mostrarNuevaMarca, setMostrarNuevaMarca] = useState(false);

  // Cargar categorías y marcas al inicio
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargandoFormulario(true);
      
      // Cargar categorías
      const resCategorias = await fetch("http://localhost/ksl-backend/producto/obtenerCategoria.php");
      const dataCategorias = await resCategorias.json();
      
      // Cargar marcas
      const resMarcas = await fetch("http://localhost/ksl-backend/producto/obtenerMarca.php");
      const dataMarcas = await resMarcas.json();
      
      setCategorias(dataCategorias);
      setMarcas(dataMarcas);
      setCargandoFormulario(false);
    } catch (error) {
      setError("Error al cargar los datos de categorías y marcas");
      setCargandoFormulario(false);
    }
  };

  const buscarProducto = async (e) => {
    e.preventDefault();
    
    if (!idProductoBuscar.trim()) {
      setError("Por favor ingresa un ID de producto");
      return;
    }

    setCargandoBusqueda(true);
    setError("");
    setExito("");
    setProducto(null);

    try {
      const respuesta = await fetch("http://localhost/ksl-backend/producto/obtenerProducto.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ idProducto: parseInt(idProductoBuscar) })
      });

      const resultado = await respuesta.json();

      if (resultado.ok) {
        setProducto(resultado.producto);
        
        // Llenar el formulario con los datos del producto
        setFormData({
          nombreProducto: resultado.producto.nombreProducto,
          descripcionProducto: resultado.producto.descripcionProducto,
          precioProducto: resultado.producto.precioProducto,
          imagenProducto: resultado.producto.imagenProducto === "default.jpg" ? "" : resultado.producto.imagenProducto,
          cantidadProducto: resultado.producto.cantidadProducto,
          idCategoria: resultado.producto.idCategoria,
          idMarca: resultado.producto.idMarca.toString(),
          nuevaMarca: ""
        });
        
        // Verificar si la marca del producto existe en la lista de marcas
        const marcaExiste = marcas.some(marca => marca.idMarca === resultado.producto.idMarca);
        if (!marcaExiste) {
          // Si la marca no existe en la lista, mostrar como "nueva" y cargar su nombre
          setMostrarNuevaMarca(true);
          // Necesitamos obtener el nombre de la marca para mostrarlo
          obtenerNombreMarca(resultado.producto.idMarca);
        }
        
        setExito("Producto encontrado. Puedes modificarlo ahora.");
      } else {
        setError(resultado.mensaje);
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    } finally {
      setCargandoBusqueda(false);
    }
  };

  const obtenerNombreMarca = async (idMarca) => {
    try {
      const respuesta = await fetch("http://localhost/ksl-backend/producto/obtenerMarcaPorId.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ idMarca })
      });

      const resultado = await respuesta.json();
      if (resultado.ok) {
        setFormData(prev => ({
          ...prev,
          idMarca: "nueva",
          nuevaMarca: resultado.nombreMarca
        }));
      }
    } catch (error) {
      console.error("Error al obtener nombre de marca:", error);
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
    if (!producto) {
      return "Primero debes buscar un producto";
    }
    
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

  const handleActualizar = async (e) => {
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
        idProducto: parseInt(idProductoBuscar),
        nombreProducto: formData.nombreProducto.trim(),
        descripcionProducto: formData.descripcionProducto.trim(),
        precioProducto: parseFloat(formData.precioProducto),
        imagenProducto: formData.imagenProducto.trim() || "default.jpg",
        cantidadProducto: parseInt(formData.cantidadProducto),
        idCategoria: parseInt(formData.idCategoria),
        idMarca: formData.idMarca,
        nuevaMarca: formData.nuevaMarca.trim()
      };

      // Enviar datos al backend para actualizar
      const respuesta = await fetch("http://localhost/ksl-backend/producto/modificarProducto.php", {
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
        // Actualizar el producto en estado
        setProducto(prev => ({
          ...prev,
          ...datosEnviar
        }));
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

  const handleEliminar = async () => {
    if (!producto) {
      setError("Primero debes buscar un producto");
      return;
    }

    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar el producto "${producto.nombreProducto}"? Esta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch("http://localhost/ksl-backend/producto/eliminarProducto.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ idProducto: parseInt(idProductoBuscar) })
      });

      const resultado = await respuesta.json();

      if (resultado.ok) {
        setExito(resultado.mensaje);
        // Limpiar todo
        setIdProductoBuscar("");
        setProducto(null);
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
      } else {
        setError(resultado.mensaje);
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    }
  };

  const resetearBusqueda = () => {
    setIdProductoBuscar("");
    setProducto(null);
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
    setExito("");
  };

  if (cargandoFormulario) {
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
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Modificar o Eliminar Producto</h4>
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

              {/* Sección de búsqueda */}
              <div className="mb-4 p-3 border rounded bg-light">
                <h5>Buscar Producto por ID</h5>
                <form onSubmit={buscarProducto} className="row g-2">
                  <div className="col-md-8">
                    <input
                      type="number"
                      className="form-control"
                      value={idProductoBuscar}
                      onChange={(e) => setIdProductoBuscar(e.target.value)}
                      placeholder="Ingresa el ID del producto"
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary w-100"
                      disabled={cargandoBusqueda}
                    >
                      {cargandoBusqueda ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Buscando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>
                          Buscar Producto
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                {producto && (
                  <div className="mt-3 p-2 border rounded bg-white">
                    <p className="mb-0">
                      <strong>Producto encontrado:</strong> {producto.nombreProducto}
                      <br />
                      <small className="text-muted">ID: {producto.idProducto} | Precio: ${producto.precioProducto}</small>
                    </p>
                    <button 
                      className="btn btn-sm btn-outline-secondary mt-2"
                      onClick={resetearBusqueda}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Buscar otro producto
                    </button>
                  </div>
                )}
              </div>

              {/* Formulario de modificación (solo visible cuando hay producto) */}
              {producto && (
                <form onSubmit={handleActualizar}>
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
                      Si el campo está vacío, se usará "default.jpg"
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

                  {/* Botones de acción */}
                  <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn btn-primary flex-grow-1 py-2">
                      <i className="bi bi-check-circle me-2"></i>
                      Actualizar Producto
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      onClick={handleEliminar}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Eliminar Producto
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        // Restaurar valores originales
                        setFormData({
                          nombreProducto: producto.nombreProducto,
                          descripcionProducto: producto.descripcionProducto,
                          precioProducto: producto.precioProducto,
                          imagenProducto: producto.imagenProducto === "default.jpg" ? "" : producto.imagenProducto,
                          cantidadProducto: producto.cantidadProducto,
                          idCategoria: producto.idCategoria,
                          idMarca: producto.idMarca.toString(),
                          nuevaMarca: ""
                        });
                        
                        // Restaurar estado de nueva marca
                        const marcaExiste = marcas.some(marca => marca.idMarca === producto.idMarca);
                        setMostrarNuevaMarca(!marcaExiste);
                        if (!marcaExiste) {
                          obtenerNombreMarca(producto.idMarca);
                        }
                      }}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Restaurar
                    </button>
                  </div>

                  <div className="mt-3 text-muted">
                    <small>* Campos obligatorios</small>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-4">
            <div className="alert alert-warning">
              <h5><i className="bi bi-exclamation-triangle me-2"></i>Advertencia importante</h5>
              <ul className="mb-0">
                <li>Al eliminar un producto, también se eliminará de todos los carritos de usuarios</li>
                <li>Esta acción no se puede deshacer</li>
                <li>Los cambios en el producto se reflejarán inmediatamente en la tienda</li>
                <li>Asegúrate de que los datos sean correctos antes de actualizar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
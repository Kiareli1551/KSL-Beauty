import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarPerfil = async () => {
    try {
      const res = await fetch("http://localhost/ksl-backend/usuario/perfil.php", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.ok) {
        setUsuario(data.usuario);
      } else {
        setUsuario(null);
      }
    } catch {
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  const login = async (nombreUsuario, contraseña) => {
    const res = await fetch("http://localhost/ksl-backend/usuario/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        nombreUsuario: nombreUsuario,
        contraseña: contraseña,
      }),
    });

    const data = await res.json();

    if (data.ok) {
      setUsuario(data.usuario);
      return { ok: true };
    } else {
      return { ok: false, mensaje: data.mensaje };
    }
  };

  const logout = async () => {
    await fetch("http://localhost/ksl-backend/usuario/logout.php", {
      credentials: "include",
    });

    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        login,
        logout,
        cargarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

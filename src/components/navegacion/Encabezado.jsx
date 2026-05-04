import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Nav, Offcanvas, Navbar, Container } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [esDesktop, setEsDesktop] = useState(window.innerWidth >= 992);
  const navigate = useNavigate();
  const location = useLocation();

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const cerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem("usuario-supabase");
      setMostrarMenu(false);
      navigate("/"); // ✅ Vuelve a la landing pública
    } catch (err) {
      console.log("Error cerrando sesión:", err.message);
    }
  };

  // Ocultar sidebar en páginas públicas
  const paginaPublica =
    location.pathname === "/" || location.pathname === "/login";

  const activo = (ruta) => (location.pathname === ruta ? "active" : "");

  useEffect(() => {
    const manejarResize = () => {
      const desktop = window.innerWidth >= 992;
      setEsDesktop(desktop);
      if (desktop) setMostrarMenu(false);
    };
    window.addEventListener("resize", manejarResize);
    return () => window.removeEventListener("resize", manejarResize);
  }, []);

  // No renderizar el sidebar en páginas públicas
  if (paginaPublica) return null;

  return (
    <>
      {/* Navbar hamburguesa — solo en móvil */}
      <Navbar expand="lg" fixed="top" className="color-navbar d-lg-none" variant="dark">
        <Container fluid>
          <span className="text-white fw-bold">TapMeal</span>
          <Navbar.Toggle onClick={() => setMostrarMenu(true)} />
        </Container>
      </Navbar>

      {/* Offcanvas — solo en móvil */}
      {!esDesktop && (
        <Offcanvas
          show={mostrarMenu}
          onHide={() => setMostrarMenu(false)}
          placement="start"
          className="sidebar-custom"
        >
          <Offcanvas.Body className="d-flex flex-column p-0">
            <ContenidoSidebar
              activo={activo}
              manejarNavegacion={manejarNavegacion}
              cerrarSesion={cerrarSesion}
            />
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {/* Sidebar fijo — solo en desktop */}
      {esDesktop && (
        <div className="sidebar-custom d-flex flex-column">
          <ContenidoSidebar
            activo={activo}
            manejarNavegacion={manejarNavegacion}
            cerrarSesion={cerrarSesion}
          />
        </div>
      )}
    </>
  );
};

const ContenidoSidebar = ({ activo, manejarNavegacion, cerrarSesion }) => (
  <>
    <div className="sidebar-header">
      <h5>TapMeal</h5>
      <small>Panel Administrativo</small>
    </div>

    <hr className="sidebar-divider" />

    {/* "Inicio" no aparece — es la landing pública */}
    <Nav className="flex-column menu-sidebar">
      <Nav.Link onClick={() => manejarNavegacion("/productos")}  className={activo("/productos")}>Platillos</Nav.Link>
      <Nav.Link onClick={() => manejarNavegacion("/categorias")} className={activo("/categorias")}>Categorías</Nav.Link>
      <Nav.Link onClick={() => manejarNavegacion("/clientes")}   className={activo("/clientes")}>Clientes</Nav.Link>
      <Nav.Link onClick={() => manejarNavegacion("/pedidos")}    className={activo("/pedidos")}>Pedidos</Nav.Link>
      <Nav.Link onClick={() => manejarNavegacion("/mesas")}      className={activo("/mesas")}>Mesas</Nav.Link>
      <Nav.Link onClick={() => manejarNavegacion("/extras")}     className={activo("/extras")}>Extras</Nav.Link>
    </Nav>

    <div className="mt-auto p-3">
      <button className="btn btn-cerrar-sesion w-100" onClick={cerrarSesion}>
        Cerrar Sesión
      </button>
    </div>
  </>
);

export default Encabezado;
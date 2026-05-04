import React, { useState, useEffect } from "react";
import { supabase } from "../database/supabaseconfig";
import { Container, Row, Col, Button, Card, Alert } from "react-bootstrap";
import NotificacionOperacion from "../components/NotificacionOperacion";
import TablaExtra from "../components/extras/TablaExtra";
import TarjetaExtra from "../components/extras/TarjetaExtra";
import ModalRegistroExtra from "../components/extras/ModalRegistroExtra";
import ModalEdicionExtra from "../components/extras/ModalEdicionExtra";
import ModalEliminacionExtra from "../components/extras/ModalEliminacionExtra";
import CuadroBusquedas from "../components/busquedas/CuadroBusqueda";
import Paginacion from "../components/ordenamiento/Paginacion";

const Extras = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [extras, setExtras] = useState([]);
  const [extrasFiltrados, setExtrasFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  // Variables de estado Paginación
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  // Estados de modales
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  // Estado para los extras (nuevo y editar)
  const [nuevoExtra, setNuevoExtra] = useState({
    descripcion: "",
    precio: ""
  });

  const [extraEditar, setExtraEditar] = useState({
    id_extra: "",
    descripcion: "",
    precio: ""
  });

  const [extraAEliminar, setExtraAEliminar] = useState(null);

  // Carga inicial
  useEffect(() => {
    cargarExtras();
  }, []);

  // Manejar búsqueda
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setExtrasFiltrados(extras);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = extras.filter(
        (extra) =>
          extra.descripcion?.toLowerCase().includes(textoLower) ||
          extra.id_extra?.toString().includes(textoLower)
      );
      setExtrasFiltrados(filtrados);
    }
    establecerPaginaActual(1);
  }, [textoBusqueda, extras]);

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const cargarExtras = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("Extras")
        .select("*")
        .order("id_extra", { ascending: false });

      if (error) {
        throw error;
      }
      setExtras(data || []);
    } catch (err) {
      console.error("Excepción al cargar extras:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar extras",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  // Manejadores de Inputs
  const manejoCambioInputRegistro = (e) => {
    const { name, value } = e.target;
    setNuevoExtra((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setExtraEditar((prev) => ({ ...prev, [name]: value }));
  };

  // Operaciones CRUD
  const agregarExtra = async () => {
    try {
      const { error } = await supabase.from("Extras").insert([
        {
          descripcion: nuevoExtra.descripcion,
          precio: parseFloat(nuevoExtra.precio)
        },
      ]);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: "Extra registrado exitosamente.",
        tipo: "exito",
      });
      await cargarExtras();
      setNuevoExtra({
        descripcion: "",
        precio: ""
      });
      setMostrarModalRegistro(false);
    } catch (err) {
      console.error("Error al registrar extra:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error al registrar extra.",
        tipo: "error",
      });
    }
  };

  const actualizarExtra = async () => {
    try {
      const { error } = await supabase
        .from("Extras")
        .update({
          descripcion: extraEditar.descripcion,
          precio: parseFloat(extraEditar.precio)
        })
        .eq("id_extra", extraEditar.id_extra);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Extra actualizado exitosamente.`,
        tipo: "exito",
      });
      await cargarExtras();
      setMostrarModalEdicion(false);
    } catch (err) {
      console.error("Error al actualizar extra:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error al actualizar extra.",
        tipo: "error",
      });
    }
  };

  const eliminarExtra = async () => {
    if (!extraAEliminar) return;

    try {
      const { error } = await supabase
        .from("Extras")
        .delete()
        .eq("id_extra", extraAEliminar.id_extra);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: "Extra eliminado exitosamente.",
        tipo: "exito",
      });
      await cargarExtras();
      setMostrarModalEliminacion(false);
    } catch (err) {
      console.error("Error al eliminar extra:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar extra.",
        tipo: "error",
      });
    }
  };

  // Manejadores para abrir modales de edición y eliminación
  const abrirModalEdicion = (extra) => {
    setExtraEditar({
      id_extra: extra.id_extra,
      descripcion: extra.descripcion,
      precio: extra.precio
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (extra) => {
    setExtraAEliminar(extra);
    setMostrarModalEliminacion(true);
  };

  // Función de cálculo de las páginas a mostrar
  const extrasPaginados = extrasFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  return (
    <Container className="mt-4 pt-3">
      <Row className="align-items-center mb-3">
        <Col xs={9} sm={7} md={7} lg={7} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi bi-plus-circle-dotted me-2"></i> Extras
          </h3>
        </Col>
        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button 
            variant="dark" 
            onClick={() => setMostrarModalRegistro(true)}
            size="md"
          >
            <i className="bi bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nuevo Extra</span>
          </Button>
        </Col>
      </Row>

      <hr />

      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por descripción o ID..."
          />
        </Col>
      </Row>

      {/* Mensaje de no coincidencias */}
      {!cargando && textoBusqueda.trim() && extrasFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron extras que coincidan con "{textoBusqueda}"
            </Alert>
          </Col>
        </Row>
      )}

      <Card className="shadow-sm mb-3">
        <Card.Body>
          {cargando ? (
            <div className="text-center my-4">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Vista de Tabla para Desktop */}
              <div className="d-none d-lg-block">
                <TablaExtra
                  extras={extrasPaginados}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>

              {/* Vista de Tarjetas para Mobile */}
              <div className="d-lg-none">
                <TarjetaExtra
                  extras={extrasPaginados}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Paginación */}
      {!cargando && extrasFiltrados.length > 0 && (
        <Paginacion
          paginaActual={paginaActual}
          totalRegistros={extrasFiltrados.length}
          registrosPorPagina={registrosPorPagina}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      {/* Modales */}
      <ModalRegistroExtra
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevoExtra={nuevoExtra}
        manejoCambioInput={manejoCambioInputRegistro}
        agregarExtra={agregarExtra}
      />

      <ModalEdicionExtra
        mostrarModal={mostrarModalEdicion}
        setMostrarModal={setMostrarModalEdicion}
        extraEditar={extraEditar}
        manejoCambioInput={manejoCambioInputEdicion}
        actualizarExtra={actualizarExtra}
      />

      <ModalEliminacionExtra
        mostrarModal={mostrarModalEliminacion}
        setMostrarModal={setMostrarModalEliminacion}
        extra={extraAEliminar}
        eliminarExtra={eliminarExtra}
      />

      {/* Notificaciones */}
      {toast.mostrar && (
        <NotificacionOperacion
          mostrar={toast.mostrar}
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onCerrar={() => setToast({ ...toast, mostrar: false })}
        />
      )}
    </Container>
  );
};

export default Extras;
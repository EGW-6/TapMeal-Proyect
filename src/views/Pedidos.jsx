import React, { useEffect, useState } from "react";
import { supabase } from "../database/supabaseconfig";
import { Container, Row, Col, Button, Card, Alert, Form, Spinner, ButtonGroup } from "react-bootstrap";
import ModalRegistroPedido from "../components/pedidos/ModalRegistroPedido";
import ModalEliminacionPedido from "../components/pedidos/ModalEliminacionPedido";
import TablaPedido from "../components/pedidos/TablaPedido";
import TarjetaPedido from "../components/pedidos/TarjetaPedido";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusqueda";
import ModalEdicionPedido from "../components/pedidos/ModalEdicionPedido";
import Paginacion from "../components/ordenamiento/Paginacion";

const Pedidos = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [pedidos, setPedidos] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [cargando, setCargando] = useState(true);

  // Variables de estado Paginación
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);
  
  // Catálogos para los selects
  const [clientes, setClientes] = useState([]);
  const [tiposPedido, setTiposPedido] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [platillos, setPlatillos] = useState([]);
  const [extrasCatalogo, setExtrasCatalogo] = useState([]);

  // Estados de modales
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  // Estado para los detalles del nuevo pedido
  const [detallesPedido, setDetallesPedido] = useState([]);

  // Estado para los pedidos (nuevo y editar)
  const [nuevoPedido, setNuevoPedido] = useState({
    id_cliente: "",
    id_tipo: "",
    id_mesa: "",
    estado: "Pendiente",
    total: 0
  });

  const [pedidoEditar, setPedidoEditar] = useState({
    id_pedido: "",
    id_cliente: "",
    id_tipo: "",
    id_mesa: "",
    estado: "",
    total: 0
  });

  const [pedidoAEliminar, setPedidoAEliminar] = useState(null);

  // Carga inicial
  useEffect(() => {
    cargarCatalogos();
    cargarPedidos();
  }, []);

  // Manejar búsqueda y filtros
  useEffect(() => {
    let filtrados = [...pedidos];

    // Filtrar por estado si no es "Todos"
    if (filtroEstado !== "Todos") {
      filtrados = filtrados.filter(pedido => {
        const estadoPedido = pedido.estado ? pedido.estado.trim() : "";
        return estadoPedido === filtroEstado;
      });
    }

    // Filtrar por texto de búsqueda
    if (textoBusqueda.trim()) {
      const textoLower = textoBusqueda.toLowerCase().trim();
      filtrados = filtrados.filter(
        (pedido) =>
          pedido.id_pedido?.toString().includes(textoLower) ||
          (pedido.Clientes && 
            (`${pedido.Clientes.nombre_cliente} ${pedido.Clientes.apellido_cliente}`)
              .toLowerCase()
              .includes(textoLower)) ||
          pedido.estado?.toLowerCase().includes(textoLower)
      );
    }

    setPedidosFiltrados(filtrados);
    establecerPaginaActual(1);
  }, [textoBusqueda, filtroEstado, pedidos]);

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const cargarCatalogos = async () => {
    try {
      const [resClientes, resTipos, resMesas, resPlatillos, resExtras] = await Promise.all([
        supabase.from("Clientes").select("id_cliente, nombre_cliente, apellido_cliente"),
        supabase.from("Tipo_pedido").select("id_tipo, descripcion"),
        supabase.from("Mesas").select("id_mesa"),
        supabase.from("Platillos").select("id_platillo, nombre_platillo, precio"),
        supabase.from("Extras").select("id_extra, descripcion, precio")
      ]);

      if (resClientes.data) setClientes(resClientes.data);
      if (resTipos.data) setTiposPedido(resTipos.data);
      if (resMesas.data) setMesas(resMesas.data);
      if (resPlatillos.data) setPlatillos(resPlatillos.data);
      if (resExtras.data) setExtrasCatalogo(resExtras.data);
    } catch (err) {
      console.error("Error al cargar catálogos:", err);
    }
  };

  const cargarPedidos = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("Pedido")
        .select(`
          *,
          Clientes ( id_cliente, nombre_cliente, apellido_cliente ),
          Tipo_pedido ( id_tipo, descripcion ),
          Mesas ( id_mesa )
        `)
        .order("id_pedido", { ascending: true });

      if (error) {
        throw error;
      }
      setPedidos(data || []);
    } catch (err) {
      console.error("Excepción al cargar pedidos:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar pedidos",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  // Manejadores de Inputs
  const manejoCambioInputRegistro = (e) => {
    const { name, value } = e.target;
    setNuevoPedido((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setPedidoEditar((prev) => ({ ...prev, [name]: value }));
  };

  // Operaciones CRUD
  const agregarPedido = async () => {
    try {
      // 1. Insertar el pedido principal
      const { data: pedidoData, error: pedidoError } = await supabase
        .from("Pedido")
        .insert([
          {
            id_cliente: parseInt(nuevoPedido.id_cliente),
            id_tipo: parseInt(nuevoPedido.id_tipo),
            id_mesa: parseInt(nuevoPedido.id_mesa),
            estado: nuevoPedido.estado,
            total: parseFloat(nuevoPedido.total),
            fecha: new Date().toISOString()
          },
        ])
        .select();

      if (pedidoError) throw pedidoError;

      const idPedidoRecienCreado = pedidoData[0].id_pedido;

      // 2. Insertar los detalles del pedido si existen
      if (detallesPedido.length > 0) {
        const detallesAInsertar = detallesPedido.map((d) => ({
          id_pedido: idPedidoRecienCreado,
          id_platillo: parseInt(d.id_platillo),
          cantidad: parseInt(d.cantidad),
          precio_unitario: parseFloat(d.precio_unitario),
          id_extra: d.id_extra ? parseInt(d.id_extra) : null
        }));

        const { error: detallesError } = await supabase
          .from("Detalle_pedido")
          .insert(detallesAInsertar);

        if (detallesError) throw detallesError;
      }

      setToast({
        mostrar: true,
        mensaje: "Pedido y detalles registrados exitosamente.",
        tipo: "exito",
      });
      await cargarPedidos();
      setNuevoPedido({
        id_cliente: "",
        id_tipo: "",
        id_mesa: "",
        estado: "Pendiente",
        total: 0
      });
      setDetallesPedido([]);
      setMostrarModalRegistro(false);
    } catch (err) {
      console.error("Error al registrar pedido completo:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error al registrar pedido.",
        tipo: "error",
      });
    }
  };

  const actualizarPedido = async () => {
    try {
      const { error } = await supabase
        .from("Pedido")
        .update({
          id_cliente: parseInt(pedidoEditar.id_cliente),
          id_tipo: parseInt(pedidoEditar.id_tipo),
          id_mesa: parseInt(pedidoEditar.id_mesa),
          estado: pedidoEditar.estado,
          total: parseFloat(pedidoEditar.total)
        })
        .eq("id_pedido", pedidoEditar.id_pedido);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Pedido #${pedidoEditar.id_pedido} actualizado exitosamente.`,
        tipo: "exito",
      });
      await cargarPedidos();
      setMostrarModalEdicion(false);
    } catch (err) {
      console.error("Error al actualizar pedido:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error al actualizar pedido.",
        tipo: "error",
      });
    }
  };

  const eliminarPedido = async () => {
    if (!pedidoAEliminar) return;

    setMostrarModalEliminacion(false);

    try {
      // 1. Primero eliminamos los detalles del pedido (obligatorio por la foreign key)
      const { error: errorDetalles } = await supabase
        .from("Detalle_pedido")
        .delete()
        .eq("id_pedido", pedidoAEliminar.id_pedido);

      if (errorDetalles) {
        console.error("Error al eliminar detalles del pedido:", errorDetalles);
        throw errorDetalles;
      }

      // 2. Luego eliminamos el pedido principal
      const { error: errorPedido } = await supabase
        .from("Pedido")
        .delete()
        .eq("id_pedido", pedidoAEliminar.id_pedido);

      if (errorPedido) throw errorPedido;

      setToast({
        mostrar: true,
        mensaje: `Pedido #${pedidoAEliminar.id_pedido} eliminado exitosamente.`,
        tipo: "exito",
      });
      await cargarPedidos();
    } catch (err) {
      console.error("Error al eliminar pedido:", err.message);
      setToast({
        mostrar: true,
        mensaje: "No se pudo eliminar el pedido porque tiene detalles asociados.",
        tipo: "error",
      });
    }
  };

  // Manejadores para abrir modales de edición y eliminación
  const abrirModalEdicion = (pedido) => {
    setPedidoEditar({
      id_pedido: pedido.id_pedido,
      id_cliente: pedido.id_cliente,
      id_tipo: pedido.id_tipo,
      id_mesa: pedido.id_mesa,
      estado: pedido.estado,
      total: pedido.total
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (pedido) => {
    setPedidoAEliminar(pedido);
    setMostrarModalEliminacion(true);
  };

  // Función de cálculo de las páginas a mostrar
  const pedidosPaginados = pedidosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  return (
    <Container className="mt-4 pt-3">
      <Row className="align-items-center mb-3">
        <Col xs={12} sm={6} md={6} lg={6}>
          <h3 className="mb-0">
            <i className="bi-receipt me-2"></i> Pedidos
          </h3>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} className="text-end mt-3 mt-sm-0">
          <div className="d-flex justify-content-sm-end align-items-center gap-2">
            <Form.Select
              style={{ width: 'auto', minWidth: '160px' }}
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="border-success shadow-sm"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Preparación">En Preparación</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </Form.Select>
            <Button 
              variant="dark" 
              onClick={() => setMostrarModalRegistro(true)}
              size="md"
              className="text-nowrap shadow-sm"
            >
              <i className="bi-plus-lg"></i>
              <span className="d-none d-sm-inline ms-2">Nuevo Pedido</span>
            </Button>
          </div>
        </Col>
      </Row>

      <hr />

      {/* Cuadro de búsqueda */}
      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por ID, cliente o estado..."
          />
        </Col>
      </Row>

      {/* Spinner mientras se cargan los pedidos */}
      {cargando ? (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando Pedidos...</p>
          </Col>
        </Row>
      ) : (
        <>
          {/* Mensaje de no coincidencias */}
          {pedidosFiltrados.length === 0 ? (
            <Row className="mb-4">
              <Col>
                <Alert variant="info" className="text-center shadow-sm">
                  <i className="bi bi-info-circle me-2"></i>
                  No se encontraron pedidos con los filtros aplicados.
                </Alert>
              </Col>
            </Row>
          ) : (
            <>
              <Row>
                {/* Tabla para Desktop */}
                <Col lg={12} className="d-none d-lg-block">
                  <TablaPedido
                    pedidos={pedidosPaginados}
                    abrirModalEdicion={abrirModalEdicion}
                    abrirModalEliminacion={abrirModalEliminacion}
                  />
                </Col>

                {/* Tarjetas para Móvil */}
                <Col xs={12} className="d-lg-none">
                  <TarjetaPedido
                    pedidos={pedidosPaginados}
                    abrirModalEdicion={abrirModalEdicion}
                    abrirModalEliminacion={abrirModalEliminacion}
                  />
                </Col>
              </Row>

              {/* Paginación */}
              <Paginacion
                totalRegistros={pedidosFiltrados.length}
                registrosPorPagina={registrosPorPagina}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </>
          )}
        </>
      )}

      {/* Modales */}
      <ModalRegistroPedido
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevoPedido={nuevoPedido}
        manejoCambioInput={manejoCambioInputRegistro}
        agregarPedido={agregarPedido}
        clientes={clientes}
        tiposPedido={tiposPedido}
        mesas={mesas}
        platillos={platillos}
        extras={extrasCatalogo}
        detallesPedido={detallesPedido}
        setDetallesPedido={setDetallesPedido}
        setNuevoPedido={setNuevoPedido}
      />

      <ModalEdicionPedido
        mostrarModal={mostrarModalEdicion}
        setMostrarModal={setMostrarModalEdicion}
        pedidoEditar={pedidoEditar}
        manejoCambioInput={manejoCambioInputEdicion}
        actualizarPedido={actualizarPedido}
        clientes={clientes}
        tiposPedido={tiposPedido}
        mesas={mesas}
      />

      <ModalEliminacionPedido
        mostrarModal={mostrarModalEliminacion}
        setMostrarModal={setMostrarModalEliminacion}
        pedido={pedidoAEliminar}
        eliminarPedido={eliminarPedido}
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
}

export default Pedidos;
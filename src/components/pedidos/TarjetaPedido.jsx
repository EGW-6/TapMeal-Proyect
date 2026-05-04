import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaPedido = ({
  pedidos,
  abrirModalEdicion,
  abrirModalEliminacion
}) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!(pedidos && pedidos.length >= 0));
  }, [pedidos]);

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'Completado': return 'success';
      case 'Cancelado': return 'danger';
      case 'En Preparación': return 'info';
      default: return 'warning';
    }
  };

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <h5>Cargando pedidos...</h5>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : pedidos.length === 0 ? (
        <div className="text-center my-5">
          <p className="text-muted">No hay pedidos registrados.</p>
        </div>
      ) : (
        <div className="px-2">
          {pedidos.map((pedido) => {
            const tarjetaActiva = idTarjetaActiva === pedido.id_pedido;

            return (
              <Card
                key={pedido.id_pedido}
                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-categoria-contenedor"
                onClick={() => alternarTarjetaActiva(pedido.id_pedido)}
                tabIndex={0}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    alternarTarjetaActiva(pedido.id_pedido);
                  }
                }}
              >
                <Card.Body
                  className={`p-2 tarjeta-categoria-cuerpo ${
                    tarjetaActiva ? "tarjeta-categoria-cuerpo-activo" : ""
                  }`}
                >
                  <Row className="align-items-center gx-3">
                    <Col xs={2} className="px-2 text-center">
                      <div className="bg-light d-flex align-items-center justify-content-center rounded tarjeta-categoria-placeholder-imagen py-2">
                        <i className="bi bi-receipt text-muted fs-3"></i>
                      </div>
                    </Col>
                    <Col xs={6} className="text-start">
                      <div className="fw-bold text-truncate mb-1">
                        Pedido #{pedido.id_pedido}
                      </div>
                      <div className="small text-muted text-truncate">
                        {pedido.Clientes ? `${pedido.Clientes.nombre_cliente} ${pedido.Clientes.apellido_cliente}` : "Sin cliente"}
                      </div>
                      <div className="small mt-1">
                        <Badge bg="light" text="dark" className="border">
                          Mesa {pedido.id_mesa}
                        </Badge>
                      </div>
                    </Col>
                    <Col xs={4} className="text-end">
                      <div className="fw-bold text-success mb-1">
                        ${pedido.total?.toFixed(2) || "0.00"}
                      </div>
                      <Badge bg={obtenerColorEstado(pedido.estado)}>
                        {pedido.estado}
                      </Badge>
                      <div className="small text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                        {new Date(pedido.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>

                {tarjetaActiva && (
                  <div
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdTarjetaActiva(null);
                    }}
                    className="tarjeta-categoria-capa"
                  >
                    <div
                      className="d-flex gap-2 tarjeta-categoria-botones-capa"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                          abrirModalEdicion(pedido);
                          setIdTarjetaActiva(null);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          abrirModalEliminacion(pedido);
                          setIdTarjetaActiva(null);
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TarjetaPedido;

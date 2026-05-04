import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaExtra = ({
  extras,
  abrirModalEdicion,
  abrirModalEliminacion
}) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!(extras && extras.length >= 0));
  }, [extras]);

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

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <h5>Cargando extras...</h5>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : extras.length === 0 ? (
        <div className="text-center my-5">
          <p className="text-muted">No hay extras registrados.</p>
        </div>
      ) : (
        <div className="px-2">
          {extras.map((extra) => {
            const tarjetaActiva = idTarjetaActiva === extra.id_extra;

            return (
              <Card
                key={extra.id_extra}
                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-categoria-contenedor"
                onClick={() => alternarTarjetaActiva(extra.id_extra)}
                tabIndex={0}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    alternarTarjetaActiva(extra.id_extra);
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
                        <i className="bi bi-plus-circle text-muted fs-3"></i>
                      </div>
                    </Col>
                    <Col xs={6} className="text-start">
                      <div className="fw-bold text-truncate">
                        {extra.descripcion}
                      </div>
                      <div className="small text-muted mt-1">
                        Código: #{extra.id_extra}
                      </div>
                    </Col>
                    <Col xs={4} className="text-end px-3">
                      <div className="fw-bold text-dark fs-5">
                        ${extra.precio?.toFixed(2) || "0.00"}
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
                          abrirModalEdicion(extra);
                          setIdTarjetaActiva(null);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          abrirModalEliminacion(extra);
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

export default TarjetaExtra;

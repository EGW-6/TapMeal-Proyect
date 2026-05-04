import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaExtra = ({
  extras,
  abrirModalEdicion,
  abrirModalEliminacion
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (extras) {
      setLoading(false);
    }
  }, [extras]);

  return (
    <>
      {loading ? (
        <div className="text-center mt-4">
          <h4>Cargando extras...</h4>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : extras && extras.length === 0 ? (
        <div className="text-center mt-4">
          <p>No hay extras registrados.</p>
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm" className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Precio ($)</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {extras.map((extra) => (
              <tr key={extra.id_extra}>
                <td>{extra.id_extra}</td>
                <td>{extra.descripcion}</td>
                <td>${extra.precio?.toFixed(2) || "0.00"}</td>
                <td className="text-center">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="m-1"
                    onClick={() => abrirModalEdicion(extra)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(extra)}
                    title="Eliminar"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TablaExtra;
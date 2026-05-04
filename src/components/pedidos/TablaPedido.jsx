import React from "react";
import { Table, Spinner, Button, Card, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaPedido = ({
  pedidos,
  abrirModalEdicion, 
  abrirModalEliminacion
}) => {
  return (
    <>
      {pedidos && pedidos.length === 0 ? (
        <div className="text-center mt-4">
          <p>No hay pedidos registrados.</p>
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Mesa</th>
              <th>Estado</th>
              <th>Total</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id_pedido}>
                <td>{pedido.id_pedido}</td>
                <td>{new Date(pedido.fecha).toLocaleString()}</td>
                <td>
                  {pedido.Clientes 
                    ? `${pedido.Clientes.nombre_cliente} ${pedido.Clientes.apellido_cliente}`
                    : "N/A"}
                </td>
                <td>{pedido.Tipo_pedido ? pedido.Tipo_pedido.descripcion : "N/A"}</td>
                <td>{pedido.Mesas ? `Mesa ${pedido.Mesas.id_mesa}` : "N/A"}</td>
                <td>
                  <Badge bg={
                    pedido.estado === 'Completado' ? 'success' : 
                    pedido.estado === 'Cancelado' ? 'danger' : 
                    pedido.estado === 'En Preparación' ? 'info' : 
                    'warning'
                  }>
                    {pedido.estado}
                  </Badge>
                </td>
                <td>${pedido.total?.toFixed(2) || "0.00"}</td>
                <td className="text-center">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="m-1"
                    onClick={() => abrirModalEdicion(pedido)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button 
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(pedido)}
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

export default TablaPedido;
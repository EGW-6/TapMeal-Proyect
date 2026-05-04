import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionClientes = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  clienteEditar,
  manejoCambioInputEdicion,     
  actualizarCliente,
}) => {

  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarCliente();
    setDeshabilitado(false);
  };

  return (
    <Modal  
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre_cliente"
              value={clienteEditar.nombre_cliente || ""}
              onChange={manejoCambioInputEdicion}     
              placeholder="Ingresa el nombre"
            />
          </Form.Group>
        </Form>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido_cliente"
              value={clienteEditar.apellido_cliente || ""}
              onChange={manejoCambioInputEdicion}     
              placeholder="Ingresa el apellido"
            />
          </Form.Group>
        </Form>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={clienteEditar.telefono || ""}
              onChange={manejoCambioInputEdicion}     
              placeholder="Ingresa el número de telefono"
            />
          </Form.Group>
        </Form>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={clienteEditar.direccion || ""}
              onChange={manejoCambioInputEdicion}     
              placeholder="Ingresa la dirección"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={() => setMostrarModalEdicion(false)}
        >
          Cancelar
        </Button>
        <Button 
          variant="primary"
          onClick={handleActualizar}
          disabled={clienteEditar.nombre_cliente?.trim() === "" || deshabilitado}
        >
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionClientes;
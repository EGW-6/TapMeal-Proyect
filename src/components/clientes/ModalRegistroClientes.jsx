import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroClientes = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente, // Objeto con los datos del cliente
  manejoCambioInput,
  agregarCliente, // Función para insertar en la tabla Clientes
}) => {
  
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarCliente();
    setDeshabilitado(false);
  };

  // Validación básica: nombre y apellido son obligatorios
  const esInvalido = 
    !nuevoCliente.nombre_cliente?.trim() || 
    !nuevoCliente.apellido_cliente?.trim() || 
    deshabilitado;

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
      size="lg" // Lo hacemos un poco más ancho para los campos juntos
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nuevo Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_cliente"
                  value={nuevoCliente.nombre_cliente}
                  onChange={manejoCambioInput}
                  placeholder="Ej. Jude"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido_cliente"
                  value={nuevoCliente.apellido_cliente}
                  onChange={manejoCambioInput}
                  placeholder="Ej. Bellingham"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="tel"
              name="telefono"
              value={nuevoCliente.telefono}
              onChange={manejoCambioInput}
              placeholder="Ej. 8888-8888"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="direccion"
              value={nuevoCliente.direccion}
              onChange={manejoCambioInput}
              placeholder="Dirección completa del domicilio"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="dark" // Usamos negro para mantener el estilo de tu proyecto
          onClick={handleRegistrar}
          disabled={esInvalido}
        >
          {deshabilitado ? 'Guardando...' : 'Guardar Cliente'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroClientes;
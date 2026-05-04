import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroExtra = ({
  mostrarModal,
  setMostrarModal,
  nuevoExtra,
  manejoCambioInput,
  agregarExtra,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarExtra();
    setDeshabilitado(false);
  };

  const esValido = nuevoExtra.descripcion.trim() !== "" && nuevoExtra.precio >= 0;

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Extra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              name="descripcion"
              value={nuevoExtra.descripcion}
              onChange={manejoCambioInput}
              placeholder="Ej. Queso extra, Tocino..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio ($)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              name="precio"
              value={nuevoExtra.precio}
              onChange={manejoCambioInput}
              placeholder="0.00"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleRegistrar}
          disabled={!esValido || deshabilitado}
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroExtra;
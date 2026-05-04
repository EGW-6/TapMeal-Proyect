import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionExtra = ({
  mostrarModal,
  setMostrarModal,
  extraEditar,
  manejoCambioInput,
  actualizarExtra,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarExtra();
    setDeshabilitado(false);
  };

  const esValido = extraEditar.descripcion?.trim() !== "" && extraEditar.precio >= 0;

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Extra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              name="descripcion"
              value={extraEditar.descripcion}
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
              value={extraEditar.precio}
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
          onClick={handleActualizar}
          disabled={!esValido || deshabilitado}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionExtra;
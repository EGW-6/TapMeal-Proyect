import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionPedido = ({
  mostrarModal,
  setMostrarModal,
  pedido,
  eliminarPedido,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await eliminarPedido();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>Eliminar Pedido</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Está seguro que desea eliminar el pedido <strong>#{pedido?.id_pedido}</strong>?
        </p>
        <p className="text-muted small">Esta acción no se puede deshacer.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleEliminar} disabled={deshabilitado}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionPedido;
import React,{useState} from "react";
import {Modal, Form, Button, Row, Col} from "react-bootstrap"


const ModalRegistroPlatillos = ({
  mostrarModal,
  setMostrarModal,
  nuevoPlatillo,
  manejoCambioArchivo,
  agregarPlatillo,
  manejoCambioInput,
  categorias,
}) => {

  const [deshabilitado, setDeshabilitado] = useState(false);

    const handleAgregar = async () => {
      if (deshabilitado) return;
      setDeshabilitado(true);
      await agregarPlatillo()
      setDeshabilitado(false);
    }



  return(
    <Modal
    show={mostrarModal}
    onHide={()=>setMostrarModal(false)}
    backdrop= "static"
    centered
    size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Nuevo platillo</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>

            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría *</Form.Label>
                <Form.Select
                name="categoria_platillo"
                value={nuevoPlatillo.categoria_platillo || ""}
                onChange={manejoCambioInput}
                required
                >
                  <option value="">Seleccione...</option>
                  {categorias.map((cat)=>(
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </Form.Select>

              </Form.Group>
            </Col>

          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
                <Form.Control
                type="text"
                name="nombre_platillo"
                value={nuevoPlatillo.nombre_platillo || ""}
                onChange={manejoCambioInput}
                placeholder="Nombre del platillo"
                required
                />

            </Form.Group>
          </Col> 


          <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
            type="number"
            step="0.01"
            min="0"
            name="precio"
            value={nuevoPlatillo.precio || ""}
            onChange={manejoCambioInput}
            placeholder="precio"
            required
            />
          </Form.Group>
          </Col>

          <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label>Imagen del platillo *</Form.Label>
            <Form.Control
            type="file"
            accept="image/*"
            onChange={manejoCambioArchivo}
            required
            />
          </Form.Group>
          </Col>

          <Col xs={12}>
          <Form.Group className="mb-3">
            <Form-label>Descripción</Form-label>
            <Form.Control
            as="textarea"
            rows={5}
            name="descripcion"
            value={nuevoPlatillo.descripcion || ""}
            onChange={manejoCambioInput}
            placeholder="Descripción del platillo (opcional)"
            />
          </Form.Group>
          </Col>
          </Row>
        </Form>

      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>

        <Button variant="primary" onClick={handleAgregar} disabled= {deshabilitado}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>

  );
}


export default ModalRegistroPlatillos;
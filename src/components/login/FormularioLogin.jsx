import React from "react";
import { Form, Alert } from "react-bootstrap";

const FormularioLogin = ({ usuario, contrasena, error, setUsuario, setContrasena, iniciarSesion }) => {
  return (
    <div style={{
      minWidth: "320px",
      maxWidth: "400px",
      width: "100%",
      background: "white",
      borderRadius: "16px",
      padding: "36px 32px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* Ícono + Título */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "rgba(255,106,0,0.1)", color: "#ff6a00",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.6rem", margin: "0 auto 14px",
        }}>
          <i className="bi bi-person-fill" />
        </div>
        <h4 style={{ fontWeight: 800, color: "#0c0c2c", margin: 0 }}>Iniciar Sesión</h4>
        <p style={{ color: "#9ca3af", fontSize: "0.85rem", margin: "4px 0 0" }}>
          Ingresa tus credenciales para continuar
        </p>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="danger" style={{ borderRadius: 10, fontSize: "0.88rem" }}>
          <i className="bi bi-exclamation-circle me-2" />
          {error}
        </Alert>
      )}

      {/* Campos */}
      <Form>
        <Form.Group className="mb-3" controlId="usuario">
          <Form.Label style={{ fontWeight: 600, fontSize: "0.88rem", color: "#374151" }}>
            Correo electrónico
          </Form.Label>
          <div style={{ position: "relative" }}>
            <i className="bi bi-envelope" style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: "#9ca3af", fontSize: "1rem", zIndex: 1,
            }} />
            <Form.Control
              type="text"
              placeholder="correo@ejemplo.com"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              style={{
                paddingLeft: "38px", borderRadius: "10px",
                border: "1.5px solid #e5e7eb", fontSize: "0.92rem",
                height: "44px",
              }}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-4" controlId="contrasena">
          <Form.Label style={{ fontWeight: 600, fontSize: "0.88rem", color: "#374151" }}>
            Contraseña
          </Form.Label>
          <div style={{ position: "relative" }}>
            <i className="bi bi-lock" style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: "#9ca3af", fontSize: "1rem", zIndex: 1,
            }} />
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              style={{
                paddingLeft: "38px", borderRadius: "10px",
                border: "1.5px solid #e5e7eb", fontSize: "0.92rem",
                height: "44px",
              }}
            />
          </div>
        </Form.Group>

        <button
          type="button"
          onClick={iniciarSesion}
          style={{
            width: "100%", padding: "12px",
            background: "#0c0c2c", color: "white",
            border: "none", borderRadius: "10px",
            fontWeight: 700, fontSize: "0.95rem",
            cursor: "pointer", transition: "background 0.2s",
          }}
          onMouseEnter={e => e.target.style.background = "#1a1a4a"}
          onMouseLeave={e => e.target.style.background = "#0c0c2c"}
        >
          Iniciar Sesión
        </button>
      </Form>
    </div>
  );
};

export default FormularioLogin;
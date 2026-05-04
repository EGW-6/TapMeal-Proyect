import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Encabezado from "./components/navegacion/Encabezado";

import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";
import Productos from "./views/Platillos";
import Clientes from "./views/Clientes";
import Mesas from "./views/Mesas";
import Pedidos from "./views/Pedidos";
import Login from "./views/Login";
import RutaProtegida from "./components/rutas/RutaProtegida";
import Pagina404 from "./views/Pagina404";
import Extras from "./views/Extras";

import "./App.css";

// Componente interno para acceder a useLocation
const AppContenido = () => {
  const location = useLocation();
  const paginaPublica = location.pathname === "/" || location.pathname === "/login";

  return (
    <>
      <Encabezado />

      {/* Solo aplica el margen del sidebar en rutas protegidas */}
      <main className={paginaPublica ? "" : "margen-superior-main"}>
        <Routes>
          {/* Públicas */}
          <Route path="/"      element={<Inicio />} />
          <Route path="/login" element={<Login />} />

          {/* Protegidas */}
          <Route path="/categorias" element={<RutaProtegida><Categorias /></RutaProtegida>} />
          <Route path="/productos"  element={<RutaProtegida><Productos /></RutaProtegida>} />
          <Route path="/clientes"   element={<RutaProtegida><Clientes /></RutaProtegida>} />
          <Route path="/mesas"      element={<RutaProtegida><Mesas /></RutaProtegida>} />
          <Route path="/pedidos"    element={<RutaProtegida><Pedidos /></RutaProtegida>} />
          <Route path="/extras"     element={<RutaProtegida><Extras /></RutaProtegida>} />

          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContenido />
    </Router>
  );
};

export default App;
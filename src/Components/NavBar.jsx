import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import rioColor from "../rio_color.png";
import cart from "../utils/icons/cart.svg";
import { URL } from "../utils/config";
import { useAuth } from "./AuthContext";
import "../App.css";
import "../NavBar.css";

const NavBar = () => {
  const { role, setIsAuthenticated, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSession = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await fetch(URL + "/logout", {
        method: "POST",
        credentials: "include",
      }).then((res) => {
        if (res.ok) {
          setIsAuthenticated(false);
          navigate("/home");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/productos?search=${searchTerm}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        {/* Logo y Barra de Búsqueda */}
        <div className="d-flex align-items-center">
            <img
              src={rioColor}
              alt="Logo"
              style={{ width: "80px", height: "auto", marginRight:"10px" }}
              className="rounded-pill"
            />

          {/* Barra de búsqueda más pequeña */}
          <form className="d-flex" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "170px" }} 
            />
            <button className="btn btn-outline-light" type="submit">
              Buscar
            </button>
          </form>
        </div>

        {/* Botón de menú para móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links de navegación */}
        <div className="collapse navbar-collapse justify-content-center" id="collapsibleNavbar" style={{ marginRight:"250px" }}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/Productos" style={{ justifySelf:"initial" }}>Productos</Link>
            </li>
            {role === 1 && isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/Sucursales">Sucursales</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Clientes">Clientes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Empleados">Empleados</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Proveedores">Proveedores</Link>
                </li>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle" id="ventasDropdown">
                    Ventas
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="ventasDropdown">
                    <li><Link className="dropdown-item" to="/crear_ventas">Crear Venta</Link></li>
                    <li><Link className="dropdown-item" to="/ventas">Consultar Ventas</Link></li>
                  </ul>
                </li>
              </>
            )}
            {role === 2 && isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/Clientes">Clientes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Proveedores">Proveedores</Link>
                </li>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle" id="ventasDropdown">
                    Ventas
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="ventasDropdown">
                    <li><Link className="dropdown-item" to="/crear_ventas">Crear Venta</Link></li>
                    <li><Link className="dropdown-item" to="/ventas">Consultar Ventas</Link></li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Carrito + Botón de Sesión */}
        <div className="d-flex align-items-center navbar-nav">
          {isAuthenticated && (
            <li className="nav-item dropdown me-2">
              <button className="nav-link dropdown-toggle d-flex align-items-center" id="cartDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={cart} alt="cart" style={{ width: "30px", height: "30px" }} />
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="cartDropdown">
                <li><Link className="dropdown-item" to="/cartShop">Ver Carrito</Link></li>
              </ul>
            </li>
          )}

          {/* Botón de Inicio/Cierre de Sesión */}
          <li className="nav-item">
            <button className="btn btn-outline-light" onClick={handleSession}>
              {isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}
            </button>
          </li>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;





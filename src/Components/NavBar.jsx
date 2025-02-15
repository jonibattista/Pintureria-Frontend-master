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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <img
            src={rioColor}
            alt="Logo"
            style={{ width: "80px", height: "auto", marginRight: "10px" }}
            className="rounded-pill"
          />
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

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="collapsibleNavbar">
          <ul className="navbar-nav ms-auto text-start">
            <li className="nav-item">
              <Link className="nav-link" to="/Productos">Productos</Link>
            </li>
            {role >= 1 && isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/Sucursales">Sucursales</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Clientes">Clientes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Proveedores">Proveedores</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Usuarios">Usuarios</Link>
                </li>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle" id="ventasDropdown" data-bs-toggle="dropdown">
                    Ventas
                  </button>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/crear_ventas">Crear Venta</Link></li>
                    <li><Link className="dropdown-item" to="/ventas">Consultar Ventas</Link></li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="d-flex align-items-center">
          <li className="nav-item me-3">
            <Link to="/cartShop">
              <img src={cart} alt="cart" style={{ width: "30px", height: "30px" }} />
            </Link>
          </li>
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







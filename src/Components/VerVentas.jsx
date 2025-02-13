import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { URL } from "../utils/config";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

const VerVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [showRows, setShowRows] = useState(false);
  const [rowsSale, setRowsSale] = useState([]);

  useEffect(() => {
    const fetchData = async (endpoint, setState, storageKey) => {
      const local = getLocalStorage(storageKey);
      try {
        const res = await fetch(`${URL}/${endpoint}`, { credentials: "include" });
        const data = await res.json();
        if (!data) return setState(local.datos);
        setState(data);
        setLocalStorage(data, storageKey);
      } catch (error) {
        console.log(`Error al obtener ${storageKey}:`, error);
      }
    };

    fetchData("Sales", setVentas, "sales");
  }, []);

  const cargaFilasVenta = async (id) => {
    try {
      const res = await fetch(`${URL}/Rows/${id}`, { credentials: "include" });
      const data = await res.json();
      setRowsSale(data);
    } catch (error) {
      console.log("Error al cargar productos de venta", error);
    }
  };

  const deleteVenta = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta venta?")) return;
    try {
      await fetch(`${URL}/Sales/${id}`, { method: "DELETE" });
      setVentas(ventas.filter((v) => v.id !== id));
      setShowRows(false);
    } catch (error) {
      console.log("Error al eliminar la venta", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Listado de Ventas</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Empleado</th>
              <th>Sucursal</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length > 0 ? (
              ventas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.idClient}</td>
                  <td>{venta.idEmp}</td>
                  <td>{venta.idBranch}</td>
                  <td>{new Date(venta.createdAt).toLocaleDateString()}</td>
                  <td>${venta.total.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => deleteVenta(venta.id)}
                      className="btn btn-danger btn-sm me-2"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => {
                        cargaFilasVenta(venta.id);
                        setShowRows(!showRows);
                      }}
                      className="btn btn-info btn-sm"
                    >
                      {showRows ? "Cerrar" : "Ver Detalles"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">No hay ventas registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showRows && rowsSale.length > 0 && (
        <div className="mt-4">
          <h3 className="text-center">Detalles de Venta</h3>
          <table className="table table-bordered">
            <thead className="table-secondary">
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rowsSale.map((row) => (
                <tr key={row.id}>
                  <td>{row.description}</td>
                  <td>${row.price.toFixed(2)}</td>
                  <td>{row.amount}</td>
                  <td>${row.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VerVentas;

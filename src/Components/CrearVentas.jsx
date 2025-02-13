import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";
import { URL } from "../utils/config";
import BuscadorProd from "./BuscardorProd";

const CrearVentas = () => {
  const [saleProds, setSaleProds] = useState([]);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [message, setMessage] = useState("");
  const clienteRef = useRef(null);
  const empleadoRef = useRef(null);
  const sucursalRef = useRef(null);
  
  useEffect(() => {
    const fetchData = async (endpoint, setState, storageKey) => {
      const local = getLocalStorage(storageKey);
      try {
        const response = await fetch(`${URL}/${endpoint}`, { credentials: "include" });
        const data = await response.json();
        if (!data) return setState(local.datos);
        setState(data);
        setLocalStorage(data, storageKey);
      } catch (error) {
        console.error(`Error al obtener ${storageKey}:`, error);
      }
    };

    fetchData("Products", setProductos, "products");
    fetchData("Employees", setEmpleados, "employees");
    fetchData("Clients", setClientes, "clients");
    fetchData("Branches", setSucursales, "branches");
  }, []);

  const creatSale = async (e) => {
    e.preventDefault();
    const idClient = clienteRef.current.value;
    const idEmp = empleadoRef.current.value;
    const idBranch = sucursalRef.current.value;
    
    if (!idClient || !idEmp || !idBranch || saleProds.length === 0) {
      return setMessage("Por favor, complete todos los campos y agregue productos.");
    }

    const total = saleProds.reduce((sum, prod) => sum + prod.price * prod.amount, 0);
    const newSale = { idClient, idBranch, idEmp, total, saleProds };

    try {
      await fetch(`${URL}/Sales`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSale),
      });
      setMessage("Venta creada exitosamente");
      setSaleProds([]);
      resetForm();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error al crear la venta", error);
      setMessage("Error al registrar la venta");
    }
  };

  const resetForm = () => {
    if (clienteRef.current) clienteRef.current.value = "";
    if (empleadoRef.current) empleadoRef.current.value = "";
    if (sucursalRef.current) sucursalRef.current.value = "";
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4"style={{marginTop:"70px"}}>Registrar Nueva Venta</h2 >
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={creatSale} className="card p-4 shadow-sm">
        <div className="row">
          <div className="col-md-4">
            <label className="form-label">Cliente</label>
            <select ref={clienteRef} className="form-select" required>
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>{cliente.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Empleado</label>
            <select ref={empleadoRef} className="form-select" required>
              <option value="">Seleccione un empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado.id} value={empleado.id}>{empleado.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Sucursal</label>
            <select ref={sucursalRef} className="form-select" required>
              <option value="">Seleccione una sucursal</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id}>{sucursal.address}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <BuscadorProd saleProds={saleProds} setSaleProds={setSaleProds} productos={productos} />
        </div>

        <div className="table-responsive mt-4">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {saleProds.map((prod) => (
                <tr key={prod.idProduct}>
                  <td>{prod.idProduct}</td>
                  <td>{prod.description}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={prod.amount}
                      onChange={(e) => setSaleProds((prev) => prev.map((s) => s.idProduct === prod.idProduct ? { ...s, amount: e.target.value } : s))}
                    />
                  </td>
                  <td>${prod.price.toFixed(2)}</td>
                  <td>${(prod.price * prod.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className="btn btn-primary mt-3">Guardar Venta</button>
      </form>
    </div>
  );
};

export default CrearVentas;


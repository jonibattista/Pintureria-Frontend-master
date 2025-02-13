import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { URL } from "../utils/config";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [message, setMessage] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);

  useEffect(() => {
    const fetchBranches = async () => {
      const local = getLocalStorage("branches");
      try {
        const res = await fetch(URL + "/Branches", { credentials: "include" });
        const data = await res.json();
        setSucursales(data || local.datos);
        setLocalStorage(data, "branches");
      } catch (error) {
        setSucursales(local.datos);
      }
    };
    fetchBranches();
  }, []);

  const createSucursal = async (event) => {
    event.preventDefault();
    const address = direccionRef.current?.value;
    const phone = Number(telefonoRef.current?.value);
    if (phone && address) {
      const newBranch = { address, phone };
      try {
        const res = await fetch(URL + "/Branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBranch),
        });
        if (res.ok) {
          const completeBranch = await res.json();
          setSucursales([...sucursales, completeBranch]);
          setLocalStorage([...sucursales, completeBranch], "branches");
          resetForm();
          setMessage("Sucursal creada correctamente");
          setTimeout(() => setMessage(null), 3000);
        }
      } catch (error) {
        setMessage("Error en la solicitud");
      }
    } else {
      setMessage("Todos los campos deben estar completos");
      setTimeout(() => setMessage(null), 3000);
    }
    setFormVisible(false);
  };

  const toggleFormVisibility = () => setFormVisible(!formVisible);

  const resetForm = () => {
    if (direccionRef.current) direccionRef.current.value = "";
    if (telefonoRef.current) telefonoRef.current.value = "";
  };

  const deleteSucursal = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta sucursal?")) {
      try {
        await fetch(URL + `/Branches/${id}`, { method: "DELETE" });
        const updatedSucursales = sucursales.filter((s) => s.id !== id);
        setSucursales(updatedSucursales);
        setLocalStorage(updatedSucursales, "branches");
      } catch (error) {
        setMessage("Error al eliminar la sucursal");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-primary" onClick={toggleFormVisibility} style={{marginTop:"20px"}}>
          {formVisible ? "Cancelar" : "Crear Sucursal"}
        </button>
      </div>

      {formVisible && (
        <div className="card p-4 shadow-sm mb-4">
          <form onSubmit={createSucursal}>
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input type="text" ref={direccionRef} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input type="text" ref={telefonoRef} className="form-control" required />
            </div>
            <button type="submit" className="btn btn-success w-100">Guardar</button>
          </form>
        </div>
      )}

      {message && <div className="alert alert-info">{message}</div>}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sucursales.length > 0 ? (
              sucursales.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.address}</td>
                  <td>{s.phone}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteSucursal(s.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">No hay sucursales registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sucursales;


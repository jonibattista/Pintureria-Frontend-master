import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { URL } from "../utils/config";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [message, setMessage] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const nombreRef = useRef(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);
  const cuitRef = useRef(null);

  useEffect(() => {
    const fetchSupp = async () => {
      const local = getLocalStorage("branches");
      try {
        const res = await fetch(URL + "/Suppliers", { credentials: "include" });
        const data = await res.json();
        setProveedores(data || local.datos);
        setLocalStorage(data, "suppliers");
      } catch (error) {
        setProveedores(local.datos);
      }
    };
    fetchSupp();
  }, []);

  const searchSupp = (cuit) => proveedores.find((p) => p.cuit === cuit);

  const createUpdateSupp = async (event) => {
    event.preventDefault();
    const name = nombreRef.current?.value;
    const address = direccionRef.current?.value;
    const phone = Number(telefonoRef.current?.value);
    const cuit = Number(cuitRef.current?.value);
    
    if (name && cuit) {
      if (!searchSupp(cuit)) {
        const newSupp = { name, address, phone, cuit };
        try {
          const res = await fetch(URL + "/Suppliers", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSupp),
          });
          if (res.ok) {
            const completeSupp = await res.json();
            setProveedores([...proveedores, completeSupp]);
            setLocalStorage([...proveedores, completeSupp], "suppliers");
            resetForm();
            setMessage("Proveedor creado correctamente");
            setTimeout(() => setMessage(null), 3000);
          }
        } catch (error) {
          console.log(error);
        }
      } else console.log("CUIT/CUIL ya registrado");
    } else console.log("Error al crear o actualizar proveedor");
    setFormVisible(false);
  };

  const toggleFormVisibility = () => setFormVisible(!formVisible);
  
  const resetForm = () => {
    nombreRef.current.value = "";
    direccionRef.current.value = "";
    telefonoRef.current.value = "";
    cuitRef.current.value = "";
  };

  const deleteProveedor = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este proveedor?")) {
      await fetch(URL + `/Suppliers/${id}`, { method: "DELETE", credentials: "include" });
      setProveedores(proveedores.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="container mt-5" >
      <button onClick={toggleFormVisibility} className="btn btn-primary mb-3" style={{marginTop:"20px"}}>
        {formVisible ? "Cancelar" : "Crear Proveedor"}
      </button>
      {formVisible && (
        <form onSubmit={createUpdateSupp} className="card p-3 shadow-sm">
          <div className="mb-3">
            <label className="form-label">Nombre:</label>
            <input type="text" ref={nombreRef} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">CUIT/CUIL:</label>
            <input type="text" ref={cuitRef} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Dirección:</label>
            <input type="text" ref={direccionRef} className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono:</label>
            <input type="text" ref={telefonoRef} className="form-control" />
          </div>
          <button type="submit" className="btn btn-success">Guardar</button>
        </form>
      )}
      {message && <div className="alert alert-info mt-3">{message}</div>}
      <h2 className="mt-4">Listado de Proveedores</h2>
      <table className="table table-striped table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>CUIT/CUIL</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.length > 0 ? (
            proveedores.map((prov) => (
              <tr key={prov.id}>
                <td>{prov.id}</td>
                <td>{prov.name}</td>
                <td>{prov.cuit}</td>
                <td>{prov.phone}</td>
                <td>{prov.address}</td>
                <td>
                  <button onClick={() => deleteProveedor(prov.id)} className="btn btn-danger btn-sm">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No hay proveedores registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Proveedores;


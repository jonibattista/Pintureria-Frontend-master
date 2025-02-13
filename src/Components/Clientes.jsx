import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { URL } from "../utils/config";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [prevValue, setPrevValue] = useState(null);
  const nombreRef = useRef(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);
  const dniRef = useRef(null);

  useEffect(() => {
    const fetchClients = async () => {
      const local = getLocalStorage("clients");
      try {
        const res = await fetch(URL + "/Clients", { credentials: "include" });
        const data = await res.json();
        if (!data) return setClientes(local?.datos || []);
        setClientes(data);
        setLocalStorage(data, "clients");
      } catch (error) {
        console.log(error);
        setClientes(local?.datos || []);
      }
    };
    fetchClients();
  }, []);

  const searchClient = (dni) => clientes.find((c) => c.dni === dni);

  const createClient = async (event) => {
    event.preventDefault();
    const name = nombreRef.current?.value;
    const address = direccionRef.current?.value;
    const phone = Number(telefonoRef.current?.value);
    const dni = Number(dniRef.current?.value);
    if (name && dni) {
      if (!searchClient(dni)) {
        const newClient = { name, address, phone, dni };
        try {
          const res = await fetch(URL + "/Clients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newClient),
          });
          if (res.ok) {
            const completeClient = await res.json();
            setClientes([...clientes, completeClient]);
            setLocalStorage([...clientes, completeClient], "clients");
            resetForm();
            setMessage("Cliente creado exitosamente");
            setTimeout(() => setMessage(null), 3000);
          }
        } catch (error) {
          console.log(error);
        }
      } else setMessage("DNI ya registrado");
    }
    setFormVisible(false);
  };

  const toggleFormVisibility = () => setFormVisible(!formVisible);

  const resetForm = () => {
    [nombreRef, direccionRef, telefonoRef, dniRef].forEach(ref => ref.current && (ref.current.value = ""));
  };

  const deleteCliente = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      try {
        await fetch(URL + `/Clients/${id}`, { method: "DELETE" });
        const updatedClients = clientes.filter((client) => client.id !== id);
        setClientes(updatedClients);
        setLocalStorage(updatedClients, "clients");
      } catch (error) {
        setMessage("Error al eliminar cliente");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <button onClick={toggleFormVisibility} className="btn btn-primary" style={{marginTop:"20px"}}>
          {formVisible ? "Cancelar" : "Crear Cliente"}
        </button>
      </div>
      {message && <div className="alert alert-success">{message}</div>}
      {formVisible && (
        <div className="card shadow p-4 mb-4">
          <h4 className="mb-3">Nuevo Cliente</h4>
          <form onSubmit={createClient}>
            <div className="mb-3">
              <label className="form-label">Nombre:</label>
              <input type="text" ref={nombreRef} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">DNI:</label>
              <input type="text" ref={dniRef} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Dirección:</label>
              <input type="text" ref={direccionRef} className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono:</label>
              <input type="text" ref={telefonoRef} className="form-control" />
            </div>
            <button type="submit" className="btn btn-success w-100">Guardar Cliente</button>
          </form>
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.name}</td>
                  <td>{cliente.dni}</td>
                  <td>{cliente.address}</td>
                  <td>{cliente.phone}</td>
                  <td>
                    <button onClick={() => deleteCliente(cliente.id)} className="btn btn-danger btn-sm">Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">No hay clientes registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clientes;


import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { URL } from "../utils/config";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [message, setMessage] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [editingField, setEditingField] = useState({ id: null, field: "" });
  const nombreRef = useRef(null);
  const sueldoRef = useRef(null);
  const telefonoRef = useRef(null);
  const dniRef = useRef(null);

  useEffect(() => {
    const fetchEmp = async () => {
      const local = getLocalStorage("employees");
      try {
        await fetch(URL + "/Employees", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setEmpleados(local.datos);
            setLocalStorage(data, "employees");
            setEmpleados(data);
          });
      } catch (error) {
        setEmpleados(local.datos);
      }
    };

    fetchEmp();
  }, []);

  const createEmp = async (event) => {
    event.preventDefault();
    const name = nombreRef.current?.value;
    const salary = Number(sueldoRef.current?.value);
    const phone = Number(telefonoRef.current?.value);
    const dni = Number(dniRef.current?.value);
    if (name && dni && salary) {
      const existingEmp = empleados.find((e) => e.dni === dni);
      if (!existingEmp) {
        const newEmp = { name, salary, phone, dni };
        try {
          const res = await fetch(URL + "/Employees", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEmp),
          });
          if (res.ok) {
            const completeEmp = await res.json();
            setEmpleados([...empleados, completeEmp]);
            setLocalStorage(empleados, "employees");
            resetForm();
            setMessage("Empleado creado con éxito");
            setTimeout(() => setMessage(null), 3000);
          }
        } catch (error) {
          console.log(error);
        }
      } else setMessage("DNI ya registrado");
    } else {
      setMessage("Todos los campos deben estar completos");
      setTimeout(() => setMessage(null), 3000);
    }
    setFormVisible(false);
  };

  const toggleFormVisibility = () => setFormVisible(!formVisible);

  const resetForm = () => {
    nombreRef.current.value = "";
    sueldoRef.current.value = "";
    telefonoRef.current.value = "";
    dniRef.current.value = "";
  };

  return (
    <div className="container mt-5">
      <button onClick={toggleFormVisibility} className="btn btn-primary mb-3"  style={{marginTop:"20px"}}>
        {formVisible ? "Cancelar" : "Crear Empleado"}
      </button>
      {formVisible && (
        <div className="card p-4 mb-4">
          <h3 className="text-center">Registro de Empleado</h3>
          <form onSubmit={createEmp}>
            <div className="mb-3">
              <label className="form-label">Nombre:</label>
              <input type="text" ref={nombreRef} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">DNI:</label>
              <input type="text" ref={dniRef} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Sueldo:</label>
              <input type="number" ref={sueldoRef} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono:</label>
              <input type="text" ref={telefonoRef} className="form-control" />
            </div>
            <button type="submit" className="btn btn-success w-100">Guardar</button>
          </form>
        </div>
      )}
      {message && <div className="alert alert-info">{message}</div>}
      <div className="table-responsive">
        <h2>Listado de Empleados</h2>
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Sueldo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.length > 0 ? (
              empleados.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.dni}</td>
                  <td>{emp.salary}</td>
                  <td>{emp.phone}</td>
                  <td>
                    <button className="btn btn-danger btn-sm">Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">No hay empleados registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Empleados;

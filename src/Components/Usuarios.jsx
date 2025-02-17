import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./AuthContext";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [message, setMessage] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const passRef = useRef(null);
  const roleRef = useRef(null);
  const userNameRef = useRef(null);
  const emailRef = useRef(null);
  const {id} = useAuth()

  // Obtener usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await fetch(process.env.REACT_APP_API_URL + "/users",{credentials: "include"})
          .then((res) => res.json())
          .then((data) => {
            if (!data) return
            const list = data.filter((u) => u.id !== id) //saca de la lista al usuario admin que esta en uso
            setUsuarios(list);
          });
      } catch (error) {
        console.log("error en la peticion")
      }
    };
    if(id){
      fetchUsers();
    } 
  }, [id]);

  const searchUser = (userName, email) => {
    const existingMail = usuarios.find((s) => s.userName === userName);
    const existingName = usuarios.find((s) => s.email === email);
    if(existingMail) return existingMail
    if(existingName) return existingName
    return false
  };

  // Crear usuario
  const createUser = async (event) => {
    event.preventDefault();
    const userName = userNameRef.current?.value;
    const pswHash = passRef.current?.value;
    const email = emailRef.current?.value;
    const role = roleRef.current?.value;
    if (userName && pswHash && email && role) {
      const existingUser = searchUser(userName, email);
      if (!existingUser) {
        const newUser = {
          userName:userName,
          email: email,
          pswHash:pswHash,
          role:role,
        };

        try {
          const res = await fetch(process.env.REACT_APP_API_URL + "/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          });
          if (res.ok) {
            const completeUsers = await res.json();
            setUsuarios([...usuarios, completeUsers]); // Actualiza la lista de usuarios con el nuevo
            resetForm();
            setMessage("Sucursal creada correctamente");
            setTimeout(() => setMessage(null), 3000);
          }
        } catch (error) {
          setMessage("Error en la solicitud");
        }
      } else setMessage("El Usuario ya existe");
    } else {
      setMessage("Todos los campos deben estar completos");
      setTimeout(() => setMessage(null), 3000);
    }
    setFormVisible(false);
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  // Limpiar formulario
  const resetForm = () => {
    if (userNameRef.current) userNameRef.current.value = "";
    if (passRef.current) passRef.current.value = "";
    if (emailRef.current)emailRef.current.value = "";
    if (roleRef.current) roleRef.current.value = "";
  };

  // Función para eliminar sucursal
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar esta sucursal?"
    );
    if (confirmDelete) {
      try {
        await fetch(process.env.REACT_APP_API_URL + `/users/${id}`, {
          method: "DELETE",
        });
        const updatedSucursales = usuarios.filter(
          (usuario) => usuario.id !== id
        );
        setUsuarios(updatedSucursales);
      } catch (error) {
        setMessage("Error al eliminar el usuario");
      }
    }
  };

  const handleDoubleClick = (id, field, value) => {
    setEditingField({ id, field });
    setPrevValue(value);
  };

  const handleFieldChange = (id, field, value) => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario.id === id ? { ...usuario, [field]: value } : usuario
      )
    );
  };

  const handleBlur = async (id, field, value) => {
    const data = { [field]: value };
    if (field === "userName" || field === "email" ) {
      const existingUser = searchUser(value);
      if (existingUser && existingUser.id !== id) {
        alert("El nombre de usuario ya existe.");
        setUsuarios((prevSucursales) =>
          prevSucursales.map((sucursal) =>
            sucursal.id === id ? { ...sucursal, [field]: prevValue } : sucursal
          )
        );
        return setPrevValue(null);
      }
    }
    try
     {
      await fetch(process.env.REACT_APP_API_URL + `/users/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setEditingField({ id: null, field: null });
    } catch (error) {
      setMessage("Error en la solicitud");
    }
  };

  const input = (suc, field, value) => {
    return (
      <td
        onDoubleClick={() => handleDoubleClick(suc.id, field, value)}
        title="Doble click para editar"
      >
        {editingField.id === suc.id && editingField.field === field ? (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(suc.id, field, e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleBlur(suc.id, field, value);
              }
            }}
            autoFocus
          />
        ) : (
          value
        )}
      </td>
    );
  };

  return (
    <div style={{ marginTop: "5%" }}>
      <div className="btn-group">
        <button
          id="b_create"
          onClick={toggleFormVisibility}
          type="button"
          className="btn btn-primary"
        >
          {formVisible ? "Cancelar" : "Crear nuevo usuario"}
        </button>
      </div>

      {/* Formulario visible para crear o editar sucursal */}
      {formVisible && (
        <form
          id="userForm"
          onSubmit={createUser}
          style={{ marginBottom: "3%" }}
        >
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">
              Nombre de usuario:
            </label>
            <input
              type="text"
              ref={userNameRef}
              name="userName"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña:
            </label>
            <input
              type="password"
              ref={passRef}
              name="password"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo electronico:
            </label>
            <input
              type="email"
              ref={emailRef}
              name="email"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role:
            </label>
            <select
              id="role"
              ref={roleRef}
              name="role"
              className="form-control"
              required
            >
              <option value="">Elija un role</option>
              <option value="1">Administrador</option>
              <option value="2">Vendedor</option>
              <option value="3">Cliente</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Crear usuario
          </button>
        </form>
      )}
      {message && <div className="alert alert-info">{message}</div>}

      {/* Tabla de Sucursales */}
      <div className="table-responsive" style={{ marginTop: "3%" }}>
        <h2>Listado de Usuarios</h2>
        <table className="table table-bordered" id="sucursalTable">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre de usuario</th>
              <th>Correo electronico</th>
              <th>Role</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{input(usuario, "userName", usuario.userName)}</td>
                  <td>{input(usuario, "email", usuario.email)}</td>
                  <td>
                    <select
                      id="role"
                      value={usuario.role}
                      name="role"
                      className="form-control"
                      onChange={handleBlur}
                      required
                    >
                      <option value="1">Administrador</option>
                      <option value="2">Vendedor</option>
                      <option value="3">Cliente</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteUser(usuario.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No hay usuarios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;

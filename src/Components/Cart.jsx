import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Producto 1", quantity: 1, price: 100 },
    { id: 2, name: "Producto 2", quantity: 1, price: 200 },
  ]);

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    alert("Procediendo al pago");
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="text-center mb-4">🛒 Carrito de Compras</h2>
        {cartItems.length > 0 ? (
          <ul className="list-group">
            {cartItems.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{item.name}</h5>
                  <p className="text-muted">Precio: ${item.price}</p>
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    min="1"
                    style={{ maxWidth: "80px" }}
                  />
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(item.id)}>
                  ❌
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted">El carrito está vacío 🛍️</p>
        )}
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-secondary" onClick={() => navigate("/productos")}>
            🔙 Seguir Comprando
          </button>
          {cartItems.length > 0 && (
            <button className="btn btn-success" onClick={handleCheckout}>
              💳 Pagar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

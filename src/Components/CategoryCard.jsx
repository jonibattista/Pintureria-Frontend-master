import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Importa las imágenes de cada categoría
import latex from "../utils/images/latex.jpg";
import pintura from "../utils/images/pintura.jpg";
import herramientas from "../utils/images/herramientas.jpg";

// Mapea cada categoría con su imagen
const categoryImages = {
  1: latex,
  2: pintura,
  3: herramientas,
};

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products?category=${category.id}`);
  };

  return (
    <div 
      className="card" 
      style={{ 
        width: "200px",  
        margin: "10px", 
        textAlign: "center",
        cursor: "pointer" 
      }} 
      onClick={handleClick}
    >
      <img 
        src={categoryImages[category.id] || latex} // Imagen por defecto
        className="card-img-top" 
        alt={category.description} 
        style={{
          width: "200px",  
          height: "150px",
          objectFit: "cover",
          margin: "auto", 
          display: "block", 
        }} 
      />
      <div className="card-body">
        <h5 className="card-title">{category.description}</h5>
      </div>
    </div>
  );
};

export default CategoryCard;


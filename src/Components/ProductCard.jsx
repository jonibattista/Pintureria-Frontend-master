import React from "react";
import { Card, Button } from "react-bootstrap";
import latex from "../utils/images/latex.jpg";
import { useNavigate } from "react-router";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/productPage?idProd=${product.id}`);
      };
  return (
    <Card
      style={{ width: "18rem", cursor: "pointer" }}
      onClick={handleClick}
    >
      {/* <Card.Img variant="top" src={product.image} /> */}
      <Card.Img variant="top" src={latex} />
      <Card.Body>
        {/* <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>${product.price}</Card.Text> */}
        <Card.Title>{product.description}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text>${product.price}</Card.Text>
        {/* <Button variant="primary">Agregar al carrito</Button> */}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

import React, { useEffect, useState } from 'react';
import NavBar from './Components/NavBar';
import Carousel from 'react-bootstrap/Carousel';
import frente from "./utils/images/frente.jpg"
import carru2 from "./utils/images/carru2.jpg"
import carru3 from "./utils/images/carru3.jpg"
import CategoryCard from './Components/CategoryCard';
import { getLocalStorage,setLocalStorage } from './utils/localStorage';
import { URL } from './utils/config';
import './App.css';

/**
 * Componente Home que obtiene y muestra categorías junto con un carrusel y una barra de navegación.
 *
 * @component
 * @example
 * return (
 *   <Home />
 * )
 * @returns {JSX.Element} El componente renderizado.
 *
 * @description
 * Este componente obtiene datos de categorías de un servidor remoto y los almacena en el almacenamiento local.
 * Muestra una barra de navegación, un carrusel con tres diapositivas y una lista de tarjetas de categoría.
 *
 * @function
 * @name Home
 */
function Home() {
  const [categorias, setcategorias]= useState([]) 

  useEffect(()=>{
    const fetchcat = async () => {
          const local = getLocalStorage("category");
          try {
            const res = await fetch(URL + "/category", { credentials: "include" });
            const data = await res.json();
            if (!Array.isArray(data)) {
              console.warn("La API no devolvió un array, usando datos locales.");
              return setcategorias(local?.datos || []); // Fallback a datos locales o array vacío
      }
      setcategorias(data);
      setLocalStorage(data, "category");
          } catch (error) {
            console.log("Error al obtener categorías:",error);
            setcategorias(local?.datos || []); // Fallback en caso de error
          }
        };
      fetchcat()
  },[])

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      textAlign: "center",
      width: "100%", 
    }}>
      <NavBar />
    
      <Carousel
        style={{
          maxHeight: "500px",
          marginTop: "8%",
          backgroundColor: "black",
          width: "80%", // ✅ Hace que el carrusel no sea demasiado ancho
        }}
      >
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={frente}
            alt="First slide"
            style={{ height: "500px", objectFit: "cover", background: "white" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={carru2}
            alt="Second slide"
            style={{ height: "500px", objectFit: "cover", background: "white" }}
          />
          <Carousel.Caption style={{top: "50%", transform: "translateY(-50%)"}}>
            <h3>Primer Slide</h3>
            <p>Este es un texto de ejemplo para la primera imagen.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={carru3}
            alt="Third slide"
            style={{ height: "500px", objectFit: "contain", background: "white" }}
          />
        </Carousel.Item>
      </Carousel>
    
      <div
        style={{display: "flex", flexWrap: "wrap", justifyContent: "center" }} >
        {categorias.map((category, index) => (
          <div key={index} style={{ margin: "10px", cursor: "pointer" }}>
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </div>
    
  );
}

export default Home;





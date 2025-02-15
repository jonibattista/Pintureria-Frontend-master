import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';
import { URL } from '../utils/config';
import '../utils/styles/ViewProducts.css';

const ViewProducts = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const [filteredProds, setFilteredProds] = useState([]);
  const [cat, setCat] = useState(category);
  const [productos, setProductos] = useState([]);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchProd = async () => {
      const local = getLocalStorage("products");
      try {
        const res = await fetch(`${URL}/Products`, { credentials: "include" });
        const data = await res.json();
        if (data?.length) {
          setProductos(data);
          setFilteredProds(data);
          setLocalStorage(data, "products");
        } else if (local) {
          setProductos(local.datos);
        }
      } catch (error) {
        console.log(error);
        if (local) setProductos(local.datos);
      }
    };
    
    const fetchCat = async () => {
      const local = getLocalStorage("category");
      try {
        const res = await fetch(`${URL}/category`, { credentials: "include" });
        const data = await res.json();
        if (data) {
          setCategorias(data);
          setLocalStorage(data, "category");
        } else if (local) {
          setCategorias(local.datos);
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    fetchProd();
    fetchCat();
  }, []);

  useEffect(() => {
    handleFilteredProds();
  }, [cat, productos]);

  const handleFilteredProds = () => {
    const prods = cat ? productos.filter((p) => p.idCat === Number(cat)) : productos;
    setFilteredProds(prods);
    setMaxMin(prods);
  };

  const setMaxMin = (prods) => {
    if (prods.length === 0) {
      setMax(0);
      setMin(0);
      return;
    }
    setMax(Math.max(...prods.map(p => p.price)));
    setMin(Math.min(...prods.map(p => p.price)));
  };

  return (
    <div className="view-products-container">
      <aside className="filters">
        <h2>Filtrar Productos</h2>
        <div>
          <label>Categoría:</label>
          <select onChange={(e) => setCat(e.target.value)} value={cat || ""}>
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.description}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Precio</label>
          <p>Min: {min}</p>
          <input
            type="range"
            min={min}
            max={max}
            step={0.1}
            onChange={(e) => {
              const maxPrice = e.target.value;
              setFilteredProds(productos.filter(p => p.price <= maxPrice && (!cat || p.idCat === Number(cat))));
            }}
          />
          <p>Max: {max}</p>
        </div>
      </aside>
      <main className="products">
        <h1>Productos</h1>
        {cat && <p>Mostrando productos para la categoría: {cat}</p>}
        {filteredProds.length > 0 ? (
          filteredProds.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </main>
    </div>
  );
};

export default ViewProducts;


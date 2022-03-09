import axios from "axios";
import { useEffect, useState } from "react";
import server from "../../util/server";
import "./Category.scss";
import Product from "./Product";

function Category({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    const filter = category.name;
    try {
      const productList = await axios.get(`${server}/product/find/${filter}`);
      setProducts(productList.data);
    } catch (err) {
      console.log(err);
    }
  }

  function renderProducts() {
    return products.map((product) => {
      return <Product key={product._id} product={product} />;
    });
  }

  return (
    <div className="category container">
      <h1>{category.name}</h1>
      <div className="single-category">
        <div>{renderProducts()}</div>
        <img src={category.image} alt={category.name} />
      </div>
    </div>
  );
}

export default Category;

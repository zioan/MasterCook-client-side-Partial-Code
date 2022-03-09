import axios from "axios";
import { useEffect, useState } from "react";
import server from "../../util/server";
import CategorySelector from "./CategorySelector";
import "./NewItemsStyle.scss";
import toDecimal from "../../util/toDecimal";

function NewProduct() {
  //set product data
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);

  //get list of products for editing
  const [products, setProducts] = useState([]);

  //set data for product update
  const [addNewProductStatus, setAddNewProductStatus] = useState(false);
  const [productId, setProductId] = useState("");

  async function saveProduct(e) {
    e.preventDefault();

    const productData = {
      name: name,
      number: number,
      description: description,
      category: category,
      price: price,
    };
    if (!addNewProductStatus) {
      //Add new product
      try {
        await axios.post(`${server}/product`, productData);
      } catch (err) {
        console.log(err);
      }
    }

    if (addNewProductStatus) {
      //Update existing product
      try {
        await axios.put(`${server}/product/${productId}`, productData);
      } catch (err) {
        console.log(err);
      }
    }

    clearInput();
    getProducts();
  }

  function adminSelectedCategory(selectedCategory) {
    setCategory(selectedCategory);
  }

  function clearInput() {
    setAddNewProductStatus(false);
    setProductId("");

    setName("");
    setNumber("");
    setDescription("");
    setCategory("");
    setPrice("");
  }

  //edit products
  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    renderProducts();
  }, [products]);

  async function getProducts() {
    try {
      const productList = await axios.get(`${server}/product`);
      setProducts(productList.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function editProduct(product) {
    setAddNewProductStatus(true);
    setProductId(product._id);

    setName(product.name);
    setNumber(product.number);
    setDescription(product.description);
    setCategory(product.category);
    setPrice(product.price);

    window.scrollTo({ left: 0, top: 158 });
  }

  async function deleteProduct(id, name) {
    if (window.confirm(`Are you sure you want to delete ${name}`)) {
      await axios
        .delete(`${server}/product/${id}`)
        .then(getProducts())
        .catch((err) => console.log(err));
    }
  }

  function renderProducts() {
    return products.map((product) => {
      return (
        <div key={product._id}>
          <h3>
            {" "}
            {product.number} - {product.name}
          </h3>
          <div className="single-product">
            <p>
              <span>Description</span>: {product.description}
            </p>
            <p>
              <span>Category</span>: {product.category}{" "}
            </p>
            <p>
              <span>Price</span>: &euro;
              {toDecimal(product.price)}
            </p>
          </div>
          <button
            className="product-editor"
            onClick={() => editProduct(product)}
          >
            Edit
          </button>
          <button
            className="product-editor"
            onClick={() => deleteProduct(product._id, product.name)}
          >
            Delete
          </button>
          <hr />
        </div>
      );
    });
  }

  return (
    <div className="new-product ">
      <div className="product-editor box">
        <h2 className="margin-bottom">
          {addNewProductStatus ? "Edit Product" : "Add new product"}
        </h2>
        <form onSubmit={saveProduct}>
          <input
            type="text"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Product unique number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <textarea
            cols="30"
            rows="10"
            placeholder="Product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <label>Select a category</label>
          <CategorySelector adminSelectedCategory={adminSelectedCategory} />
          <label>Category</label>
          <input
            type="text"
            disabled
            placeholder="Select a category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <label htmlFor="price">Price &euro;</label>
          <input
            type="number"
            step=".01"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button type="submit">
            {addNewProductStatus ? "Update Product" : "Add new product"}
          </button>
          <button onClick={clearInput}>Clear All</button>
        </form>
      </div>
      <div className="product-list box">
        <h2 className="margin-bottom">Edit Products</h2>
        {renderProducts()}
      </div>
    </div>
  );
}

export default NewProduct;

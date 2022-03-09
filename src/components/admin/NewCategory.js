import axios from "axios";
import { useEffect, useState } from "react";
import server from "../../util/server";
import noImage from "../../files/noImageSelected.jpg";
import "./NewItemsStyle.scss";

function NewCategory() {
  //
  const [name, setName] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [images, setImages] = useState([]);

  //get list of categories for editing
  const [categories, setCategories] = useState([]);

  //set data for category update
  const [addNewCategoryStatus, setAddNewCategoryStatus] = useState(false);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    getImages();
  }, []);

  async function saveCategory(e) {
    e.preventDefault();

    const categoryData = {
      name: name,
      image: imagePath,
    };
    if (!addNewCategoryStatus) {
      //Add new category
      try {
        await axios.post(`${server}/category`, categoryData);
      } catch (err) {
        console.log(err);
      }
    }
    if (addNewCategoryStatus) {
      //Update existing category
      try {
        await axios.put(`${server}/category/${categoryId}`, categoryData);
      } catch (err) {
        console.log(err);
      }
    }

    clearInput();
    getCategories();
  }

  async function getImages() {
    setImages([]);
    try {
      const imagesData = await axios.get(`${server}/image`);

      setImages(imagesData.data);
      // renderImages();
    } catch (err) {
      console.log(err);
    }
  }

  function clearInput() {
    setAddNewCategoryStatus(false);
    setCategoryId("");

    setName("");
    setImagePath("");
  }

  //edit category
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    renderCategories();
  }, [categories]);

  async function getCategories() {
    try {
      const categoryList = await axios.get(`${server}/category`);
      setCategories(categoryList.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function editCategory(category) {
    setAddNewCategoryStatus(true);
    setCategoryId(category._id);

    setName(category.name);
    setImagePath(category.image);

    window.scrollTo({ left: 0, top: 158 });
  }

  async function deleteCategory(id, name) {
    if (window.confirm(`Are you sure you want to delete ${name}`)) {
      await axios
        .delete(`${server}/category/${id}`)
        .then(getCategories())
        .catch((err) => console.log(err));
    }
  }

  function renderCategories() {
    return categories.map((category) => {
      return (
        <div key={category._id}>
          <div className="single-category">
            <h3>{category.name}</h3>
            <img
              src={category.image}
              alt={category.image}
              width="100"
              height="100"
            />
          </div>
          <button onClick={() => editCategory(category)}>Edit</button>
          <button onClick={() => deleteCategory(category._id, category.name)}>
            Delete
          </button>
          <hr />
        </div>
      );
    });
  }

  return (
    <div className="category-editor ">
      <div className="new-category box">
        <h2>{addNewCategoryStatus ? "Update Category" : "Add new Category"}</h2>
        <h3 className="margin-bottom">Available images</h3>
        {images.map((image) => {
          return (
            <img
              width="100"
              height="100"
              className="thumbnail"
              key={image._id}
              src={`${server}/media/${image.img}`}
              alt={image.img}
              onClick={() => setImagePath(`${server}/media/${image.img}`)}
            />
          );
        })}
        <br />
        <hr />

        <form onSubmit={saveCategory}>
          <label>Category title</label>

          <input
            type="text"
            placeholder="Category name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Select an image for the category</label>

          {/* img here */}
          {imagePath ? (
            <img src={imagePath} alt={imagePath} width="100" height="100" />
          ) : (
            <img src={noImage} alt={noImage} width="100" height="100" />
          )}
          <br />
          <button type="submit">
            {addNewCategoryStatus ? "Update category" : "Add new Category"}
          </button>
        </form>
        <button onClick={clearInput}>Clear</button>
      </div>
      <div className="edit-category box">
        <h2>Edit Categories</h2>
        {renderCategories()}
      </div>
    </div>
  );
}

export default NewCategory;

import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../util/server";
import "./CategorySelector.scss";

function CategorySelector(props) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("no category");

  useEffect(() => {
    getCategoies();
  }, []);

  useEffect(() => {
    props.adminSelectedCategory(selectedCategory);
  }, [selectedCategory]);

  async function getCategoies() {
    const categoryRes = await axios.get(`${server}/category`);
    setCategories(categoryRes.data);
  }

  return (
    <div className="categories">
      <select
        className="select-options"
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      >
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategorySelector;

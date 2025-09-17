// src/components/CategorySelector.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import categories from "../utils/CategoriesList";

const CategorySelector = ({ onCategoryChange, onSubcategoryChange }) => {
  const categoryObject = categories[0]; // because you wrapped everything in an array
  const categoryList = Object.keys(categoryObject);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedSubcategory(""); // reset subcategory
    onCategoryChange(value);
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    setSelectedSubcategory(value);
    onSubcategoryChange(value);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Category Dropdown */}
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="p-2 border rounded"
      >
        <option value="">-- Select Category --</option>
        {categoryList.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Subcategory Dropdown */}
      {selectedCategory && (
        <select
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          className="p-2 border rounded"
        >
          <option value="">-- Select Subcategory --</option>
          {categoryObject[selectedCategory].map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

CategorySelector.propTypes = {
  onCategoryChange: PropTypes.func.isRequired,
  onSubcategoryChange: PropTypes.func.isRequired,
};

export default CategorySelector;

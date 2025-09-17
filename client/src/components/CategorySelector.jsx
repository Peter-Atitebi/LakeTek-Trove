import PropTypes from "prop-types";
import categories from "../hooks/CategoriesList";
import {
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormHelperText,
  Box,
  TextField,
} from "@mui/material";

const CategorySelector = ({
  selectedCategory,
  selectedSubcategory,
  customSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  onCustomSubcategoryChange,
}) => {
  const categoryObject = categories[0]; // because you wrapped everything in an array
  const categoryList = Object.keys(categoryObject);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    onCategoryChange(value);
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    onSubcategoryChange(value);
  };

  const handleCustomSubcategoryChange = (e) => {
    const value = e.target.value;
    onCustomSubcategoryChange(value);
  };

  return (
    <Box>
      {/* Category Dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="category-select-label">Select Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          label="Select Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categoryList.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Subcategory Dropdown - only show when category is selected */}
      {selectedCategory && (
        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel id="subcategory-select-label">
            Select Subcategory
          </InputLabel>
          <Select
            labelId="subcategory-select-label"
            id="subcategory-select"
            label="Select Subcategory"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
          >
            {categoryObject[selectedCategory].map((sub) => (
              <MenuItem key={sub} value={sub}>
                {sub}
              </MenuItem>
            ))}
            {/* Add Custom option */}
            <MenuItem value="Custom">Custom</MenuItem>
          </Select>
        </FormControl>
      )}

      {/* Custom subcategory input */}
      {selectedSubcategory === "Custom" && (
        <TextField
          fullWidth
          label="Enter Custom Subcategory"
          value={customSubcategory}
          onChange={handleCustomSubcategoryChange}
          placeholder="Enter your custom subcategory"
          sx={{ mt: 2, mb: 1 }}
        />
      )}

      <FormHelperText>
        {!selectedCategory
          ? "Select a category first"
          : !selectedSubcategory
            ? "Now select a subcategory"
            : selectedSubcategory === "Custom" && !customSubcategory
              ? "Enter your custom subcategory"
              : "Category and subcategory selected"}
      </FormHelperText>
    </Box>
  );
};

CategorySelector.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  selectedSubcategory: PropTypes.string.isRequired,
  customSubcategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onSubcategoryChange: PropTypes.func.isRequired,
  onCustomSubcategoryChange: PropTypes.func.isRequired,
};

export default CategorySelector;

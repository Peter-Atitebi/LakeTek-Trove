// src/pages/seller/partials/SellerProductsTemplate.jsx

import AddProduct from "../../../components/products/AddProduct";
import { useState } from "react";

const SellerProductsTemplate = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const handleOnClose = () => {
    setIsAddProductOpen(false);
  };

  const handleOnSave = () => {
    setIsAddProductOpen(false);
  };

  const handleOpenAddProduct = () => {
    setIsAddProductOpen(true);
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-4">Products</h1>
          </div>
          <div>
            <button
              onClick={handleOpenAddProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Add product */}
      <AddProduct
        onClose={handleOnClose}
        onSave={handleOnSave}
        open={isAddProductOpen}
      />
    </>
  );
};

export default SellerProductsTemplate;
